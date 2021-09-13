import redis from "redis"

const createClient = () => {
  if (!process.env.NEXTSECRETS_REDIS_URL) {
    throw new Error("Missing NEXTSECRETS_REDIS_URL, please set in .env")
  }
  
  const redisConfig = {
    url: process.env.NEXTSECRETS_REDIS_URL,
  }

  return redis.createClient(redisConfig)
}

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
