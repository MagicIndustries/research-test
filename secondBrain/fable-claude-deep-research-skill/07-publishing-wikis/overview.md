# Publishing & Digital Gardens — The Public Second Brain

> Researched 2026-07-18.

## The approach

A "digital garden" publishes your notes as a **non-chronological, always-evolving public wiki** — notes at visible growth stages (seedling → growing → mature), organized by connection rather than date. Distinct from blogging: you tend pages over time instead of shipping finished posts. Publishing part of a second brain creates accountability, invites feedback, and — increasingly relevant — makes your knowledge legible to other people's AI tools.

The intellectual home of the movement is Maggie Appleton's [digital-gardeners repo](https://github.com/MaggieAppleton/digital-gardeners) and essay "A Brief History & Ethos of the Digital Garden."

## The options

### Quartz — the de-facto standard
[quartz.jzhao.xyz](https://quartz.jzhao.xyz/) · [github.com/jackyzha0/quartz](https://github.com/jackyzha0/quartz)

Static-site generator purpose-built for publishing Obsidian (or Roam) vaults: full-text search, interactive graph view, backlinks, wikilink support. Free; deploys anywhere (GitHub Pages via Actions is the common path — see [worked example](https://github.com/kevin7lou/wiki)). The usual choice over Obsidian Publish on cost and control grounds.

### Obsidian Publish — the zero-effort official option
[obsidian.md/publish](https://obsidian.md/publish)

Paid hosted service: select notes, click publish, get a polished site with graph/backlinks/search. No build pipeline, no repo. Choose it when time matters more than money and you don't need customization.

### Digital Garden plugin — middle ground
[Digital Garden plugin](https://www.obsidianstats.com/plugins/digitalgarden)

Free Obsidian plugin publishing selected notes to a Netlify/Vercel-hosted site — per-note control without maintaining a full Quartz build.

### TiddlyWiki — the single-file veteran
[tiddlywiki.com](https://tiddlywiki.com/)

An entire wiki in one HTML file, built from card-like "tiddlers" you interlink. Decades old, still maintained, uniquely portable. Niche but beloved for card-based knowledge bases.

### Logseq — caution flag
[logseq.com](https://logseq.com/)

Outliner-based, block-first, open-source Obsidian alternative that leans naturally toward garden-style publishing. **Current status (2026): its database-version rewrite has been in beta for a long stretch, with real-time collaboration and the new mobile app in alpha, stalled feature rollouts, and documented user migration to Obsidian/AFFiNE** ([status thread](https://discuss.logseq.com/t/why-the-database-version-and-how-its-going/26744), [migration analysis](https://medium.com/@theo-james/logseq-development-delays-are-users-migrating-to-affine-or-obsidian-e22bb42b8741)). Markdown-mode support is promised long-term. Watch, don't adopt, unless the outliner model is essential to you.

## How this composes with the other approaches

- A Quartz site can be built **directly from an LLM-wiki vault** — the agent maintains `wiki/`, CI publishes it. An AI-maintained public garden is a genuinely new artifact the 2026 stack makes cheap.
- Publishing forces the hygiene the LLM wiki needs anyway (lint passes, no orphans, resolved contradictions) — public visibility is a natural forcing function for wiki quality.
- Mind the boundary: agent-maintained vaults can contain private material; publish from an allowlisted subfolder, never the vault root.
