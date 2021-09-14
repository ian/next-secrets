import fs from 'fs'
import path from 'path'

// In dev, next will clear out the .next/server folder on builds.
// On vercel, the only dir that's persisted during slugification is .next/server
const filename = path.resolve(process.env.NODE_ENV === "development" ? "./.next" : "./.next/server/secrets")

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
  fs.writeFileSync(filename, JSON.stringify(vars))
}