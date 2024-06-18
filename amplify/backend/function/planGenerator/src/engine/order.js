const { getDistanceString, getTravelTimeBatch } = require('../utils/db')
const { MatrixFactorization } = require('./matrixFactorization')

const dayjs = require('dayjs')

const tf = require('@tensorflow/tfjs-core')
require('@tensorflow/tfjs-backend-cpu')

const kmeans = require('ml-kmeans');

const {timeOfDay, toEndofDayTime} = require('./time')

let RATING_WEIGHT = null
let DISTANCE_WEIGHT = null
let CATEGORY_WEIGHT = null
let DAYTIME_WEIGHT = null
let CENTROIDS = null

const META_IDX_SEPARATOR = '--meta:'

exports.order = async ({ attractions, group, config }) => {
  /*
  Heuristic based ordering system. Given a set of best attractions that need to
  find their place in the plan order them such the within day distance is minimized.
  This is obtained by starting the day with the currently available best attraction
  then follow it by the next closest attraction.
   */

  RATING_WEIGHT = config.weights.rating
  DISTANCE_WEIGHT = config.weights.distance
  CATEGORY_WEIGHT = config.weights.category
  DAYTIME_WEIGHT = config.weights.dayTime

  const categoryObj = {}
  const excludeIds = []

  const {ratings} = group

  let numVotesByAttractionIndex = [];
  let numYesVotesByAttractionIndex = [];

  if (ratings && ratings.length > 0) {
    for (let i = 0; i < ratings[0].length; i++) {
      let numVotes = 0;
      let hasYesVote = 0;
      for (let j = 0; j < ratings.length; j++) {
        if (ratings[j][i] === 1) {
          numVotes++;
          hasYesVote++;
        } else if (ratings[j][i] === -1) {
          numVotes++;
        }
      }
      numVotesByAttractionIndex.push(numVotes);
      numYesVotesByAttractionIndex.push(hasYesVote);
    }
  }

  const { meanRatings, rightSwipeRatio } = parseRatings(group)

  attractions = attractions.map((attraction, i) => ({...attraction, rating: meanRatings[i], rightSwipeRatio: rightSwipeRatio[i], numYesVotes: numYesVotesByAttractionIndex[i], numVotes: numVotesByAttractionIndex[i]}))


  const popularAttractions = attractions.filter(attr => attr.rating > 0)
  const locs = popularAttractions.flatMap(attr => attr.locations.map(loc => [loc.startLoc.coords.long, loc.startLoc.coords.lat]))
  const nonpopularLocs = attractions.flatMap(attr => attr.locations.map(loc => [loc.startLoc.coords.long, loc.startLoc.coords.lat]))

  let meanPos = tf.mean(locs, 0)

  const eucDist = (a, b) => tf.sum(tf.pow(tf.sub(a, b), 2)).arraySync()

  if (locs.length > (group.nDays || 1) + 3) {
    const clusters = kmeans(locs, (group.nDays || 1) + 3, {seed: 1})
    CENTROIDS = clusters.centroids.filter(cluster => cluster.size > 7)
    CENTROIDS = CENTROIDS.map(cluster => cluster.centroid)

    CENTROIDS = CENTROIDS.sort((a, b) => eucDist(tf.tensor(a), meanPos) - eucDist(tf.tensor(b), meanPos))
  } else if (nonpopularLocs > (group.nDays || 1) + 3) {
    meanPos = tf.mean(nonpopularLocs, 0)

    const clusters = kmeans(nonpopularLocs, (group.nDays || 1) + 3, {seed: 1})
    CENTROIDS = clusters.centroids.filter(cluster => cluster.size > 10)
    CENTROIDS = CENTROIDS.map(cluster => cluster.centroid)

    CENTROIDS = CENTROIDS.sort((a, b) => eucDist(tf.tensor(a), meanPos) - eucDist(tf.tensor(b), meanPos))
  } else {
    meanPos = tf.mean(nonpopularLocs, 0)
    CENTROIDS = [meanPos]
  }

  tf.range(CENTROIDS.length, group.nDays + 0).arraySync().forEach(() => {
    CENTROIDS.splice(0, 0, CENTROIDS[0])
  })

  attractions = await setupAttractions({attractions, group, config})

  const dayScheduler = _scheduleDay({group, config, attractions, categoryObj, excludeIds})

  const plan = tf
      .range(1, group.nDays, 1)
      .arraySync()
      .map(dayScheduler)

  // Schedule first day last
  const firstDayPlan = dayScheduler(0)
  plan.unshift(firstDayPlan)

  return { plan }
}

function _scheduleDay({group, config, attractions, categoryObj, excludeIds}) {
  return day => {
    let weekday = (dayjs(group.startDate.toString(), 'YYYYMMDD', true).day() + day) % 7

    const date = dayjs(group.startDate.toString(), 'YYYYMMDD', true).add(day, 'day')

    let noLunchAssigned = true
    let noDinnerAssigned = true
    let previousAttraction = null

    let time = config.time.dayStartTime[day]
    let order = 0
    let dayTime = 'morning'
    let canBeSnack = true

    const dayPlan = []

    const timeAllocsForDay = config.time.timeAllocsPerDay[day]

    let breakfastScheduled = false

    while (time <= config.time.dayEndTime[day] && attractions.length) {
      dayTime = timeOfDay(time, config.busyness)

      const res = {
        day,
        order,
      }
      // Choose order as either the best option or closest to the previous
      // i.e. if the first event of the day, choose best available.
      // if next event choose closest.

      let attraction

      // Add breakfast closest to first attraction
      if (dayPlan.length === 0 && timeAllocsForDay.breakfast > 0 && !breakfastScheduled) {
        if (!config.breakfast) {
          breakfastScheduled = true
          const duration = config.busyness < 1 ? 2 : 1
          time = config.time.dayStartTime[day] + duration
          continue
        }
        attraction = selectAttraction(
            attractions,
            'breakfast',
            'eat',
            excludeIds,
            previousAttraction,
            categoryObj,
            config.thresholds,
            time,
            weekday,
            config.time.dayEndTime[day],
            false,
            day,
            date,
            config.busyness
        )

        attraction.attractionId = attraction.attractionId.split(META_IDX_SEPARATOR)[0] // Remove meta info
        res.attractionId = attraction.attractionId
        res.rating = attraction.rating
        res.locId = attraction.locId

        excludeIds.push(attraction.attractionId)

        dayPlan[0] = res

        const duration = config.busyness < 1 ? 2 : 1
        time = config.time.dayStartTime[day] + duration

        order++

        breakfastScheduled = true

        if (attraction.attractionId !== 'noop') {
          previousAttraction = attraction
        }

        continue
      }

      // If it is time for lunch
      if (time >= config.time.eatTimes.lunch && noLunchAssigned && timeAllocsForDay.lunch > 0) {
        attraction = selectAttraction(attractions, 'lunch', 'eat', excludeIds, previousAttraction, categoryObj, config.thresholds, time, weekday, config.time.dayEndTime[day], false, day, date, config.busyness)
        noLunchAssigned = false
        attraction.duration = config.busyness < 2 ? 2 : 1 // Lunch only takes 1h, except for busyness == 0
      } else if (time >= config.time.eatTimes.dinner && noDinnerAssigned && timeAllocsForDay.dinner > 0) {
        attraction = selectAttraction(attractions, 'dinner', 'eat', excludeIds, previousAttraction, categoryObj, config.thresholds, time, weekday, config.time.dayEndTime[day], false, day, date, config.busyness)
        noDinnerAssigned = false
        attraction.duration = 2
      } else {
        attraction = selectAttraction(attractions, dayTime, 'do', excludeIds, previousAttraction, categoryObj, config.thresholds, time, weekday, config.time.dayEndTime[day], canBeSnack, day, date, config.busyness)
      }

      if (attraction.preferredTime && attraction.preferredTime[0] === 'snack') {
        canBeSnack = false
        attraction.duration = 0
      }

      let travelTime = 0
      if (previousAttraction) {
        if (attraction.attractionId === 'noop') {
          travelTime = 1
        } else {
          travelTime = previousAttraction.travelTime[attraction.attractionId] || 0

          // Clip travel time to [0, 1]
          if (travelTime > 1) {
            travelTime = 1
          }
        }
      }

      if (attraction.attractionId !== 'noop') {
        previousAttraction = attraction
      }

      attraction.attractionId = attraction.attractionId.split(META_IDX_SEPARATOR)[0] // Remove meta info
      res.attractionId = attraction.attractionId
      res.rating = attraction.rating
      res.locId = attraction.locId
      excludeIds.push(attraction.attractionId)
      categoryUpdate(categoryObj, attraction.category)

      dayPlan.push(res)

      if (config.busyness === 0 && (attraction.type !== 'eat' || attraction.preferredTime[0] === 'snack')) {
        time += toEndofDayTime(time, config.time.dayEndTime[day], config.busyness) + 0.01
      } else {
        time += (attraction.duration || 1) + travelTime
      }

      order++

    }

    return dayPlan
  }
}

async function setupAttractions({attractions, group, config}) {
  attractions = attractions.sort((a, b) => b.rating - a.rating)

  // Parsing attractions.preferredTime to have correct value.
  attractions = attractions.map(attraction => {
    if (!attraction.preferredTime) {
      return attraction
    }

    // If preferredTime is breakfast, then only use it for breakfast.
    if (config.breakfast) {
      if (attraction.preferredTime[0] === 'breakfast') {
        attraction.preferredTime = ['breakfast']
      }
    }

    if (typeof attraction.preferredTime == "string" || attraction.preferredTime instanceof String) {
      return {...attraction, preferredTime: [attraction.preferredTime]}
    }

    return {...attraction, preferredTime: attraction.preferredTime.slice(0, config.maxPreferredTimes)}
  })

  // one item for each location, to consider each location separately
  attractions = attractions.flatMap(attr => {
    return attr.locations.flatMap((location, i) => {
      const {locations, ...restAttr} = attr
      return {
        ...restAttr,
        attractionId: `${attr.attractionId}${META_IDX_SEPARATOR}${i}`,
        locId: location.id,
        startLoc: location.startLoc,
        endLoc: location.endLoc,
      }
    })
  })

  let dist = await distanceMatrix(attractions)
  const timesArr = dist.times.arraySync()

  const attractionIds = attractions.map(attraction => attraction.attractionId)

  const locMatrix = Object.fromEntries(attractions.flatMap(function (attr1, i) {
    return attractions.map(function (attr2, j) { return [[i,j], getDistanceString([attr1.endLoc.coords.long, attr1.endLoc.coords.lat], [attr2.startLoc.coords.long, attr2.startLoc.coords.lat])] })
  }))

  const travelTimes = await getTravelTimeBatch(Object.values(locMatrix))

  return attractions.map(function (attr, i) {
    const times = attractionIds.map(function(e, j) {
      const distanceString = getDistanceString([attr.endLoc.coords.long, attr.endLoc.coords.lat], [attractions[j].startLoc.coords.long, attractions[j].startLoc.coords.lat])
      if (distanceString in travelTimes) {
        return [e, travelTimes[distanceString]]
      }
      return [e, timesArr[i][j]]
    })

    return {
      ...attr,
      travelTime: Object.fromEntries(times)
    }
  })
}

const categoryUpdate = (categoryObj, category) => {
  Object.keys(categoryObj).forEach(cat => {
    categoryObj[cat] *= 0.9
  })

  if (category) {
    if (!categoryObj[category]) {
      categoryObj[category] = 0
    }
    categoryObj[category] += 1 // Set to zero to not penalize the algorithm for same categories.
  }
}

const distanceMatrix = (attractions) => {
  /*
  Computes the Euclidean distance between all available attractions.
  Returns a distance matrix M, such that M[i][j] = sqrt(p_i**2 + p_j**2),
  where p_i is the i-th attraction.
   */

  // End loc and start loc flipped, because distance is computed from the end of previous to the start of the next.
  const startXLocs = tf.tensor([attractions.map(attraction => attraction.endLoc.coords.long)])
  const startYLocs = tf.tensor([attractions.map(attraction => attraction.endLoc.coords.lat)])

  const endXLocs = tf.tensor([attractions.map(attraction => attraction.startLoc.coords.long)])
  const endYLocs = tf.tensor([attractions.map(attraction => attraction.startLoc.coords.lat)])

  const xdiff = tf.sub(startXLocs, tf.transpose(endXLocs))
  const ydiff = tf.sub(startYLocs, tf.transpose(endYLocs))

  const eucDist = tf.pow(tf.add(tf.pow(xdiff, 2), tf.pow(ydiff, 2)), 0.5)
  const times = tf.mul(eucDist, 6)

  return {
    times: tf.transpose(times)
  }
}

function checkAttractionLocationHours(attraction, weekday, currentTime) {
  // weekday is an index where 0 = Sunday, currentTime is an integer 0-24
  // Define a helper function to convert Google's time format to hours.
  const convertTimeToHours = (timeStr) => {
    return parseInt(timeStr.slice(0,2)) + parseInt(timeStr.slice(2))/60;
  }

  // handle "always open"
  // if attraction has no hours, then return true
  if (!attraction.startLoc.hours?.periods?.length) {
    return true
  }

  // * Google: Clients can rely on always-open being represented as an `open` period containing `day` with value 0 and `time` with value 0000, and no `close`.
  const firstPeriod = attraction.startLoc.hours?.periods?.[0]
  const firstPeriodIsSunday = firstPeriod?.open?.day === 0
  const firstPeriodAlwaysOpen = firstPeriodIsSunday && firstPeriod?.open?.time === "0000" && !firstPeriod?.close
  
  if (firstPeriodAlwaysOpen) {
    return true
  }

  // Identify the periods for the given weekday.
  const periodsForDay = attraction.startLoc.hours.periods.filter(period => period.open.day === weekday);

  // If there are no periods for this day, the attraction is closed.
  if (periodsForDay.length === 0) return false;

  // Check each period to see if the current time falls within the open and close times.
  for (let period of periodsForDay) {
    const openTimeInHours = convertTimeToHours(period.open.time);
    let closeTimeInHours = convertTimeToHours(period.close.time);

    if (openTimeInHours > closeTimeInHours) {
      closeTimeInHours += 24
    }

    // The attraction is open if the current time is after the open time and before the close time.
    if (currentTime + 1 >= openTimeInHours && currentTime < closeTimeInHours) {
      return true
    }
  }

  return false;
}

function getAttractions(attractions, dayTime, type, excludeIds=[], thresholds, time, weekday, dayEndTime, canBeSnack, previousAttraction, date, busyness) {
  const remainingTime = toEndofDayTime(time, dayEndTime, busyness)

  return attractions.filter(attraction => {
    let rightSwipeRequirement = attraction.rightSwipeRatio >= thresholds.rating && attraction.numYesVotes > 0

    if (attraction.travaCard && attraction.numVotes === 0) {
      rightSwipeRequirement = true // Unique case when no swipes where made.
    }

    let correctTime = !attraction.preferredTime || attraction.preferredTime.includes(dayTime)
    let correctType = attraction.type === type || (type === 'do' && !attraction.type)

    if (attraction.preferredTime && attraction.preferredTime[0] === 'breakfast' && dayTime !== 'breakfast') {
      correctTime = false
    }

    if (attraction.preferredTime && attraction.preferredTime.length
        && attraction.preferredTime[0] === 'snack' && (dayTime === 'afternoon' || dayTime === 'evening')
        && canBeSnack) {
      correctTime = true
      correctType = true
    }

    if (attraction.preferredTime && attraction.preferredTime.length && attraction?.preferredTime[0] === 'snack' && !canBeSnack) {
        correctTime = false
    }

    const notExcluded = !excludeIds.find(ids => attraction.attractionId.includes(ids))

    const timeLeeway = {
      0: 0.5,
      1: 0.5,
      2: 1.5,
    }

    let enoughTime = true
    if (['morning', 'afternoon', 'evening'].includes(dayTime)) {
      const duration = attraction.duration + 2 * (previousAttraction?.travelTime[attraction.attractionId] || 0)
      enoughTime = (duration || 1) <= remainingTime

      if (!enoughTime && duration < remainingTime + timeLeeway[busyness]) {
        attraction._duration = remainingTime - 2 * (previousAttraction?.travelTime[attraction.attractionId] || 0)
        enoughTime = true
      }

      if (remainingTime <= 1) {
        enoughTime = false
      }
    }

    let isOpen = checkAttractionLocationHours(attraction, weekday, time)

    if (attraction?.seasons?.length) {
        const season = attraction.seasons.some(s => {
          const startMonth = s.startMonth
          const startDay = s.startDay

          const endMonth = s.endMonth
          const endDay = s.endDay

          const currentMonth = date.month()
          const currentDay = date.day()

          if (currentMonth > startMonth && currentMonth < endMonth) {
            return true
          }
          if (startMonth !== endMonth) {
            if (currentMonth === startMonth && currentDay >= startDay) {
              return true
            }

            if (currentMonth === endMonth && currentDay <= endDay) {
              return true
            }
          } else {
            if (currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay) {
              return true
            }
          }

          return false
        })

        if (!season) {
            isOpen = false
        }
    }

    return correctTime && correctType && notExcluded && rightSwipeRequirement && enoughTime && isOpen
  })
}

function selectAttraction(attractions, dayTime, type, excludeIds, previousAttraction, categoryObj, thresholds, time, weekday, dayEndTime, canBeSnack, day, date, busyness) {
  const availableAttractions = getAttractions(attractions, dayTime, type, excludeIds, thresholds, time, weekday, dayEndTime, canBeSnack, previousAttraction, date, busyness)
  if (availableAttractions.length === 0) {
    return emptyAttraction
  }

  const reward = calculateReward(availableAttractions, previousAttraction, categoryObj, dayTime, excludeIds, day, time)
  const attractionId = tf.argMax(reward).arraySync()

  const attraction = availableAttractions[attractionId]

  if (!attraction) {
    return emptyAttraction
  }

  return attraction
}

function parseRatings({ ratings }) {
  /*
  Computes the ratings matrix as the mean rating
  [-1 swipeLeft, 0 no swipe, 1 swipeRight]
   */
  let ratingsPerUser = tf.tensor(ratings)

  const mf = new MatrixFactorization()

  let tries = 0;
  while (!mf.converged && tries < 3) {
    ratingsPerUser = mf.train(ratingsPerUser);
    mf.learningRate /= 10; // Reduce learning rate
    tries++;
  }

  const rightSwipes = tf.sum(tf.relu(ratingsPerUser), 0)
  const numberOfUsers = ratingsPerUser.shape[0]
  const rightSwipeRatio = tf.div(rightSwipes, numberOfUsers)

  return {
    meanRatings: tf.mean(ratingsPerUser, 0).arraySync(),
    rightSwipeRatio: rightSwipeRatio.arraySync()
  }
}

const emptyAttraction = {
  attractionId: 'noop',
  duration: 0.25,
  locId: 'noop-1',
  travelTime: {}
}

function calculateReward(availableAttractions, previousAttraction, categoryObj, dayTime, excludeIds, day, time) {
  const dayTimeBoost = tf.tensor(availableAttractions.map(attr => {
    if (attr.preferredTime && attr.preferredTime.length) {
      return + (attr.preferredTime[0] === dayTime)
    }
    return 0
  }))

  const ratings = tf.tensor(availableAttractions.map(attr => attr.rating))
  const attrIds = availableAttractions.map(attr => attr.attractionId)

  const categories = tf.tensor(availableAttractions.map(attr => categoryObj[attr.category] || 0))

  const startEndChange = tf.tensor(availableAttractions.map(attr => {
    return + (attr.startLoc.coords.long !== attr.endLoc.coords.long || attr.startLoc.coords.lat !== attr.endLoc.coords.lat)
  }))

  let dists = tf.zeros(ratings.shape)
  if (previousAttraction?.travelTime) {
    dists = tf.tensor(attrIds.map(idx => previousAttraction?.travelTime[idx]))
  } else {
    const centroid = tf.tensor([CENTROIDS[day]])

    const locs = tf.tensor(availableAttractions.map(attr => [attr.startLoc.coords.long, attr.startLoc.coords.lat]))

    dists = tf.sum(tf.pow(tf.sub(centroid, locs), 2), 1)
  }

  const ratingReward = tf.mul(RATING_WEIGHT, ratings)
  const distReward = tf.add(tf.mul(DISTANCE_WEIGHT, dists), 2)
  const categoryReward = tf.mul(CATEGORY_WEIGHT, categories)
  const dayTimeBoostReward = tf.mul(DAYTIME_WEIGHT, dayTimeBoost)

  // Tiny cost to split the tie between two locations at exactly the same location, but one takes you further out.
  const selfDistanceCost = tf.mul(-0.01, startEndChange)

  const rewards = tf.stack([ratingReward, distReward, categoryReward, dayTimeBoostReward, selfDistanceCost])

  return tf.sum(rewards, 0)
}