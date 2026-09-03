# TinyNudge

Free **online mouse jiggler** (keep the screen awake in the browser) plus a **Mac menu-bar** app that nudges the real pointer. Website is free. Mac app is **$2.99/year**.

- Site: [mousejiggle.app](https://mousejiggle.app/)
- Code: [github.com/geekysatbir/tinynudge](https://github.com/geekysatbir/tinynudge)
- Mac: universal `.dmg` (Apple Silicon + Intel) from [Releases](https://github.com/geekysatbir/tinynudge/releases/latest)

The website does **not** move the system mouse. The Mac app does (3px and back, every 60s).

## Charge $2.99/year

Do **not** use the App Store for the first version (needs Apple’s $99 program + review). Use Polar or Lemon Squeezy as merchant of record (they handle card + tax):

1. Create a product **TinyNudge for Mac**, subscription **$2.99 / year**.
2. Attach `dist/TinyNudge.dmg` as the file the buyer gets.
3. Copy the checkout URL into `assets/buy.js`:

```js
window.TINY_NUDGE_CHECKOUT_URL = "https://buy.polar.sh/....";
```

4. Commit and push. The site button becomes **Subscribe — $2.99/year**.

Until that URL is set, the button is a direct `.dmg` download.

**$2.99 once vs $2.99/year:** a one-time $2.99 (App Store or Polar) usually converts better for a tiny utility. Yearly is fine if you want recurring; Polar supports both.

## DNS for mousejiggle.app (GitHub Pages)

The domain currently sits on parking nameservers. In Google/Squarespace DNS, **replace** parking with:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `geekysatbir.github.io` |

Delete the parking A record (`2.57.91.91`) and any other `@` A/AAAA records. Wait for HTTPS in GitHub → Settings → Pages (can take up to an hour). Then submit `https://mousejiggle.app/sitemap.xml` in Search Console.

## Local Mac build

```bash
zsh mac/build.sh   # universal binary + dist/TinyNudge.dmg
open dist/TinyNudge.dmg
```
