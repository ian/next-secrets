import fs from 'fs'
import path from 'path'

const filename = path.resolve('./.next/server/secrets')

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