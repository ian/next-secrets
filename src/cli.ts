#!/usr/bin/env node

import { getConfig, env } from "./env"
import { setCache } from "./cache"

if (env === "development") {
  require('dotenv').config()
}

async function run() {
  const config = await getConfig(env)
  await setCache(config)
}

run()