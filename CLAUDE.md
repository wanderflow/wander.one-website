# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (extends next/core-web-vitals)
```

## Architecture

This is a **Next.js 15 App Router** marketing website + share/deep-link page for the Wander social app. JavaScript only (no TypeScript). Styling uses SCSS modules. Animations use framer-motion (primary) and gsap (supplemental).

### Route structure

| Path | Purpose |
|---|---|
| `/` | Main landing page — sections: Landing, Description, Express, Encounter, Download, Contact |
| `/share/[slug]` | Server component generating **dynamic OG metadata** for social previews. Renders `DownloadLanding` which handles deep linking into the mobile app |
| `/download` | Standalone download page; also the **rewrite target** for `/share/[slug]` via middleware |
| `/privacy`, `/tc`, `/guidelines`, `/child-safety` | Static content pages |
| `/api/group-detail` | POST proxy to `https://api.wander.one/ai-topics/invite_links/detail` |

### Middleware (`src/middleware.js`)

Rewrites `/share/:slug` → `/download?slug=...` so the download page handles share traffic directly. The share page server component (`/share/[slug]/page.js`) still runs for OG metadata generation (social crawlers hit the original URL), but browser requests get rewritten to the download page.

### Share/preview architecture

Three files work together for share link previews:

1. **`src/lib/shareLinkPreview.js`** — Determines whether to show "social" or "messaging" share description based on `?share_style=` / `?ss=` query params or User-Agent detection. Also builds OG title format.
2. **`src/lib/fetchInviteDetail.js`** — Fetches group invite detail from the backend API (`api.wander.one`), with `next: { revalidate: 120 }` for ISR-style caching on the server side.
3. **`src/lib/buildSharePageMetadata.js`** — Assembles the full Next.js `metadata` object (Open Graph + Twitter) for share pages, using the other two libs.

Both `/share/[slug]/page.js` and `/download/page.js` call `buildSharePageMetadata` in their `generateMetadata` — the download page only does so when a `?slug=` query param is present (i.e., after middleware rewrite).

### Component pattern

Each landing page section (Landing, Description, Express, Encounter, Download, Contact, Header) follows the same structure under `src/components/<Name>/`:

- `index.jsx` — React component (all are `"use client"`)
- `style.module.scss` — Scoped styles
- `animation.js` — framer-motion animation variants (exported and consumed by the component)

The main `DownloadLanding` component is the most complex — it handles fetching group details, deep linking into the mobile app (`wanderone://` custom scheme), clipboard copying, App Store fallback, and the full share page UI.

### Deep linking flow

When a user lands on a share page with `?invite_code=`, `DownloadLanding` automatically:
1. Copies the invite code to clipboard
2. Attempts to open the app via `wanderone://` custom URL scheme (uses hidden iframe for iOS, Intent URI for Android)
3. Falls back to App Store after 2.5 seconds if the page is still visible

### Utilities

- **`src/utils/getAppStoreUrl.js`** — Returns Apple App Store or Google Play URL based on user-agent/platform detection
- **`src/components/AppleSmartAppBanner/`** — Dynamically injects the `apple-itunes-app` meta tag for iOS Smart App Banner

### Image remote patterns

Configured in `next.config.mjs`:
- `wander-content.s3.us-east-2.amazonaws.com` — Group/user content
- `img.clerk.com` — Clerk auth avatars


### Plan
- 每次制定实施方案前，必须进行重审确认
- 确认每个步骤有据可依（数据来源、API 参数、模型字段等）
- 确认步骤之间衔接紧密，没有遗漏环节
- 检查数据流转是否完整（输入从哪来、输出到哪去）
- 识别潜在的边界情况和错误处理
- 如有疑问，必须在执行前向用户确认