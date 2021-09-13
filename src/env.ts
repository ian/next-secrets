
import { get, set, list } from "./redis"
import { encrypt, decrypt } from "./encryption"

export const env =
  process.env.NEXTSECRETS_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV

if (!env) {
  throw new Error(
    "Unable to figure out env for next-secrets, either set VERCEL_ENV, NODE_ENV, or NEXTSECRETS_ENV"
  )
}

export const getConfig = async (env) => {
  if (!process.env.NEXTSECRETS_TOKEN)
    throw new Error("Missing NEXTSECRETS_TOKEN in env, please set.")

  return get(env)
    .then((encrypted) => {
      if (!encrypted) return {}
      const reply = decrypt(encrypted)
      return reply ? JSON.parse(reply) : {}
    })
    .catch(console.error)
}

export const setConfig = async (env, config) => {
  if (!process.env.NEXTSECRETS_TOKEN)
    throw new Error("Missing NEXTSECRETS_TOKEN in env, please set.")

  const json = JSON.stringify(config, null, 2)
  return set(env, encrypt(json))
}

export const listEnv = async () => {
  return list()
}

