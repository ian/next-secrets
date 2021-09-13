import fs from 'fs'
import path from 'path'

const filename = path.resolve('./.next/secrets')

export async function getCache() {
  const file = fs.readFileSync(filename)
  // console.log(file.toString())
  // process.exit()
  return JSON.parse(file.toString())
} 

export async function setCache(vars) {
  fs.writeFileSync(filename, JSON.stringify(vars))
}