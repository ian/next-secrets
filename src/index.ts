import { getConfig, env } from "./env"

export * from "./env"
export { handler } from "./handler"

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

