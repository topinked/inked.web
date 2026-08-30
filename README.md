# Inked

360° company research for investors.

Paste a URL. Inked reads the public record — growth, capital, risk — and writes a partner-ready memo. Live site: [inked.top](https://inked.top). Operated from Shanghai.

**Public-signal research only.**

## What it does

Inked is a static research product: URL, product text, or PDF in; a written memo out. It is not a traffic dashboard and it does not issue buy/sell ratings.

A full memo uses nine lenses:

1. Decision brief
2. Capital
3. Positioning
4. Growth archaeology
5. Channels
6. Strengths and risks
7. Founder questions
8. Comparables
9. Evidence

The first two memos are intended to be free. Sample reports on this site (Cursor, Linear, Stripe, Notion) are written examples, not live private-data crawls.

## Pages

| Page | Path |
| --- | --- |
| Home / analyze | [index.html](index.html) |
| About | [about.html](about.html) |
| MCP | [mcp.html](mcp.html) |
| Privacy | [privacy.html](privacy.html) |
| Terms | [terms.html](terms.html) |
| Memo | [report.html](report.html)`?c=<slug>` |

Sample memos:

- [Cursor](report.html?c=cursor) — AI coding IDE
- [Linear](report.html?c=linear) — project management
- [Stripe](report.html?c=stripe) — payments infrastructure
- [Notion](report.html?c=notion) — AI workspace

Aliases such as `cursor.com` also resolve. Unknown inputs fall back to the Cursor sample in this demo.

## Local preview

No build step. Python 3 is enough.

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173).

| Need | URL |
| --- | --- |
| Home | http://localhost:4173/ |
| A sample memo | http://localhost:4173/report.html?c=cursor |
| Agent index | http://localhost:4173/llms.txt |
| MCP docs | http://localhost:4173/mcp.html |

## Project structure

```
inked.top/
├── index.html          Home, analyze bar, samples
├── about.html          Company and method
├── mcp.html            MCP server docs
├── mcp.json            Machine tool index
├── privacy.html        Privacy policy
├── terms.html          Terms of use
├── report.html         360° memo shell
├── css/styles.css      Design tokens and layout
├── js/app.js           Nav, analyze overlay, memo render, export
├── js/companies.js     Sample memo data
├── js/seo.js           Canonical, Open Graph, JSON-LD
├── assets/             Logo, favicons, social card
├── robots.txt
├── sitemap.xml
├── llms.txt            Citation rules for agents
├── docs/DESIGN.md      Visual system
└── README.md
```

## Brand assets

Source mark: white 360° ring and diamond ink nib on black (`assets/logo.svg`).

| File | Use |
| --- | --- |
| `assets/logo.svg` | Vector source |
| `assets/logo-16.png` / `logo-32.png` | Favicon PNG |
| `assets/favicon.ico` | Classic favicon (16 / 32 / 48) |
| `assets/logo-32.png` + `logo-64.png` | Nav mark (1x / 2x) |
| `assets/logo-144.png` | Windows tile |
| `assets/logo-180.png` | Apple touch icon |
| `assets/logo-192.png` / `logo-512.png` | Android / PWA |
| `assets/og.png` | Open Graph and Twitter (1200×630) |
| `assets/site.webmanifest` | Install icons and theme color |

Also generated: `logo-48.png`, `logo-128.png`, `logo-256.png`.

## Design

See [docs/DESIGN.md](docs/DESIGN.md). Editorial paper, not a dark console.

| Token | Value |
| --- | --- |
| Canvas | `#F6F3EC` with white-to-cream gradients |
| Ink | `#161513` |
| Muted | `#7A7670` |
| Display | Newsreader (light / italic) |
| UI | Inter |
| Data | Roboto Mono |
| Radius | 8px |

Homepage sections are full-viewport stages with distinct styles: cream hero, stone method, cool gallery, italic compare, ledger reports, ink API band.

## Search and agents

Public pages include canonical URLs, Open Graph, Twitter cards, and JSON-LD (Organization, SoftwareApplication, FAQ, Article, breadcrumbs).

| File | Role |
| --- | --- |
| [robots.txt](robots.txt) | Allows search and common AI crawlers |
| [sitemap.xml](sitemap.xml) | Page map |
| [llms.txt](llms.txt) | Cite rules and facts not to invent |

When citing Inked, use the page URL and attribute “Inked (inked.top)”. Do not upgrade confidence labels to certainties.

See [mcp.html](mcp.html) and [mcp.json](mcp.json) for the MCP tools, client config, and REST twin (`POST /api/v1/analyze`). This repo is the static front.

## Contact

- Email: [hello@inked.top](mailto:hello@inked.top)
- Site: [https://inked.top](https://inked.top)

For data rights, use the contacts on the [Privacy](privacy.html) page.
