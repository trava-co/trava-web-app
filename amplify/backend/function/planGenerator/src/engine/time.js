const tf = require('@tensorflow/tfjs-core')
require('@tensorflow/tfjs-backend-cpu')

const eatTimes = (busyness) => {
  switch (busyness) {
    case 0: {
        return {
            breakfast: 9,
            lunch: 13,
            dinner: 18
        }
    }
    case 1: {
        return {
            breakfast: 9,
            lunch: 12,
            dinner: 18
        }
    }
    default: {
      return {
        breakfast: 8,
        lunch: 12,
        dinner: 18
      }
    }
  }
}

const endTimes = {
  0: 23,
  1: 23,
  2: 23
}


const timeAllocsFunc = (busyness) => {
  switch (busyness) {
    case 0: {
      return {
        morning: 2,
        afternoon: 3,
        evening: 3,
        breakfast: 2,
        lunch: 2,
        dinner: 2
      }
    }
    case 1: {
        return {
            morning: 2,
            afternoon: 4,
            evening: 4,
            breakfast: 2,
            lunch: 2,
            dinner: 2
        }
    }
    default: {
        return {
          morning: 3,
          afternoon: 5,
          evening: 3,
          breakfast: 2,
          lunch: 2,
          dinner: 2
        }
    }
  }
}

exports.timeOfDay = (time, busyness) => {
  if (time < eatTimes(busyness).lunch) {
    return 'morning'
  }

  if (time < eatTimes(busyness).dinner) {
    return 'afternoon'
  }

  return 'evening'
}

exports.toEndofDayTime = (time, dayEndTime, busyness) => {
  let diffTime = dayEndTime - time
  if (time < eatTimes(busyness).lunch) {
    return Math.min(eatTimes(busyness).lunch - time, diffTime)
  }

  if (time < eatTimes(busyness).dinner) {
    return Math.min(eatTimes(busyness).dinner - time, diffTime)
  }

  return diffTime
}

exports.configureTime = async ({ group, config }) => {
  /*
  Splits do attractions and eat attractions for separate DP optimization
   */

  const {startTime, endTime} = group

  let dayStartTime = tf.add(tf.zeros([group.nDays]), eatTimes(config.busyness).breakfast).arraySync()
  let dayEndTime = tf.add(tf.zeros([group.nDays]), endTimes[config.busyness]).arraySync()
  let timeAllocsPerDay = tf.zeros([group.nDays]).arraySync().map(_ => timeAllocsFunc(config.busyness))

  switch (startTime) {
    case 'morning': {
      dayStartTime[0] = eatTimes(config.busyness).lunch

      timeAllocsPerDay[0].morning = 0
      timeAllocsPerDay[0].breakfast = 0
      break
    }
    case 'afternoon': {
      dayStartTime[0] = eatTimes(config.busyness).dinner
      dayEndTime[0] = dayEndTime[0] - 1

      timeAllocsPerDay[0].morning = 0
      timeAllocsPerDay[0].afternoon = 0
      timeAllocsPerDay[0].breakfast = 0
      timeAllocsPerDay[0].lunch = 0
      break
    }
    case 'evening': {
      dayStartTime[0] = 22

      timeAllocsPerDay[0].morning = 0
      timeAllocsPerDay[0].afternoon = 0
      timeAllocsPerDay[0].evening = 0
      timeAllocsPerDay[0].breakfast = 0
      timeAllocsPerDay[0].lunch = 0

      break
    }
  }

  switch (endTime) {
    case 'morning': {
      timeAllocsPerDay[timeAllocsPerDay.length - 1].morning = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].afternoon = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].evening = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].breakfast = 1
      timeAllocsPerDay[timeAllocsPerDay.length - 1].lunch = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].dinner = 0

      dayEndTime[dayEndTime.length - 1] = eatTimes(config.busyness).breakfast

      break
    }
    case 'afternoon': {
      timeAllocsPerDay[timeAllocsPerDay.length - 1].afternoon = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].evening = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].dinner = 0

      dayEndTime[dayEndTime.length - 1] = eatTimes(config.busyness).lunch + 1

      break
    }
    case 'evening': {
      timeAllocsPerDay[timeAllocsPerDay.length - 1].evening = 0
      timeAllocsPerDay[timeAllocsPerDay.length - 1].dinner = 0

      dayEndTime[dayEndTime.length - 1] = eatTimes(config.busyness).dinner

      break
    }
  }

  const timeAllocs = timeAllocsPerDay.reduce((prev, curr) => {
    const a = Object.keys(curr).map(key => [key, prev[key] + curr[key]])
    return Object.fromEntries(a)
  })

  const maxHoursPerDay = timeAllocsPerDay.map(dayTimeAllocs => {
    return Object.values(dayTimeAllocs).reduce((prev, curr) => prev + curr)
  })


  return ({
    maxHoursPerDay,
    dayStartTime,
    dayEndTime,
    timeAllocs,
    timeAllocsPerDay,
    eatTimes: eatTimes(config.busyness)
  })
}
