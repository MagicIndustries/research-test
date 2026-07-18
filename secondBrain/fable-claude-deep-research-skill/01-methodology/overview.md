# Methodology Layer: PARA, Zettelkasten, CODE — and What AI Changed

> Researched 2026-07-18. The methods themselves are decades old (Zettelkasten) to ~2017 (PARA); the AI-era analysis cited is 2025–2026.

## Why this comes first

Every AI-powered second brain still needs an organizational scheme — the difference in 2026 is that the scheme is something you *teach an LLM* (as a schema/instructions file) rather than a discipline you perform manually. Skipping this layer is the most common cause of AI knowledge bases that decay into mush.

## The three core methods

### PARA (Tiago Forte)

Organizes by **actionability** — every piece of information is filed by what it's *for*:

- **P — Projects:** short-term efforts with a goal and deadline ("launch handbook site")
- **A — Areas:** ongoing responsibilities with a standard to maintain ("engineering management")
- **R — Resources:** topics of interest that may become useful ("knowledge graphs")
- **A — Archives:** inactive items from the other three

Part of Forte's larger **CODE** loop: **C**apture (save what resonates) → **O**rganize (file into PARA) → **D**istill (progressive summarization — bold the best parts, then bold the best of the bold) → **E**xpress (turn notes into output).

**Strengths:** dead simple, action-oriented, works in any tool, scales to work+life.
**Weaknesses:** says nothing about linking ideas or generating insight; notes go to Archives to die.

### Zettelkasten (Niklas Luhmann)

Organizes by **connection** — knowledge as a web, not folders:

- **Atomic notes:** one idea per note, written in your own words
- **Dense linking:** every note links to related notes; links are first-class
- **Emergence:** insight comes from unexpected paths through the link graph
- Typical flow: fleeting notes → literature notes → permanent notes

**Strengths:** genuinely generates new ideas; the intellectual ancestor of backlinks, graph views, and knowledge graphs.
**Weaknesses:** high discipline cost; slow to show value; easy to over-engineer.

### The hybrid (current consensus)

Most practitioners now combine them: **PARA for the folder skeleton, Zettelkasten linking style within it**, in a local markdown vault (Obsidian). Comparisons: [Brainfo: Zettelkasten vs PARA vs CODE](https://brainfo.ai/second-brain-methods-zettelkasten-para-code/), [Saner.ai methods guide](https://www.saner.ai/blogs/note-taking-methods), [Zain Rizvi's practical comparison](https://www.zainrizvi.io/blog/remembering-what-you-read-zettelkasten-vs-para/), [LocArk offline hybrid guide](https://locark.com/zettelkasten-para-method-offline-2025/).

## What AI changed (2025–2026)

The manual chores each method demands are exactly what LLMs automate well:

| Manual discipline | AI-era equivalent |
|---|---|
| Filing into PARA folders | Agent auto-files inbox items per your schema |
| Writing literature notes | Agent distills sources into permanent-note drafts |
| Finding links between notes | Semantic search / Smart Connections surfaces them; agents write them |
| Progressive summarization | Agent-maintained synthesis pages |
| Weekly reviews / archiving | Scheduled agent runs (lint passes) |

The methods become the **vocabulary of your schema file**: "use PARA top-level folders", "notes are atomic, one concept each", "every note links to at least two others", "distill sources before filing". This is exactly the role the schema layer plays in the LLM Wiki pattern (see `../02-llm-wiki/`).

## When to choose what

- **Just starting, mostly project work:** PARA alone.
- **Research/writing-heavy, want idea generation:** Zettelkasten style, PARA optional.
- **Building an AI-maintained system:** hybrid — encode PARA structure + Zettelkasten linking rules into your agent's schema file.
