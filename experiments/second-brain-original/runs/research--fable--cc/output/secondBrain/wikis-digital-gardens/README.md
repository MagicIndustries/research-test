# Personal Wikis and Digital Gardens

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## What it is

The wiki is the oldest second-brain form: interlinked pages, organized by topic rather than time. Its modern descendant, the **digital garden**, adds a publishing philosophy — notes are grown in public, organized by connection instead of chronology, and honestly labeled by maturity (seedling → growing → evergreen) rather than presented as finished essays. Maggie Appleton's [digital-gardeners repository](https://github.com/MaggieAppleton/digital-gardeners) is the community's long-running hub for the ethos, tools, and examples.

In 2026 this method plays two roles:

1. **The publishing layer of another method** — most people garden by publishing a subset of an Obsidian vault (including agent-maintained [LLM Wiki](../llm-wiki/) vaults — the two approaches converge on "wiki-shaped markdown").
2. **A standalone second brain** — a self-hosted wiki (TiddlyWiki, Wiki.js, MediaWiki) as the primary store, favored for teams and for heavily structured reference material ([Glukhov, Knowledge Management in 2026: PKM Tools, Self-Hosted Wikis & Digital Systems](https://www.glukhov.org/knowledge-management/)).

## The main options

### Quartz — the dominant free publishing path

[jackyzha0/quartz](https://github.com/jackyzha0/quartz) (MIT) is a "fast, batteries-included static-site generator that transforms Markdown content into fully functional websites" — used by thousands to publish notes and gardens. It renders an Obsidian (or any markdown) folder with **full-text search, an interactive graph view, backlinks**, wikilink support, and themes; deploys free via GitHub Pages with GitHub Actions. Real-world template: [kevin7lou/wiki](https://github.com/kevin7lou/wiki) (Obsidian + Quartz + Actions); walkthroughs: [eltonlabs' Quartz + GitHub Pages guide](https://eltonlabs.org/en/base/obsidian-quartz), [be-far's digital gardening with Quartz](https://be-far.com/Projects/Obsidian/digital-garden). Best fit: you already keep markdown notes and want a free, good-looking public garden.

### Obsidian Publish — the zero-config official option

[Obsidian Publish](https://obsidian.md/publish) is Obsidian's paid hosted service: select notes in your vault, click publish; hosted wiki/garden with graph, backlinks, themes, custom domain. No build pipeline to maintain. Best fit: Obsidian users who value time over hosting fees. (Alternative middle path: the community **Digital Garden plugin** publishes free via Netlify — [plugin page](https://www.obsidianstats.com/plugins/digitalgarden).)

### TiddlyWiki — the single-file non-linear notebook

[TiddlyWiki](https://tiddlywiki.com) (open source, BSD; 20+ years mature) stores an entire wiki — content, engine, and UI — in **one HTML file** that runs anywhere a browser runs. Notes ("tiddlers") are transclusible micro-units, arguably the purest implementation of atomic linked notes. Extremely portable and durable; syncing/saving setup is its known friction. Best fit: minimal-dependency people who want a brain that will still open in 2040.

### Wiki.js / MediaWiki — server wikis

- **Wiki.js** ([wiki.js.org](https://js.wiki), [requarks/wiki](https://github.com/requarks/wiki)) — modern Node.js wiki: markdown + WYSIWYG editors, auth, search; the usual pick for a polished self-hosted personal/team wiki.
- **MediaWiki** ([mediawiki.org](https://www.mediawiki.org)) — Wikipedia's engine: categories, templates, transclusion, semantic extensions. Heavyweight, but the strongest structure for reference-style corpora; increasingly paired with LLM ingestion pipelines in team settings ([Glukhov survey](https://www.glukhov.org/knowledge-management/)).

Best fit: multi-user knowledge bases, or when access control and web editing matter more than local-first files.

## How AI changes this method

- **Agents write wiki content.** The [LLM Wiki](../llm-wiki/) pattern outputs exactly the artifact this method publishes; Quartz on top of an agent-maintained vault gives you a self-updating public garden.
- **Wikis are ideal LLM food.** Consistent page structure, explicit links, and atomic topics are what make a knowledge base LLM-navigable — wiki discipline is now an AI-readability strategy, not just human hygiene ([codersera on Karpathy's insight](https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/)).
- **Wiki engines gain AI search.** Self-hosted wiki stacks are adding LLM Q&A layers over their content (survey: [glukhov.org](https://www.glukhov.org/knowledge-management/)); you can also point any [RAG assistant](../rag-assistants/) at a wiki export.

## Choosing within this method

| Need | Pick |
|---|---|
| Free public garden from markdown notes | Quartz + GitHub Pages |
| Zero-maintenance publishing from Obsidian | Obsidian Publish (or Digital Garden plugin) |
| Single portable file, maximum longevity | TiddlyWiki |
| Self-hosted multi-user wiki | Wiki.js (modern) or MediaWiki (max structure) |

## Trial instructions

**Quartz trial (2–3 h):** fork/clone the Quartz repo → `npm i` → drop a dozen markdown notes (with `[[wikilinks]]`) into `content/` → `npx quartz build --serve` to preview locally → enable the provided GitHub Actions workflow and GitHub Pages for automatic deploys on push. Then decide your public/private boundary — most gardeners publish a curated subfolder of the vault, not everything.

**TiddlyWiki trial (30 min):** download the empty file from tiddlywiki.com, open in a browser, create ten linked tiddlers, and evaluate whether the single-file model fits your durability instincts.

**Inspiration:** browse community gardens at the [Obsidian Garden Gallery](https://vaults.obsidian-community.com/) and the examples in [digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners) before settling your structure.
