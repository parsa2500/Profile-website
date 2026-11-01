# Design

<!-- impeccable:design-schema 1 -->

## Surface

Public bilingual team profile for Auto team (`/` fa, `/en`). Admin studio is out of scope for this document.

## Mode

Persuade + Experience: cinematic scroll that proves who the team is and what it ships.

## World

Apple-like product-page cinema across four templates — large type, full-bleed sections, sparse chrome, purposeful scroll motion — not a pixel clone of apple.com.

### Templates

| Template | Material |
|----------|----------|
| `editorial` | Paper ground, soft radii, grid hero with floating side images |
| `studio` | Full-bleed dark hero image, film-strip project/product rails |
| `signal` | Sharp corners, teal/orange glow accents, linear capability list |
| `cinematic` | Scroll-pinned cinema: door-open hero + puff, wipe mission, horizontal product rail |

### Type

- Latin: Space Grotesk (`--font-latin`)
- Persian: Vazirmatn (`--font-persian`)
- Hero brand ~`text-6xl` / `md:text-8xl`; section titles ~`text-4xl` / `md:text-5xl`

### Color

Semantic tokens in `globals.css` (`--color-bg/fg/card/accent/...`). Templates override accent and radius behavior via `html[data-template]`.

### Motion

- Focal: hero `Sequence` + `MaskReveal`; cinematic template uses sticky `useScroll` stages instead
- Support: product horizontal snap on mobile, team department tab swap + stagger, experience track fill, `StickyReveal` on stats, contact marquee
- Budget: Three.js `HeroField` only `md+`; honor `prefers-reduced-motion`

## Composition

1. Hero — brand name, one role, one summary, products + contact CTAs, one image plane
2. Stats → Mission → Products (snap rail) → Projects → Team (department tabs) → Capabilities → Milestones → Contact

Mobile-first: first viewport stays free of stats chips and secondary promo chrome.

## Content notes

Synthetic member and product names are placeholders; replace via admin / `data/content.json`.
