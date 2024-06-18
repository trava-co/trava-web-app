const { order } = require('./order')
const { configureTime } = require('./time')

exports.Scheduler = async (args) => {
  args = {
    ...args,
    config: {
      busyness: 2,
      breakfast: true,
      weights: {
        rating: 1,
        distance: -8,
        category: 0,
        dayTime: 0,
        ...args?.config?.weights
      },
      thresholds: {
        rating: 0,
        ...args?.config?.thresholds,
      },
      maxPreferredTimes: 3,
      ...args?.config
    }
  }

  args.config.time = await configureTime(args)

  return await order({
    ...args
  })
}