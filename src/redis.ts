import redis from "redis"

if (!process.env.NEXTSECRETS_REDIS_URL) {
  throw new Error("Missing NEXTSECRETS_REDIS_URL, please set in .env")
}

const redisConfig = {
  url: process.env.NEXTSECRETS_REDIS_URL,

  // max_clients: 30, // optional
  // database: 0, // optional

  // retry_strategy: function (options) {
  //   if (options.error && options.error.code === "ECONNREFUSED") {
  //     // End reconnecting on a specific error and flush all commands with
  //     // a individual error
  //     return new Error("The server refused the connection")
  //   }
  //   if (options.total_retry_time > 1000 * 60 * 60) {
  //     // End reconnecting after a specific timeout and flush all commands
  //     // with a individual error
  //     return new Error("Retry time exhausted")
  //   }
  //   if (options.attempt > 10) {
  //     // End reconnecting with built in error
  //     return undefined
  //   }
  //   // reconnect after
  //   return Math.min(options.attempt * 100, 3000)
  // },
  // max_attempts: 1,
}

const createClient = () => redis.createClient(redisConfig)

export async function get(key) {
  const client = createClient()

  return new Promise((resolve, reject) => {
    client.get(key, function (err, reply) {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  }).finally(() => client.quit())
}

export async function set(key, value) {
  const client = createClient()

  return new Promise((resolve, reject) => {
    client.set(key, value, function (err, reply) {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  }).finally(() => client.quit())
}

export async function list() {
  const client = createClient()

  return new Promise((resolve, reject) => {
    client.keys("*", function (err, reply) {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  }).finally(() => client.quit())
}
