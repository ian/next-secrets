import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from "next"
import { getConfig, setConfig, listEnv, env } from "./env"
import { setCache } from './cache'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404)
    return
  }

  if (req.method === "GET") {
    handleUI(req,res)
  } else if (req.method === "POST") {
    handleLoad(req,res)
  } else if (req.method === "PUT") {
    handleUpdate(req,res)
  } else if (req.method === "OPTIONS") {
    res.send("OK")
  } else {
    res.status(404)
  }
}

async function handleUI(req, res) {
  const baseDir = path.resolve('./node_modules/next-secrets/dist/')
  const file = fs.readFileSync(baseDir + "/ui.html")
  
  res.setHeader("Content-Type", "text/html")
  res.send(file.toString())
}

async function handleLoad(req, res) {
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
}

async function handleUpdate(req,res) {
  const json = JSON.parse(req.body)
  
  await setConfig(req.query.env, json)

  res.send("OK")
}