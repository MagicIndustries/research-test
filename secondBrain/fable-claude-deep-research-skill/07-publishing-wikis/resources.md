# Publishing & Digital Gardens — Resources

## Tools

- [jackyzha0/quartz](https://github.com/jackyzha0/quartz) — Quartz SSG ([docs/demo](https://quartz.jzhao.xyz/))
- [Obsidian Publish](https://obsidian.md/publish) — official hosted publishing
- [Digital Garden plugin](https://www.obsidianstats.com/plugins/digitalgarden) — free per-note publishing to Netlify/Vercel
- [TiddlyWiki](https://tiddlywiki.com/) — single-file wiki
- [Logseq](https://logseq.com/) — outliner PKM (see status caution in overview.md)

## Community and concept

- [MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners) — the canonical resource hub: tools, essays, example gardens.
- [Digital Gardens — Jessica Journals](https://jessicajournals.com/digital-gardens/) — accessible intro incl. growth-stage conventions.
- [Knowledge Management in 2026: PKM Tools, Self-Hosted Wikis — Glukhov](https://www.glukhov.org/knowledge-management/) — broad current landscape survey.

## Quartz tutorials and examples

- [Build a Digital Garden Blog with Quartz (and Obsidian) — LK Technotes](https://lktechnotes.com/Tech/build-a-digital-garden-with-quartz)
- [Building a digital garden with Obsidian and Quartz — Juhis](https://notes.hamatti.org/technology/building-a-digital-garden-with-obsidian-and-quartz) — itself a live garden, so you see the result.
- [Digital Gardening with Quartz — be-far](https://be-far.com/Projects/Obsidian/digital-garden)
- [kevin7lou/wiki](https://github.com/kevin7lou/wiki) — worked example repo: Obsidian + Quartz + GitHub Actions auto-deploy.
- [Tools for Digital Garden — khandhaja](https://khandhaja.github.io/Tools-for-Digital-Garden) — tool roundup published as a garden.

## Logseq status sources

- [Why the database version and how it's going — official Logseq forum](https://discuss.logseq.com/t/why-the-database-version-and-how-its-going/26744)
- [Logseq Development Delays: Are Users Migrating? — Theo James](https://medium.com/@theo-james/logseq-development-delays-are-users-migrating-to-affine-or-obsidian-e22bb42b8741)
- [Logseq vs Obsidian in 2026 — Christian Grech](https://christiangrech.medium.com/logseq-vs-obsidian-in-2026-which-one-should-you-actually-use-de08b0c35075) · [ItsFOSS comparison](https://itsfoss.com/comparison/obsidian-vs-logseq/)

## Trial instructions (~45 min)

1. Fork/clone Quartz per the [docs](https://quartz.jzhao.xyz/) → `npm i && npx quartz create`.
2. Point content at a **copy of a public-safe subfolder** of your vault.
3. `npx quartz build --serve` to preview locally; check graph view, backlinks, search.
4. Deploy free with the GitHub Actions workflow from the docs (or crib from [kevin7lou/wiki](https://github.com/kevin7lou/wiki)).
