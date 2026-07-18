# The LLM-Era "Second Brain": Landscape, Method Families, and a Setup Plan

**Research date:** 2026-07-18. All repository statistics were read live from the GitHub API on this date; all other claims cite the primary source that owns them.

---

## 1. Scope and definitions

A "second brain" here means an external, searchable, durable system that captures what its owner reads, learns, and decides, organizes it, and resurfaces it on demand. The term was popularized by Tiago Forte's *Building a Second Brain* methodology, whose organizing scheme — PARA (Projects, Areas, Resources, Archives) — sorts information "by actionability" rather than by topic, on the principle that "your system has to give you time, not take time" ([Forte Labs, "The PARA Method"](https://fortelabs.com/blog/para/)).

Since roughly 2023, and dramatically since late 2025, LLMs have changed every part of this pipeline: capture (auto-transcription, web clipping with extraction), organization (agents that file and link notes), and retrieval (semantic search, chat-over-notes, and — most recently — agents that *maintain* the knowledge base rather than merely query it).

The landscape now sorts into seven method families. They are not mutually exclusive; the interesting story of 2025–2026 is that they are converging on a shared substrate (plain Markdown files) and shared connective standards (MCP and Agent Skills).

---

## 2. Method families and how LLMs changed each

### 2.1 Methodology-first manual PKM (Zettelkasten, PARA, GTD)

The pre-LLM families were *methods*, not tools: Zettelkasten's atomic linked notes, Forte's PARA/CODE (Capture, Organize, Distill, Express) ([Forte Labs](https://fortelabs.com/blog/para/)), Getting Things Done. Their chronic failure mode was maintenance cost — the distilling and linking work fell entirely on the human.

**How LLMs changed it:** the methods survive, but as *conventions an agent can follow*. A folder taxonomy and linking discipline that once cost the owner hours a week is now something an LLM executes from a written schema. The methodology layer has effectively become the "prompt layer" of the newer families below. No tool to buy here; the trade-off ledger is all effort (high pre-LLM, low when delegated) and full ownership.

### 2.2 Local-first Markdown editors + AI plugins (Obsidian, Logseq)

**Obsidian** is the anchor of this family. Its CEO Steph Ango's "File over app" essay is the family's founding philosophy: "If you want your writing to still be readable on a computer from the 2060s or 2160s, it's important that your notes can be read on a computer from the 1960s" ([stephango.com/file-over-app](https://stephango.com/file-over-app)). Notes are plain Markdown on the user's own disk; the app is free; sync is an optional paid service.

**How LLMs changed it — Obsidian's deliberate pivot to being *agent-native* rather than AI-featured:**

- **Official CLI (early 2026).** Obsidian shipped a built-in command-line interface — "Anything you can do in Obsidian you can do from the command line" — and the official page explicitly names the use case: "Give agentic tools the ability to interact with your vault" ([obsidian.md/cli](https://obsidian.md/cli)). A separate official headless client syncs vaults on servers without the desktop app ([obsidianmd/obsidian-headless](https://github.com/obsidianmd/obsidian-headless)).
- **Official Agent Skills (January 2026).** Ango published [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) — "Agent skills for Obsidian. Teach your agent to use Obsidian CLI and open formats including Markdown, Bases, JSON Canvas" — created 2026-01-02, MIT-licensed, and at **42,438 GitHub stars** as of this research date (GitHub API). That a skills repo for a note app out-starred most AI frameworks in six months is the clearest single signal of where this family is going: Obsidian chose to teach external agents its formats rather than embed a chatbot.
- **Official Web Clipper.** Free, open-source browser extension (Chrome, Safari, Firefox, Edge, and others) that captures pages as Markdown into the vault ([obsidian.md/clipper](https://obsidian.md/clipper)).
- **Community AI plugins.** [Smart Connections](https://github.com/brianpetro/obsidian-smart-connections) (5,283 stars; local embedding model, "no API key," semantic related-notes surfacing) and [Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot) (7,422 stars, AGPL, pushed the day of this research; chat sidebar with vault Q&A, [obsidiancopilot.com](https://www.obsidiancopilot.com)). Both are active but an order of magnitude smaller than the agent-skills route.

**Logseq** ([logseq/logseq](https://github.com/logseq/logseq), 43,946 stars, AGPL, still actively pushed as of 2026-07-18) is the open-source outliner alternative — privacy-first, local files — but it has no equivalent of Obsidian's official agent tooling, and its community AI story is thinner.

**Trade-offs:** full ownership and privacy (files never leave your machine unless you choose); zero-to-low cost (Obsidian free; AI plugin costs are your own API keys or local models); moderate setup effort. The risk that used to be cited against this family — "you have to do all the organizing yourself" — is precisely the cost LLM agents now absorb.

### 2.3 Cloud AI-native workspaces (Notion, Mem, Reflect)

**Notion** has pushed AI through its whole product: AI features exist on every tier (limited trial on Free/Plus), with AI Meeting Notes and Enterprise Search on the $20/member/month Business plan and full access plus "zero data retention" processing only on Enterprise ([notion.com/pricing](https://www.notion.com/pricing)). **Mem** ([get.mem.ai](https://get.mem.ai/)) is the purest expression of the family's bet — no folders, AI organizes and resurfaces everything — and shipped a rebuilt "Mem 2.0" in early 2026.

**How LLMs changed it:** these apps went from "notes with an AI writing assistant" (2023) to AI-organized knowledge with chat retrieval, meeting capture, and workspace-wide semantic search (2025–26). The convenience ceiling is the highest of any family.

**Trade-offs:** lowest effort, but weakest ownership — notes live in a proprietary cloud database, exports are lossy relative to a Markdown-native system, and the AI processing terms depend on your tier (Notion's zero-retention guarantee is Enterprise-only, per its own pricing page). Recurring cost per seat. For a solo developer who already pays for an LLM subscription, this family charges again for intelligence you already have.

### 2.4 Source-grounded research notebooks (NotebookLM)

Google's **NotebookLM** defines this family: you upload sources into a notebook and the model answers *only from those sources*, with citations; limits are per-notebook source caps that scale with the Google AI subscription tier ([Google NotebookLM Help — FAQ](https://support.google.com/notebooklm/answer/16269187?hl=en)). Through 2026 it has added audio/video overviews and agentic source discovery, and its tiers were folded into Google AI subscriptions.

**How LLMs changed it:** this family *is* an LLM invention — it didn't exist pre-2023. It is the best low-effort answer to "interrogate this pile of documents," but it is a per-project research tool, not a compounding personal knowledge base: notebooks are silos in Google's cloud, and nothing accumulates across them into an owned artifact.

**Trade-offs:** near-zero effort, excellent grounding; no local ownership, per-notebook fragmentation, Google account dependency.

### 2.5 Self-hosted personal RAG ("chat with your knowledge")

The open-source family that indexes your documents into embeddings and serves chat over them:

| Tool | Stars (2026-07-18, GitHub API) | License | Position |
|---|---|---|---|
| [Open WebUI](https://github.com/open-webui/open-webui) | 145,801 | custom | Self-hosted AI interface with RAG over uploaded docs; the biggest project in the space |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | 63,460 | MIT | "Local-first agent experience"; desktop + server, document workspaces |
| [Khoj](https://github.com/khoj-ai/khoj) | 35,842 | AGPL-3.0 | Self-describes as "Your AI second brain. Self-hostable" — syncs Obsidian/markdown/PDF, agents, automations ([khoj.dev](https://khoj.dev)) |
| [Reor](https://github.com/reorproject/reor) | 8,564 | AGPL-3.0 | Local AI notes app — **last pushed May 2025**, effectively dormant |

**How LLMs changed it:** this family is also LLM-native, and it boomed in 2023–24 as *the* way to get AI over private notes. But it is now under pressure from two directions: agent CLIs (Claude Code and peers) can simply read and grep the files directly, and the agent-maintained-wiki family (below) argues that retrieval-per-query is the wrong architecture for personal knowledge. Reor's dormancy while Khoj pivots toward agents/automations illustrates the squeeze.

**Trade-offs:** strong privacy and ownership (self-hosted, local models possible), zero marginal cost after setup, but the highest ongoing operational effort of any family (embedding pipelines, index freshness, model hosting) — and for a vault-sized corpus, an agent with file tools increasingly makes the vector index optional.

### 2.6 Agent-maintained knowledge bases — the new center of gravity

This is the family LLMs created *most recently*, and the one moving fastest.

**The Karpathy "LLM Wiki" pattern (April 2026).** Andrej Karpathy published a spec-as-gist ([gist.github.com/karpathy/442a6bf555914893e9891c11519de94f](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), created 2026-04-04, 5,000+ stars and 5,000+ forks) defining a three-layer architecture: (1) immutable **raw sources** the LLM reads but never edits; (2) a **wiki** of LLM-generated, cross-referenced Markdown pages the model owns entirely; (3) a **schema** file (CLAUDE.md/AGENTS.md) that turns a generic coding agent into a disciplined wiki maintainer, with three core operations — *ingest*, *query*, and *lint* (health-checking for contradictions, orphans, stale claims). Its explicit stance against personal RAG: "the wiki is a persistent, compounding artifact" — knowledge is compiled once at ingest instead of being re-derived from raw chunks on every question (same gist).

**Claude Code's own memory machinery** is the same pattern productized. Per the official docs ([code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)): CLAUDE.md files give persistent instructions at managed/user/project/local scopes, support `@path` imports, and load every session; **auto memory** (on by default) has Claude write its own learnings to `~/.claude/projects/<project>/memory/` — a `MEMORY.md` index (first 200 lines / 25KB loaded each session) plus topic files read on demand. Everything is plain, user-editable Markdown.

**Basic Memory** ([basicmemory.com](https://basicmemory.com), [GitHub](https://github.com/basicmachines-co/basic-memory), 3,451 stars, AGPL, actively pushed) is the bridge product: an MCP server that has LLM chats read/write structured Markdown notes in a local directory that doubles as an Obsidian vault.

**Trade-offs:** total ownership (it's your files in your repo), privacy bounded only by which model you point at it, cost = your existing agent subscription, and effort that is front-loaded (writing the schema) then genuinely low. Its immaturity risk: the pattern is fifteen months old at most, conventions are still settling, and quality depends on the agent's discipline (hence the lint operation).

### 2.7 Memory layers and ambient capture

Two adjacent families matter to the picture:

**Agent memory infrastructure.** [mem0](https://github.com/mem0ai/mem0) ("Universal memory layer for AI Agents," 61,084 stars, Apache-2.0, pushed 2026-07-17) and [Letta](https://github.com/letta-ai/letta) (23,833 stars, Apache-2.0), plus the platforms' built-ins: OpenAI's ChatGPT memory ([OpenAI Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)) and Anthropic's memory in claude.ai ([release notes](https://support.claude.com/en/articles/12138966-release-notes)) and the filesystem-based memory tool in the API ([platform.claude.com memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)). These remember *for the assistant*, not for you: platform memories are viewable but live inside the vendor's product, and mem0/Letta are developer infrastructure for apps rather than personal knowledge systems. They complement, but do not replace, an owned second brain — and notably, Anthropic's own API memory tool stores memories *as files*, converging on the same substrate as family 2.6.

**Ambient capture / lifelogging — a cautionary tale.** Screen-recording and wearable capture promised the zero-effort second brain. The family's flagship, Limitless (which had absorbed Rewind), announced on its own site that Meta acquired it on December 5, 2025: Pendant sales halted, the Rewind screen/audio capture was disabled December 19, 2025, and service terminated in the EU, UK, Brazil, China, Israel, South Korea, and Turkey, with a two-week window to export data before permanent deletion ([limitless.ai](https://www.limitless.ai)). The open-source survivor is [screenpipe](https://github.com/mediar-ai/screenpipe) ("Record your screen 24/7 and plug into your agents. Local, private, secure," 20,254 stars, actively pushed). The lesson is structural: total-capture systems concentrate maximally sensitive data, so vendor risk is existential — users of a Markdown vault lose a company and keep everything; Limitless users in seven jurisdictions got fourteen days.

**Deliberate resurfacing.** For knowledge you must *internalize* rather than look up, spaced repetition remains its own discipline: Anki now ships FSRS, a machine-learned scheduler (optional, per-deck) that "can help you remember more material in the same amount of time" by fitting intervals to your actual review history ([Anki manual, deck options](https://docs.ankiweb.net/deck-options.html)). Readwise's Daily Review applies the same resurfacing idea to highlights ([readwise.io/read](https://readwise.io/read)). LLMs' contribution here is card *generation* from notes — the scheduling science predates them.

**Capture pipelines.** [Readwise Reader](https://readwise.io/read) is the mature commercial capture layer: articles, PDFs, EPUBs, RSS, newsletters, YouTube; a "Ghostreader" GPT copilot; and first-class highlight export to Obsidian, Notion, Roam, Evernote, and Logseq — $9.99/month billed annually.

---

## 3. Trade-off summary

| Family | Ownership | Privacy | Cost | Effort | Maturity signal |
|---|---|---|---|---|---|
| Manual methodology (PARA, Zettelkasten) | Full | Full | $0 | High (unless delegated to an agent) | Decades of practice |
| Local Markdown + agents (Obsidian) | Full — plain files ([file-over-app](https://stephango.com/file-over-app)) | You choose the model | $0 + API/subscription you already have | Moderate, front-loaded | Official CLI + 42k-star official skills repo |
| Cloud AI workspace (Notion, Mem) | Vendor DB | Tier-dependent retention ([Notion pricing](https://www.notion.com/pricing)) | $10–20+/mo | Lowest | Large public companies/products |
| Source-grounded notebook (NotebookLM) | None (Google cloud) | Google terms | Bundled with Google AI tiers | Very low | Google-scale product |
| Self-hosted RAG (Khoj, Open WebUI, AnythingLLM) | Full | Strongest (fully local possible) | $0 + hardware | Highest ongoing | 35k–145k stars, active |
| Agent-maintained wiki (Karpathy pattern, Claude Code memory, Basic Memory) | Full | Bounded by model choice | Existing agent subscription | Front-loaded schema, then low | 15 months old; 5k-star spec, first-party Obsidian & Anthropic support |
| Ambient capture (screenpipe; ex-Limitless) | Full only if local | Extreme stakes | $0 (OSS) | Low capture, high triage | Limitless shutdown proves vendor risk ([limitless.ai](https://www.limitless.ai)) |

---

## 4. Where the ecosystem is converging

Four convergence lines are visible in the primary sources, not just the commentary:

1. **Plain Markdown files as the universal substrate.** Obsidian's whole strategy ([file-over-app](https://stephango.com/file-over-app)), Karpathy's wiki ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)), Claude Code's CLAUDE.md and auto memory ([docs](https://code.claude.com/docs/en/memory)), Anthropic's API memory tool ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)), and Basic Memory all store knowledge as agent-editable Markdown. The file system beat the database for personal knowledge because it is the interface agents already have.

2. **Open connective standards under neutral governance.** On December 9, 2025, Anthropic donated MCP to the new Agentic AI Foundation under the Linux Foundation, co-founded with OpenAI and Block (which contributed AGENTS.md and goose respectively), with AWS, Google, Microsoft, Cloudflare, and Bloomberg as platinum members; the Linux Foundation cited 97M+ monthly SDK downloads and 10,000+ active MCP servers ([Linux Foundation press release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation); [Anthropic announcement](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation); [MCP blog](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/)). In parallel, Agent Skills — a folder with a SKILL.md that any compliant agent can load — became an open spec ([agentskills.io](https://agentskills.io/home); [spec repo](https://github.com/agentskills/agentskills)). Your second brain's *access layer* is no longer tied to one vendor's agent.

3. **Compilation over retrieval.** The 2023–24 assumption (embed everything, RAG per query) is yielding to the persistent-synthesis model: Karpathy's gist argues RAG "rediscovers knowledge from scratch on every question" while a maintained wiki compounds. Khoj's drift from search toward agents/automations ([repo description](https://github.com/khoj-ai/khoj)) and Reor's dormancy are the market registering the same shift.

4. **Apps teaching agents, not embedding chatbots.** Obsidian shipped a CLI "for agentic tools" and official skills instead of a built-in assistant ([obsidian.md/cli](https://obsidian.md/cli); [obsidian-skills](https://github.com/kepano/obsidian-skills)). The product's job is to be legible to your agent; intelligence stays a pluggable commodity.

---

## 5. Recommendations for a solo developer in Claude Code + Obsidian daily

You are, by accident of tooling, already standing on the convergence point: your notes are agent-readable Markdown and your daily driver is an agent with file tools. The recommendation is *not* to add a new system but to wire together what you have — in this order.

**1. Make the vault a Claude Code workspace (first, ~30 minutes).** Open Claude Code in the vault directory and write a vault-root `CLAUDE.md` describing your folder layout, note conventions, linking style, and what the agent may and may not touch. This is Karpathy's "schema" layer verbatim ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)), and CLAUDE.md is the documented first-class mechanism for it — loaded every session, with `@path` imports if it grows ([memory docs](https://code.claude.com/docs/en/memory)). *Why first:* every subsequent step compounds through this file; without it the agent improvises a different convention each session.

**2. Install Obsidian's official agent tooling.** Add [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) (MIT, 42k stars) so Claude Code writes correct wikilinks, frontmatter, Bases, and Canvas rather than generic Markdown, and enable the official Obsidian CLI so the agent can drive search, daily notes, and properties through supported commands instead of ad-hoc file surgery ([obsidian.md/cli](https://obsidian.md/cli)). *Why:* this is first-party, spec-conformant plumbing — the lowest-risk integration available anywhere in this landscape.

**3. Adopt the wiki pattern incrementally.** Create `sources/` (immutable captures) and let your existing notes be the wiki layer. Write three small Claude Code skills matching the gist's operations: *ingest* (summarize a new source into linked notes and update an index), *query* (answer from the vault with links, filing genuinely new syntheses back as notes), and *lint* (weekly: contradictions, orphan notes, stale claims). *Why:* this converts the vault from something you search into something that compounds, at near-zero marginal cost on a subscription you already pay for.

**4. Wire the capture inlet.** Install the free official [Obsidian Web Clipper](https://obsidian.md/clipper) so web material lands in `sources/` as Markdown. If you read heavily across PDFs/newsletters/videos, [Readwise Reader](https://readwise.io/read) ($9.99/mo) is the one paid service worth considering, because its highlight export writes into Obsidian — it feeds your files rather than replacing them.

**5. Keep Claude Code auto memory on, and understand the split.** Auto memory accumulates *per-repo working knowledge* (build quirks, your corrections) in `~/.claude/projects/<project>/memory/` automatically ([memory docs](https://code.claude.com/docs/en/memory)); the vault holds *your* knowledge. Both are Markdown you can audit with `/memory`. Don't merge them — one is the agent's notebook, the other is yours.

**What to skip, and why:**
- **A personal RAG stack (Khoj, Open WebUI, vector DBs):** highest ongoing effort in the landscape, and for a vault-scale corpus Claude Code's grep/read plus a maintained index note answers the same questions — the compilation architecture makes the embedding index optional (Karpathy [gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)). Revisit only if vault search demonstrably fails you.
- **Cloud second-brain apps (Notion AI, Mem):** you would pay per month to re-house Markdown you already own into a vendor database with tier-gated AI terms ([Notion pricing](https://www.notion.com/pricing)).
- **Proprietary ambient capture:** Limitless's post-acquisition shutdown — regional terminations with a 14-day export window ([limitless.ai](https://www.limitless.ai)) — is the controlled experiment in why maximally-sensitive capture must be local and open (screenpipe) if you want it at all.
- **Hosted memory layers (mem0, Letta) for personal notes:** excellent *application* infrastructure, wrong layer for a personal system you want to own outright.

The one-line rationale: every convergence signal in section 4 — file substrate, neutral protocols, agent-maintained synthesis, apps-teach-agents — already points at "Markdown vault + coding agent + written schema." Setting up anything else first would be building against the grain of where every primary actor, from Obsidian's CEO to Anthropic's docs to Karpathy's spec, is publicly heading.

---

## 6. Source register

**Official docs / first-party pages:** [Obsidian CLI](https://obsidian.md/cli) · [Obsidian Web Clipper](https://obsidian.md/clipper) · [obsidian-headless](https://github.com/obsidianmd/obsidian-headless) · [stephango.com/file-over-app](https://stephango.com/file-over-app) · [Claude Code memory docs](https://code.claude.com/docs/en/memory) · [Claude API memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) · [Claude release notes](https://support.claude.com/en/articles/12138966-release-notes) · [OpenAI Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq) · [modelcontextprotocol.io](https://modelcontextprotocol.io) · [MCP blog: joining AAIF](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) · [Linux Foundation AAIF press release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) · [Anthropic MCP donation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) · [agentskills.io](https://agentskills.io/home) · [Agent Skills spec](https://github.com/agentskills/agentskills) · [Notion pricing](https://www.notion.com/pricing) · [NotebookLM FAQ](https://support.google.com/notebooklm/answer/16269187?hl=en) · [Readwise Reader](https://readwise.io/read) · [limitless.ai](https://www.limitless.ai) · [Forte Labs: PARA](https://fortelabs.com/blog/para/) · [Anki manual: deck options / FSRS](https://docs.ankiweb.net/deck-options.html) · [Karpathy LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

**Repository metrics (GitHub API, 2026-07-18):** [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) 42,438★ · [open-webui/open-webui](https://github.com/open-webui/open-webui) 145,801★ · [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) 63,460★ · [mem0ai/mem0](https://github.com/mem0ai/mem0) 61,084★ · [logseq/logseq](https://github.com/logseq/logseq) 43,946★ · [khoj-ai/khoj](https://github.com/khoj-ai/khoj) 35,842★ · [letta-ai/letta](https://github.com/letta-ai/letta) 23,833★ · [mediar-ai/screenpipe](https://github.com/mediar-ai/screenpipe) 20,254★ · [reorproject/reor](https://github.com/reorproject/reor) 8,564★ (dormant since 2025-05) · [logancyang/obsidian-copilot](https://github.com/logancyang/obsidian-copilot) 7,422★ · [brianpetro/obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections) 5,283★ · [basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory) 3,451★
