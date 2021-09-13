import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from "next"
import { getConfig, setConfig, listEnv, env } from "./env"

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404)
    return
  }

  if (req.method === "GET") {
    const baseDir = path.resolve('./node_modules/next-secrets/dist/')
    const file = fs.readFileSync(baseDir + "/ui.html")
    
    res.setHeader("Content-Type", "text/html")
    res.send(file.toString())
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
    await setConfig(req.query.env, JSON.parse(req.body))
    res.send("OK")
  } else if (req.method === "OPTIONS") {
    res.send("OK")
  } else {
    res.status(404)
  }
}
