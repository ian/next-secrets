import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from "next"

import { get, set, list } from "./redis"
import { encrypt, decrypt } from "./encryption"

export const env =
  process.env.NEXTSECRETS_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV

if (!env) {
  throw new Error(
    "Unable to figure out env for next-secrets, either set VERCEL_ENV, NODE_ENV, or NEXTSECRETS_ENV"
  )
}

export function withSecrets(inner, keys = null) {
  if (!process.env.NEXTSECRETS_TOKEN)
    throw new Error("Missing NEXTSECRETS_TOKEN in env, please set.")

  return async (req, res) => {
    let start_time = new Date().getTime()
    const secrets = await getConfig(env).catch(console.error)

    console.log("[next-secrets] Time elapsed:", new Date().getTime() - start_time, "ms")
    req.secrets = secrets

    return inner(secrets)(req, res)
  }
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

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404)
    return
  }

  // res.setHeader("Access-Control-Allow-Origin", "*")
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  // )
  // res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
  
  if (req.method === "GET") {
    const { nextsecrets } = req.query
    console.log({nextsecrets})
    const filename = Array(nextsecrets).join('/') === "ui" ? "index.html" : nextsecrets
    // res.send(file)
    const baseDir = path.resolve('./node_modules/next-secrets/dist/ui/')
    const file = fs.readFileSync(baseDir + "/" + filename)
    
    console.log({ nextsecrets, baseDir, file })
    res.send(file)
  } else if (req.method === "POST") {
    if (req.query.env) {
      const config = await getConfig(req.query.env)
      res.json(config)
    } else {
      const available = await listEnv()
      res.json({
        current: env,
        available,
      })
    }
  } else if (req.method === "PUT") {
    await setConfig(req.query.env, req.body)
    res.send("OK")
  } else if (req.method === "OPTIONS") {
    res.send("OK")
  } else {
    res.status(404)
  }
}
