#!/usr/bin/env node

import { getConfig, env } from "./env"
import { setCache } from "./cache"

async function run() {
  const config = await getConfig(env)
  await setCache(config)
}

run()