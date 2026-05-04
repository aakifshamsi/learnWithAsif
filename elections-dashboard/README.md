# ElecAI — India Elections Live Dashboard

Real-time ECI constituency trends, Monte Carlo seat predictions, vote recording with EPIC validation, citizen reporting, and Monetag monetization — all on Cloudflare's global edge.

---

## What's inside

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind + Plotly.js + react-simple-maps |
| Backend | Cloudflare Workers + Hono.js |
| AI | Cloudflare Workers AI (llama-3-8b + distilbert-sst-2) |
| Database | Cloudflare D1 (SQLite, 543 constituencies seeded) |
| Cache | Cloudflare KV |
| File storage | Cloudflare R2 (citizen report images) |
| Real-time | Cloudflare Durable Objects (WebSocket rooms) |
| Auth | Cloudflare Access (Google + GitHub OAuth) |
| Hosting | CF Pages (frontend) + CF Workers (backend) |
| CI/CD | GitHub Actions |
| Monetization | Monetag publisher |

---

## Getting live — step by step

### Prerequisites (do this first, from any browser)

You need two things in your Cloudflare account before anything else:

1. **Cloudflare account** — free at [cloudflare.com](https://cloudflare.com)
2. **CF API Token** with these permissions:
   - Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click **Create Token → Create Custom Token**
   - Add permissions:
     - `Account > Workers Scripts > Edit`
     - `Account > Workers KV Storage > Edit`
     - `Account > Workers R2 Storage > Edit`
     - `Account > D1 > Edit`
     - `Account > Cloudflare Pages > Edit`
     - `Account > Account Settings > Read`
     - `Zone > Workers Routes > Edit` (if using custom domain)
   - Save the token — you only see it once

3. **Account ID** — visible at the top-right of any Cloudflare dashboard page (32-char hex string)

---

### Step 1 — Add GitHub Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → Secrets tab**

Add these two secrets:

| Secret name | Value |
|---|---|
| `CF_API_TOKEN` | Your Cloudflare API token from above |
| `CF_ACCOUNT_ID` | Your Cloudflare Account ID |

That's it for secrets. Do not add anything else here.

---

### Step 2 — Create CF infrastructure

**Option A — One-click (recommended for Android/mobile)**

1. Go to your GitHub repo → **Actions** tab
2. Find **"Setup CF Infrastructure (run once)"** in the left sidebar
3. Click **Run workflow** (top-right of the workflow page)
4. Optionally fill in:
   - **CF Access team domain** — your Cloudflare Zero Trust team name (e.g. `yourteam.cloudflareaccess.com`). Find this at [one.dash.cloudflare.com](https://one.dash.cloudflare.com) → Settings → Custom Pages → Team domain. Leave blank if you're setting up auth later.
   - **Worker URL** — leave blank for now; you'll get this after the first deploy.
5. Click **Run workflow** (green button)

The workflow will:
- Create the D1 database, KV namespaces, R2 bucket, and CF Pages project
- Automatically patch `wrangler.toml` with the real IDs
- Commit the updated file back to the branch

Wait for the green checkmark (about 2 minutes). Read the **"Print setup summary"** step output — it shows your next steps.

---

**Option B — Cloudflare Dashboard (all via browser, no workflow)**

Do each of these at [dash.cloudflare.com](https://dash.cloudflare.com):

#### B1. Create D1 database
- **Workers & Pages → D1 → Create database**
- Name: `elections-db`
- Copy the **Database ID** shown after creation

#### B2. Create KV namespaces
- **Workers & Pages → KV → Create namespace**
- Name: `elections-worker-CACHE` → copy the **ID**
- Create another: `elections-worker-CACHE_preview` → copy the **ID**

#### B3. Create R2 bucket
- **R2 → Create bucket**
- Name: `elections-reports`

#### B4. Create Pages project
- **Workers & Pages → Pages → Create project**
- Name: `elections-dashboard`
- Production branch: `main`

#### B5. Patch wrangler.toml

Edit `elections-dashboard/apps/worker/wrangler.toml` directly on GitHub (click the pencil icon):

Replace these placeholder values with your real IDs:
```toml
database_id = "REPLACE_AFTER_wrangler_d1_create"
# → paste your D1 Database ID

id = "REPLACE_AFTER_wrangler_kv_create"
# → paste your KV prod namespace ID

preview_id = "REPLACE_AFTER_wrangler_kv_create_preview"
# → paste your KV preview namespace ID
```

Commit the file. That's it for Option B.

---

### Step 3 — Add GitHub repo variables

Go to: **GitHub repo → Settings → Secrets and variables → Actions → Variables tab**

Add these three **Variables** (not secrets):

| Variable name | Value |
|---|---|
| `VITE_API_URL` | Your worker URL — e.g. `https://elections-worker.yourname.workers.dev`. You get this after first deploy; add it then and re-deploy. |
| `VITE_MONETAG_ZONE_ID` | Your Monetag zone ID (e.g. `10762909`) |
| `VITE_MONETAG_DOMAIN` | `glizauvo.net` (or your Monetag serving domain) |

> If you don't have Monetag yet: set `VITE_MONETAG_ZONE_ID` to `0` and `VITE_MONETAG_DOMAIN` to `example.com` for now — ads simply won't load.

---

### Step 4 — Add your Monetag site verification token

1. Log in to [monetag.com](https://monetag.com) publisher dashboard
2. Go to **Sites → Add site → Verify** to get your verification meta tag value
3. On GitHub, edit `elections-dashboard/apps/web/index.html`
4. Replace `REPLACE_WITH_YOUR_MONETAG_VERIFY_TOKEN` with your actual token:
   ```html
   <meta name="monetag" content="your_actual_token_here" />
   ```
5. Commit the file

---

### Step 5 — First deploy

Push any change to the `claude/elections-dashboard-ai-1V3eL` branch (or to `main`) to trigger the deploy workflow.

Easiest way from Android:
- Edit any file on GitHub (e.g. add a blank line to `README.md`)
- Commit it → the **Deploy Elections Dashboard** workflow triggers automatically

The workflow will:
1. Deploy the Cloudflare Worker + run D1 migrations
2. Build the React frontend
3. Deploy to Cloudflare Pages

Check **Actions → Deploy Elections Dashboard** for the build output. Both jobs should turn green in about 3–4 minutes.

---

### Step 6 — Get your URLs

After the deploy succeeds:

- **Worker URL**: visible in the deploy-worker job output, or at:
  `dash.cloudflare.com → Workers & Pages → elections-worker`
  It will be: `https://elections-worker.<your-subdomain>.workers.dev`

- **Pages URL**: visible in the deploy-web job output, or at:
  `dash.cloudflare.com → Workers & Pages → Pages → elections-dashboard`
  It will be: `https://elections-dashboard.pages.dev`

Now go back to **Step 3** and set `VITE_API_URL` to your Worker URL, then re-deploy (push any change).

---

### Step 7 — Set up authentication (Google + GitHub login)

This protects the "Record Vote" and "Submit Report" features.

1. Go to [one.dash.cloudflare.com](https://one.dash.cloudflare.com) (Cloudflare Zero Trust)
2. **Settings → Authentication → Login methods:**
   - Add **Google** — generates a Client ID + Secret (Google Cloud Console required; see [docs](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/))
   - Add **GitHub** — generates a Client ID + Secret (GitHub Settings → Developer Apps)
3. **Access → Applications → Add application → Self-hosted:**
   - Application name: `Elections Dashboard`
   - Application domain: `elections-worker.<your-subdomain>.workers.dev`
   - Under **Policies → Add rule:**
     - Rule name: `Allow social login`
     - Include: Everyone (or restrict to an email domain)
   - Under **Advanced → Cookie settings**: enable `SameSite=Lax`
4. Note your **team domain** (e.g. `yourteam.cloudflareaccess.com`)
5. If you skipped it in Step 2, go to **Actions → "Setup CF Infrastructure" → Run workflow** and enter your team domain — it will set the `CF_ACCESS_TEAM_DOMAIN` worker secret

> **Skip auth for now?** The dashboard and all public routes work without it. Only `/vote` and `/report` POST routes require the CF Access JWT. You can enable it later.

---

### Step 8 — Verify the live dashboard

Open your Pages URL in a browser:

- `/` — Should show "Waiting for ECI data" (counting hasn't started yet)
- `/gameroom` — Should show the swing-seat leaderboard
- `/reports` — Should load empty with "No reports yet"
- `/vote` — Should show the EPIC validation form (redirects to CF Access login if auth is configured)
- `GET https://elections-worker.xxx.workers.dev/health` — Should return `{"status":"ok"}`

---

## Monetag ad setup

1. Sign up at [monetag.com](https://monetag.com) as a publisher
2. Add your Pages site URL for approval
3. Once approved, get your:
   - **Site verification token** → add to `index.html` (Step 4 above)
   - **Zone ID** (the number in your direct link: `https://omg10.com/4/ZONE_ID`) → set as `VITE_MONETAG_ZONE_ID` repo variable
   - **Magic code domain** (e.g. `glizauvo.net`) → set as `VITE_MONETAG_DOMAIN` repo variable
4. For direct links (e.g. in banner ads), use: `https://omg10.com/4/YOUR_ZONE_ID`

The two ad slots are:
- **Sidebar** (300×250): shown in `/gameroom` right column
- **Footer** (728×90): shown in `/` and `/constituency/:id`

Users can dismiss each slot individually or disable all ads via the toggle in the nav header.

---

## Local development (needs a PC/Mac)

```bash
# Clone repo
git clone https://github.com/aakifshamsi/learnWithAsif
cd learnWithAsif/elections-dashboard

# Install
npm install -g pnpm@9
pnpm install

# Build shared types
pnpm --filter @elections/shared build

# Create .dev.vars for local secrets
cat > apps/worker/.dev.vars << EOF
CF_ACCESS_TEAM_DOMAIN=yourteam.cloudflareaccess.com
EOF

# Create local D1 and run migrations
pnpm --filter @elections/worker migrate:local

# Start Worker (port 8787)
pnpm --filter @elections/worker dev

# Start frontend (port 5173) in another terminal
pnpm --filter @elections/web dev
```

Then open `http://localhost:5173`.

---

## ECI feed integration

When elections are in progress, ECI publishes results at:
- `https://results.eci.gov.in/` (varies per election)

Update `ECI_FEED_URL` in `wrangler.toml` to the live JSON endpoint for the current election. The scheduled Worker polls it every 30 seconds. During off-season, the dashboard shows "Waiting for ECI data" gracefully.

For testing with mock data, POST directly to the Worker's D1:
```bash
wrangler d1 execute elections-db --remote --command "
INSERT INTO eci_snapshots (constituency_id, leading_party, lead_margin, total_votes_counted, percent_counted, raw_json)
VALUES ('MH-22', 'BJP', 12500, 245000, 65.3, '{\"BJP\":128750,\"INC\":116250}');
"
```

---

## Architecture

```
Browser ──── CF Pages (React SPA) ──── CF Worker (Hono API)
                                            │
                              ┌─────────────┼─────────────────┐
                              │             │                 │
                           D1 DB     Durable Objects      Workers AI
                        (snapshots,  (WebSocket rooms   (llama-3 summaries,
                         votes,       per constituency)   distilbert sentiment)
                         reports)
                              │
                           R2 Bucket
                        (report images)
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Deploy fails: "D1 database not found" | Run the setup workflow (Step 2), or patch `wrangler.toml` manually |
| Deploy fails: "KV namespace not found" | Same as above |
| `/vote` redirects to Cloudflare login | Expected — CF Access is working. Configure your identity provider (Step 7) |
| `/vote` returns 401 "Auth not configured" | `CF_ACCESS_TEAM_DOMAIN` secret not set on the Worker — re-run setup workflow with team domain |
| Dashboard shows "Waiting for ECI data" | Normal when no election is in progress. Inject test data via D1 (see above) |
| Monetag ads not showing | Check `VITE_MONETAG_ZONE_ID` and `VITE_MONETAG_DOMAIN` repo variables; re-deploy |
| WebSocket disconnects | Normal — client auto-reconnects with exponential backoff (2s → 4s → 8s → max 30s) |
