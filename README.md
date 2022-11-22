> DEPRECATED - this repository is no longer necessary now that Vercel supports 64KB environments: https://vercel.com/changelog/16x-larger-environment-variable-storage-up-to-64kb

# next-secrets

Extended secrets / env management for next serverless.

## Inspiration

If you've ever seen this message on Vercel, you'll know that there's a limitation on AWS Lambda that caps total env size at 4K.

![Vercel Error](https://raw.githubusercontent.com/ian/next-secrets/main/docs/error-big.png)

Vercel has a support article as a workaround which suggests an endpoint architecture to pull and load env vars.

> [https://vercel.com/support/articles/how-do-i-workaround-vercel-s-4-kb-environment-variables-limit](https://vercel.com/support/articles/how-do-i-workaround-vercel-s-4-kb-environment-variables-limit)

This repo is an implementation of this.

## Installation

### 1. Install the repository in your next project:
  
  `yarn add next-secrets`

### 2. You'll need a Redis server to store/load secrets from, we highly recommend Upstash for this
[https://www.upstash.com/](https://www.upstash.com/)

### 3. Add the required variables to your .env

```
NEXTSECRETS_REDIS_URL=...your redis url...
NEXTSECRETS_TOKEN=...make up a secret to use...
```

If you want to force `next-secrets` to use a specific env, set the env var:

```
NEXTSECRETS_ENV=preview
```

> Note: By default, next-secrets will assign the env based on the following order: 
1. process.env.NEXTSECRETS_ENV 
2. process.env.VERCEL_ENV 
3. process.env.NODE_ENV

### 4. Run `secrets cache`

This will persist your config for next to use, if you don't run this you'll receive an error.

### 5. Wrap any API endpoints that you need access to these vars:

```
# /pages/api/myendpoint.ts

import { withSecrets } from "next-secrets"

export default withSecrets((secrets) => {
  return async (req, res) => {

    // ... do something with secrets.xyz

  }
})
```

And that's it! Your endpoints will have access to the shared secrets.
## Admin Interface

next-secrets comes with an admin interface for controlling `development`, `preview`, and `production` environments.

![UI](https://raw.githubusercontent.com/ian/next-secrets/main/docs/ui.png)

To install, first add a file `secrets.ts` (or secrets.js) in `pages/api`:

```
# /pages/api/secrets.tsx

import { handler } from "next-secrets"
export default handler
```

Then, start your next server and head over to [http://localhost:3000/api/secrets](http://localhost:3000/api/secrets) to configure your environments.


_Note: This page is only available in `development` env_
