# Staging token handoff

For a Node staging server, upload the privately supplied `.env.production.local` beside the deployed application's `package.json` (the repository's `web/` directory), then rebuild/restart the app. Keep the file outside `public/` and any directory the web server serves as static files. The prepared private file is excluded from GitHub; `.env.example` lists names and empty placeholders only.

The credential name is `CF_AI_GATEWAY_TOKEN`. It is read by server code and sent in the `cf-aig-authorization` header only to the fixed HTTPS Cloudflare gateway. Redirects are rejected. It has no `NEXT_PUBLIC_` prefix and is not placed in browser code, browser storage, model prompts or export packets. Gateway diagnostics are withheld; exact configured-secret echoes stop the call before observers or HTTP receipts receive them, while numeric usage and unresolved reservations are retained.

This is an ordinary plaintext server configuration file. HTTPS encrypts the request in transit; encryption of the staging server's disk or hosting configuration has not been inspected or claimed. Restrict the file to the deployment account. There is no Windows encryption or platform-specific credential loader in the app.

The current release still sets `AI_ENABLED=false` and `CF_SI_ENABLED=false`. Uploading a credential does not authorize calls or bypass the unfinished model-acceptance gate. The existing token is reserved for the owner's staging preparation; the planned fresh competition key and public-activation prerequisites remain separate.

Local checks found zero occurrences of the designated token in 1,047 locally reachable Git objects and 55 built client assets. This is a bounded check of this repository/build, not a guarantee about other machines, account logs or external copies. The three added security tests use fake credentials and make no live API calls.
