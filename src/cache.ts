import fs from 'fs'
import path from 'path'
import { env } from "./env"

// In dev, next will clear out the .next/server folder on builds.
// On vercel, the only dir that's persisted during slugification is .next/server
const filename = path.resolve(env === "development" ? "./.secrets" : "./.next/server/secrets")

export async function getCache() {
  const exists = fs.existsSync(filename)
  if (exists) {
    const file = fs.readFileSync(filename)
    return JSON.parse(file.toString())
  } else {
    throw new Error("Unable to locate secrets file. Please make sure to run `secrets cache`")
  }
} 

export async function setCache(vars) {
  await fs.promises.writeFile(filename, JSON.stringify(vars))
}