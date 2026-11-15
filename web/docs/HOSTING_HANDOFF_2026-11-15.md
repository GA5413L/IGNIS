# Running and hosting IGNIS

IGNIS is a Next.js application using **Node.js 22.13 or newer within 22.x**. Python is optional for reproducing scientific figures and is not needed to host the website.

## Local production build

From `web/`:

```sh
npm ci --include=dev
npm run build
npm start
```

The start script listens on `0.0.0.0` and respects the host's `PORT` environment variable, defaulting to 3000. The build script retains webpack. Keep the committed lockfile and include development dependencies during the build.

## Render web service

| Setting | Value |
| --- | --- |
| Runtime | Node.js 22.x |
| Root directory | `web` |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Pre-deploy command | Empty |
| Health-check path | `/api/health` |

Render's build command includes dependency installation. Running only `npm run build` on a clean checkout can fail with `next: not found`. If using a teammate's fork, synchronize it with the intended team commit first. After changing the build command, use **Manual Deploy > Clear build cache & deploy**. [Render documentation](https://render.com/docs/deploys#build-command).

On Vercel, select the Next.js preset and root `web`; use the same install/build steps. Startup is managed by its Next.js integration, so no start command is needed. This documentation does not claim a verified deployment on either provider.

## Environment and SI

The current research workflows and catalogue chat need no API key. Defaults keep `AI_ENABLED=false` and `CF_SI_ENABLED=false`. Live SI also requires accepted configuration and the existing security/accounting prerequisites; adding a token does not bypass them.

When private configuration is supplied, keep it server-side, outside `public/` and Git. A server environment file may be placed beside the deployed `web/package.json`; no Windows-specific credential mechanism is used. Never use `NEXT_PUBLIC_` for secrets.

The current SI quota store requires shared durable storage. It is not suitable for activation on isolated serverless filesystems or an ephemeral `/tmp` database. See [SI preparation](SI_PREPARATION.md) for the existing contracts; this cleanup does not activate or reconfigure them.

After deployment, verify `/`, `/console`, `/api/health` and `/api/catalog`, then exercise an existing research workflow and its export. The domain designated by the owner is `ignisatlas.earth`; hosting and DNS state are external to this repository record.
