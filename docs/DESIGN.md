---
name: "Inked"
description: "360° company research for investors"
colors:
  primary: "#161513"
  secondary: "#7A7670"
  surface: "#F6F3EC"
  on-surface: "#161513"
typography:
  display: "Newsreader"
  ui: "Inter"
  mono: "Roboto Mono"
spacing:
  base: "8px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
---

# Inked Design System

## Concept

Editorial research desk on warm paper. White-to-cream gradients, section to section: cream hero, cool signals board, stone method, cool gallery, italic quote, ledger index, ink console. Light display serif for verdicts; a quiet grotesque for UI; mono for evidence.

## Colors

| Token | Hex | Role |
| --- | --- | --- |
| Primary | `#161513` | Ink, buttons, analyze well |
| Secondary | `#7A7670` | Muted copy |
| Surface | `#F6F3EC` | Warm paper |
| On surface | `#161513` | Headings and body |
| CTA | `#F7F4EE` on `#161513` | Primary actions |

## Typography

- **Display**: Newsreader 300 / italic — hero, memo titles, highlights
- **UI**: Inter 300–600
- **Data**: Roboto Mono 400–500

## Layout

8px base. Homepage stages are full-viewport (`100dvh`), content vertically centered, proximity scroll-snap on large screens. Numbered memo sections, 8px URL bar, left-aligned memo body. Breakpoints 640 / 768 / 1024.

## Logo

White 360° ring + diamond ink nib on `#000000`. Source: `assets/logo.svg`. PNGs in `assets/` (16–512). Favicon: `assets/favicon.ico`. Apple: `logo-180.png`. Android: `logo-192.png`, `logo-512.png`. Social: `assets/og.png`.

## Components

- **Primary button**: white, black type, 8px radius, 12×18 padding
- **Analyze input**: black field, `#FAFAFA` type, 8px radius
- **Memo sections**: `01` numeral + hairline + light serif title
