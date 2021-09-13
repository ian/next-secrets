import Crypto from "crypto-js"

export function encrypt(text) {
  if (!process.env.NEXTSECRETS_TOKEN)
    throw new Error("Missing NEXTSECRETS_TOKEN in env, please set.")

  return Crypto.AES.encrypt(text, process.env.NEXTSECRETS_TOKEN).toString()
}

export function decrypt(encrypted) {
  if (!process.env.NEXTSECRETS_TOKEN)
    throw new Error("Missing NEXTSECRETS_TOKEN in env, please set.")

  const bytes = Crypto.AES.decrypt(encrypted, process.env.NEXTSECRETS_TOKEN)
  return bytes.toString(Crypto.enc.Utf8)
}
