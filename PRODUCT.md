# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitors are prospects, partners, and recruits on mobile who need a fast read of who Auto team is, what it ships, and how to reach them. Secondary: desktop reviewers comparing products and departments.

## Product Purpose

A bilingual (fa default, en) public team profile site for **Auto team**. It presents mission, products, delivery projects, four departments (sales, engineering, research, support) with members, capabilities, milestones, and contact channels in one scrollable page.

Success: a visitor leaves knowing the team name, one product or project worth following up on, and a clear contact path.

## Positioning

Editable CMS-backed team profile (admin studio + `data/content.json`) with four visual templates (`editorial` | `studio` | `signal` | `cinematic`) and Apple-like scroll motion, not a personal portfolio.

## Capabilities

- Single-page locale routes (`/` fa, `/en`)
- Sections: hero, stats, mission, products, projects, team, capabilities, milestones, contact
- Template switch without losing content
- Admin editor for bilingual copy, images, visibility, socials
- Organization JSON-LD for SEO

## Constraints

- Keep existing templates intact; `cinematic` is an additive fourth template
- Mobile-first performance: no Three.js hero field below `md`
- Honor `prefers-reduced-motion`
- Synthetic member/product names are placeholders until replaced in CMS
- No real pricing, customer logos, or unverified commercial claims
- GitHub `parsa2500` remains fallback contact until email/socials are set

## Brand Commitments

- Team display name defaults to **Auto team** and is editable via content (`hero.name`, `nav.home`)
- Four departments fixed in product model: sales, engineering, research, support
- Persian + English bilingual content model
- Apple-like cinematic scroll language (large type, full-bleed sections, purposeful motion) on template tokens — not a pixel clone of apple.com

## Open Decisions

- Real email, social URLs, and member photos to be filled by the team in admin
- Production site URL via `NEXT_PUBLIC_SITE_URL`
