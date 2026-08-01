# Hosting and your Afrihost domain

## The recommended setup

Keep the machinery where it is and point your domain at it:

- **GitHub** stores the content and code (and powers the CMS).
- **Vercel** builds and serves the site, free, with automatic deploys and analytics.
- **Afrihost** supplies the domain name (e.g. phandamag.co.za).

This keeps the whole pipeline (Pages CMS to GitHub to Vercel, with automatic
artwork) working exactly as designed, at R0 hosting cost.

### Connecting an Afrihost domain to the Vercel site

1. Buy the domain at Afrihost (or use one you own).
2. In **Vercel**: open the straatpreneur project, go to **Settings, then Domains**,
   type your domain (e.g. phandamag.co.za) and click **Add**. Vercel shows you
   the DNS records it needs.
3. In **Afrihost ClientZone**: open your domain's **DNS management** and add
   what Vercel asked for, typically:
   - An **A record** for `phandamag.co.za` pointing to `76.76.21.21`
   - A **CNAME record** for `www` pointing to `cname.vercel-dns.com`
4. Wait for DNS to propagate (minutes to a few hours). Vercel issues the
   HTTPS certificate automatically. Done: your domain serves the magazine.

## If you ever want the files ON Afrihost's servers

The site is static, so it can live on ordinary Afrihost shared hosting too:
run `npm run build` and upload everything inside the `dist/` folder to
`public_html` via Afrihost's cPanel File Manager. Two honest costs of that
route: publishing stops being automatic (every CMS save would need a manual
rebuild and re-upload, or a GitHub Action configured to deploy over FTP), and
you give up Vercel's analytics. Recommendation: keep serving from Vercel and
use Afrihost for the domain unless you have a specific reason not to.
