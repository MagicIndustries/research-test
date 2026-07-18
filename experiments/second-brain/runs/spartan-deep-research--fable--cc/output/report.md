# The LLM-Augmented Second Brain: Landscape and Recommendations (July 2026)

Research date: 2026-07-18. Audience: a solo developer who works in Claude Code daily and keeps notes in Obsidian.

---

## 1. TL;DR

The second-brain space has reorganized around agents that read and write plain Markdown files, displacing both hosted "AI notes" apps and naive RAG-over-your-documents as the center of gravity — Karpathy's April 2026 "LLM wiki" gist and Obsidian's own agent-skills release are the two clearest markers. Six method families now coexist (manual PKM + AI plugins, hosted AI-native notes, RAG assistants, agent-maintained wikis, agent memory layers, and passive total capture), and they are converging on plain files + MCP as the interoperability layer. For a Claude Code + Obsidian user, the highest-leverage setup is already in reach: treat the vault as the knowledge store, give Claude Code structured access to it (obsidian-skills, a vault schema file, git), and adopt an agent-maintained wiki layer for research topics — while keeping distillation of things you actually need to *know* as a human activity.

## 2. Background

"Second brain" entered mainstream usage through Tiago Forte's *Building a Second Brain* (2022) and his PARA method (Projects / Areas / Resources / Archives) — books with combined sales over 500,000 copies ([Forte Labs](https://fortelabs.com/blog/introducing-the-ai-second-brain/)). The pre-LLM formula was: capture into a notes app, organize by actionability, distill by progressive summarization, express in your work. The chronic failure mode was well known: capture is easy, but organizing, linking, and resurfacing decay because they depend on human discipline.

LLMs attacked that failure mode from several directions at once. First came chat-with-your-notes (RAG: chunk, embed, retrieve at query time). Then hosted apps bolted AI onto their editors. Since 2025, the frontier has shifted again: coding agents such as Claude Code turned out to be general-purpose *file agents*, and because a Markdown vault is just files, the same harness that maintains a codebase can maintain a knowledge base. Forte himself now frames this as "Personal Context Management is replacing Personal Knowledge Management" ([Forte Labs, 2026](https://fortelabs.com/blog/introducing-the-ai-second-brain/)), and Obsidian's CEO shipped official skills so any agent can operate a vault correctly ([kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)).

Two structural events in late 2025 also reshaped the field: Anthropic donated the Model Context Protocol (MCP) to the Linux Foundation's new Agentic AI Foundation, co-founded with Block and OpenAI ([Anthropic, Dec 2025](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation); [Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)), making a vendor-neutral plug standard for connecting knowledge stores to any model; and Meta acquired Limitless (formerly Rewind), shutting down the leading consumer passive-capture products ([TechCrunch, Dec 5 2025](https://techcrunch.com/2025/12/05/meta-acquires-ai-device-startup-limitless/)).

## 3. Key Findings

The findings are organized by method family (3.1–3.6), then cross-cutting observations (3.7–3.8).

### 3.1 Family 1 — Manual PKM (Obsidian et al.) with AI plugins

1. **Obsidian is the anchor of the file-based family, and it is now free for all use including commercial.** Obsidian announced on X that the commercial license became optional — "Anyone can use Obsidian for work, for free" ([@obsdmd on X, Feb 2025](https://x.com/obsdmd/status/1892586092882276352); confirmed at [obsidian.md/pricing](https://obsidian.md/pricing)). Paid add-ons are Sync ($5/mo) and Publish ($10/mo). Note: some secondary posts misdate this announcement to 2026; the primary post is from February 2025.

2. **Obsidian's official answer to AI is agent skills, not an embedded assistant.** CEO Steph Ango ("kepano") published [obsidian-skills](https://github.com/kepano/obsidian-skills) — MIT-licensed skills (Obsidian Flavored Markdown, Bases, JSON Canvas, obsidian-cli, defuddle web clipping) following the Agent Skills specification so they work in "any skills-compatible agent, including Claude Code, Codex, and Open Code." At ~42.4k stars and ~3k forks (checked 2026-07-18), it is one of the most-starred artifacts in the entire PKM space — strong evidence the community is voting for "agents operate on your files" over "AI button in the app." This matches Ango's long-standing "file over app" position ([kepano on X](https://x.com/kepano/status/2050685329120834038)).

3. **The mature AI plugins are Smart Connections and Copilot.** Smart Connections builds a local embedding index over the whole vault for related-notes and semantic search — no API key, offline-capable; the repo shows sustained activity (5.3k stars, 1,856 commits, 372 releases as of July 2026; source-available license with free core) ([brianpetro/obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections)). Copilot adds a chat sidebar with vault Q&A. Comparison writers consistently recommend the pair as covering most in-editor "second brain" needs ([Effortless Academic](https://effortlessacademic.com/adding-ai-to-your-obsidian-notes-with-smartconnections-and-copilot/); [anthemcreation 7-plugin comparison, 2026](https://anthemcreation.com/en/artificial-intelligence/ai-plugins-obsidian-2026-comparison/)).

4. **The methodology layer (PARA) survived contact with LLMs — repurposed as agent scaffolding.** Forte's new "AI Second Brain" cohort program (first cohort April–May 2026, second Sept–Oct 2026) is taught primarily with Claude, including Claude Code and Claude Cowork ([buildingasecondbrain.com/ai-second-brain](https://www.buildingasecondbrain.com/ai-second-brain); [Forte Labs announcement](https://fortelabs.com/blog/introducing-the-ai-second-brain/)). The pitch: PARA folders tell an agent "what's active, what's important, and where new information should go" — organization schemes originally designed for humans double as context-management schemes for agents.

**Trade-offs:** maximal ownership (local plain files, git-able), maximal privacy if you use local embeddings, near-zero cost, but the highest effort of any family — you assemble the pieces yourself.

### 3.2 Family 2 — Hosted AI-native notes apps

5. **The hosted category has split into distinct philosophies with no single winner.** 2026 comparisons consistently frame it as: Notion AI = collaborative workspace (AI now bundled only into the Business plan, ~$20–24/user/mo — the standalone AI add-on was removed for new Free/Plus users); Mem ($12/mo) = automatic organization; Reflect ($10/mo) = privacy-first daily notes with end-to-end encryption by default; Capacities (~$12/mo Pro) = object-based structure; Tana = structured knowledge graph ([MytheAI comparison, 2026](https://mytheai.com/blog/notion-ai-vs-mem-vs-reflect-vs-tana-2026); [Techno-Pulse, Apr 2026](https://www.techno-pulse.com/2026/04/best-ai-note-taking-apps-in-2026-notion.html)). Reflect is the only one of these that claims AI features designed to work with E2EE notes where keys never leave the device — a claim I could not find independently audited (see Open Questions).

6. **Google NotebookLM has quietly become a serious hosted contender, but with hard caps.** Free tier: 100 notebooks, 50 sources/notebook, 50 queries/day; Plus (bundled into Google AI Pro, $19.99/mo): 500 notebooks, 300 sources; up to 600 sources on Ultra; each source capped at 500k words / 200 MB. Tiers were restructured into Google AI subscriptions around Google I/O 2026 ([Elephas guide, 2026](https://elephas.app/blog/notebooklm-source-limits); [notebooklm-guide.com limits page](https://notebooklm-guide.com/notebooklm-system-limits-benchmarks)). It is excellent for bounded research corpora but is a silo: sources go in, but the synthesized knowledge does not live in your files.

**Trade-offs:** lowest effort and best out-of-box polish; but recurring cost ($120–290/yr), weakest ownership (proprietary stores, export ≠ portability), and privacy dependent on vendor promises. The Limitless shutdown (finding 14) is the cautionary tale for depending on a hosted memory product.

### 3.3 Family 3 — RAG assistants over your documents (self-hosted)

7. **Khoj and AnythingLLM are the mature open-source options.** Khoj — literally tagged "Your AI second brain" — indexes Markdown, org-mode, PDFs and more, works with local or online LLMs, and has an official Obsidian plugin; 35.8k stars, AGPL-3.0, cloud or self-host ([khoj-ai/khoj](https://github.com/khoj-ai/khoj)). AnythingLLM is a full-stack local RAG platform (workspaces, agents, vector store) with ~60k+ stars ([AnythingLLM setup guide, 2026](https://localaimaster.com/blog/anythingllm-setup-guide); [curated list of LLM knowledge-base tools](https://github.com/SingggggYee/awesome-llm-knowledge-bases)).

8. **But the RAG family is the one LLM-agent developments have most undermined.** The standard critique — echoed across the Karpathy discussion — is that query-time retrieval "rediscovers knowledge from scratch on every question," and chunking strips context, adding retrieval noise ([Karpathy gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); [innobu analysis, 2026](https://www.innobu.com/en/articles/karpathy-llm-wiki-second-brain-enterprise-reality.html)). RAG remains the right tool for large, cold corpora you will never curate; it is losing ground as the *primary* architecture for a personal, living knowledge base.

**Trade-offs:** good ownership and privacy when self-hosted; moderate-to-high setup and maintenance effort (embedding pipelines, servers); free software but real time cost.

### 3.4 Family 4 — Agent-maintained knowledge (the "LLM wiki" pattern)

9. **Karpathy's llm-wiki gist (April 4, 2026) is the defining document of the newest family.** The pattern: keep **raw** sources immutable; have an LLM agent compile and continuously maintain a persistent, interlinked Markdown **wiki**; govern it with a **schema** file (CLAUDE.md / AGENTS.md) defining ingest, query, and lint (health-check) operations. Key line: "The wiki is a persistent, compounding artifact. The cross-references are already there. The contradictions have already been flagged" ([gist.github.com/karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)). Karpathy's own example wiki spans ~100 articles / ~400k words, with each ingest touching 10–15 pages. Within weeks it spawned an HN thread (~274 points), community implementations, and a cottage industry of guides ([Hjarni hosted mirror](https://hjarni.com/blog/karpathys-llm-wiki-is-right); [Data Science Dojo tutorial](https://datasciencedojo.com/blog/llm-wiki-tutorial/)).

10. **The dissent is substantive and worth taking seriously.** Three recurring critiques: (a) at scale, everything RAG solved comes back — retrieval, ranking, indexing, access control ([AI Critique, May 2026](https://www.aicritique.org/us/2026/05/08/andrej-karpathys-latest-concept-llm-wiki-and-the-future-of-enterprise-knowledge/)); (b) when one process both reads and writes the knowledge base, "silent corruption" is a real failure mode (gist comment thread); (c) the learning objection — one commenter (qaadika) argues the filing/cross-referencing/summarizing Karpathy outsources is precisely where understanding forms, so you end up with "a comprehensive wiki you haven't actually internalized." A Zettelkasten practitioner's review reaches the same split verdict: great external memory, poor substitute for thinking ([WenHao Yu](https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/)). Enterprise architects add that the pattern lacks RBAC, audit logs, and scales to a few hundred pages — a personal tool, not a platform ([innobu](https://www.innobu.com/en/articles/karpathy-llm-wiki-second-brain-enterprise-reality.html)).

11. **Claude Code ships native primitives for exactly this pattern.** Anthropic's memory documentation describes a two-layer system: CLAUDE.md files (user-written persistent instructions, hierarchical: managed policy → `~/.claude/CLAUDE.md` → project → local, with `@path` imports and `.claude/rules/`) and **auto memory** (on by default; Claude writes its own notes to `~/.claude/projects/<project>/memory/`, with a `MEMORY.md` index loaded every session — first 200 lines / 25 KB — plus on-demand topic files) ([code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)). The schema-file convention Karpathy leans on *is* CLAUDE.md/AGENTS.md; Claude Code even documents the `@AGENTS.md` import/symlink pattern for cross-agent compatibility.

12. **Bridges between Claude Code and Obsidian are plentiful and maturing.** Options documented across 2026 guides: run Claude Code directly in the vault as a repo; MCP servers for live vault access (e.g., [iansinnott/obsidian-claude-code-mcp](https://github.com/iansinnott/obsidian-claude-code-mcp), MarkusPfundstein/mcp-obsidian, cyanheads/obsidian-mcp-server); or the official obsidian-skills + obsidian-cli route ([Starmorph integration guide](https://blog.starmorph.com/blog/obsidian-claude-code-integration-guide); [Markana Media MCP setup, 2026](https://markanamedia.com/blog/obsidian-mcp-server-claude-code/); [Awesome Claude: 3 ways](https://awesomeclaude.ai/how-to/use-obsidian-with-claude)). Recurring best practices: `git init` the vault before letting an agent write, and keep agent working files out of the vault proper. [Basic Memory](https://github.com/basicmachines-co/basic-memory) (basicmachines-co) is a notable hybrid: a local-first MCP server that stores AI-conversation knowledge as Markdown entities/relations that humans and any MCP client (Claude, Codex, Cursor) co-edit.

**Trade-offs:** best alignment of ownership (plain files), privacy (local; model API calls are the only egress), and compounding value; cost is model tokens; effort is front-loaded (schema design) and the failure modes (silent drift, un-internalized knowledge) require deliberate countermeasures — lint passes and human review.

### 3.5 Family 5 — Agent memory layers (infrastructure)

13. **A distinct infrastructure market now handles "remember things about me" for agents: Mem0, Zep, Letta.** Mem0 (Apache-2.0, 61.1k stars) is the most widely integrated personalization memory; its ECAI 2025 paper established the first broad head-to-head on the LoCoMo benchmark, and its April 2026 algorithm release self-reports LoCoMo 92.5 / LongMemEval 94.4 ([mem0ai/mem0](https://github.com/mem0ai/mem0); [Mem0 state-of-memory report](https://mem0.ai/blog/state-of-ai-agent-memory-2026)). Zep bets on temporal knowledge graphs via its open-source Graphiti library and leads on time-sensitive benchmarks in third-party tests ([Particula Tech comparison, 2026](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026)). Letta (formerly the MemGPT research project, UC Berkeley) is distinctive for self-editing memory — the agent decides what to remember ([Hermes OS survey](https://hermesos.cloud/blog/ai-agent-memory-systems)). Caveat: vendor benchmark numbers here are largely self-reported and mutually inconsistent across write-ups — treat rankings as directional. For a solo user, this family mostly arrives *embedded in tools you already use* (Claude Code auto memory, ChatGPT memory) rather than as something to deploy.

**Trade-offs:** near-zero effort when embedded; but memory accumulated inside a vendor's layer is the least portable knowledge you own — the opposite of the files-first ethos, unless you use file-backed options like Basic Memory or Claude Code's plain-Markdown auto memory.

### 3.6 Family 6 — Passive total capture

14. **The consumer flagship was absorbed and shut down: Meta acquired Limitless (ex-Rewind) on December 5, 2025.** The $99 pendant is no longer sold, the Rewind desktop recorder was discontinued (capture disabled within weeks), existing users get one year of support and free subscriptions, and the team joined Meta Reality Labs wearables ([TechCrunch](https://techcrunch.com/2025/12/05/meta-acquires-ai-device-startup-limitless/)). Limitless had raised $33M+ from a16z, First Round, and NEA. Customer unease about big tech absorbing always-on recorders was reported immediately ([SF Standard, Dec 2025](https://sfstandard.com/2025/12/14/big-tech-scooping-ai-wearable-startups-customers-spooked/)).

15. **Screenpipe is the main surviving independent option — but its own marketing conflicts with its repo.** The project (mediar-ai/screenpipe, 20.3k stars, Rust, 414 releases) does local-first continuous screen+audio capture with search and an MCP server so Claude and other agents can query your screen history. Conflict flagged: Screenpipe's comparison blog posts describe it as "open source (MIT), $400 lifetime" ([screenpipe blog](https://screenpipe.com/blog/best-rewind-ai-alternative-2026)), while the repository states a **source-available** license (personal non-commercial free, commercial paid) and subscription pricing from $25/mo, with old lifetime licenses grandfathered ([mediar-ai/screenpipe](https://github.com/mediar-ai/screenpipe)). The repo is the primary source; the blogs appear stale or promotional. Microsoft Recall exists on Copilot+ PCs but remains Windows-bound and trust-challenged.

**Trade-offs:** lowest capture effort of any family and genuinely novel recall; but the largest privacy attack surface you can create, real storage/CPU cost, and — as Rewind users just learned — total dependence on the vendor's continued existence and intent.

### 3.7 Convergence signals (cross-cutting)

16. **Plain Markdown + agent is winning the format war.** Evidence: obsidian-skills' star count (finding 2), Karpathy choosing bare .md over any app (finding 9), Basic Memory storing agent memory as Markdown (finding 12), Forte teaching his method on Claude Code (finding 4), and Obsidian's free-for-work move lowering the moat around the files themselves (finding 1).

17. **MCP became the vendor-neutral plug between knowledge stores and models.** Anthropic donated MCP to the Linux Foundation's Agentic AI Foundation (co-founded with Block and OpenAI; supported by Google, AWS, Microsoft, Cloudflare, Bloomberg) in December 2025 ([Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation); [Linux Foundation press release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)); OpenAI is deprecating its Assistants API in favor of MCP-based approaches (mid-2026 sunset) ([Pento year-of-MCP review](https://www.pento.ai/blog/a-year-of-mcp-2025-review)). Practical consequence: an MCP-fronted knowledge store is model-agnostic — you can switch LLM vendors without migrating your second brain.

18. **The architectural pendulum is swinging from retrieval to compilation.** RAG (retrieve fragments at query time) dominated 2023–2025; 2026's energy is behind agents that pre-compile knowledge into curated artifacts (findings 9, 11). The honest synthesis from the debate: compilation wins at personal scale (hundreds of pages, one trusted writer); retrieval re-enters at corpus scale. A personal system will likely end up hybrid — a curated wiki *plus* semantic search over it (which is exactly what Smart Connections provides locally).

19. **Capture hardware is consolidating into big tech; software capture is retreating to open source.** Meta/Limitless (finding 14) follows the pattern of AI wearable startups being acquired, pushing privacy-sensitive users toward source-available local tools (finding 15) — or toward not doing passive capture at all.

### 3.8 What I could not find

20. **No independent longitudinal data on whether LLM-augmented second brains are retained longer than pre-LLM ones.** Claims like "an LLM finally made my second brain stick" ([Stackademic, May 2026](https://blog.stackademic.com/after-6-dead-second-brains-an-llm-finally-made-one-stick-d6e2f680b30a)) are single-person anecdotes. No study, survey, or telemetry-based retention analysis surfaced. Likewise: no independent audit of Reflect's E2EE-plus-AI claim, and no neutral benchmark covering all major agent-memory vendors (each vendor publishes numbers favoring itself).

## 4. Analysis

**The interesting thing about this landscape is that the "tool" question has become boring and the "contract" question has become central.** Five years ago the second-brain debate was Notion vs. Roam vs. Obsidian. In 2026, the app is nearly irrelevant: the durable decisions are (a) what format your knowledge lives in, (b) what schema governs how an agent maintains it, and (c) what protocol exposes it to models. The market has answered: Markdown files, a CLAUDE.md/AGENTS.md-style schema, and MCP. Everything else — which chat sidebar, which embedding model, which hosted app — is swappable. That a 42k-star repo of *instructions for agents* (obsidian-skills) now outshines every AI plugin combined is the clearest tell: the community believes the leverage is in teaching agents your conventions, not in new software.

**The hosted AI-notes apps are being squeezed from both sides.** Below them, files + agents deliver more capability with more ownership at lower cost. Above them, platform AI (NotebookLM in Google's subscription, Notion AI folded into Business plans, ChatGPT/Claude memory) absorbs their casual users. Mem, Reflect, and Capacities each retain a philosophical niche (auto-organization, E2EE, object structure), but the Limitless shutdown demonstrated the tail risk of storing your memory in a venture-funded product: acquisition, then wind-down, on someone else's timeline. For a developer already fluent in git and Markdown, the case for a hosted second brain is now weak.

**The genuinely unresolved tension is cognitive, not technical.** The strongest criticism of the agent-maintained wiki isn't scalability — it's that outsourcing synthesis outsources understanding (finding 10). This maps cleanly onto Forte's own distinction: LLMs are superb at *organize* and *resurface*, and dangerous to delegate *distill* to when the goal is your own competence rather than an answering machine. The practical resolution is a two-tier second brain: an agent-compiled reference layer you consult (comprehensive, always current, never fully read), and a small human-written layer of notes you author yourself for things you need to internalize. Systems that collapse these tiers will drift toward the "comprehensive wiki you haven't internalized" failure mode.

**Surprise:** the extent to which coding-agent infrastructure — not note-taking software — became the substrate. Claude Code's auto memory (an agent journaling to Markdown with a size-bounded index) is architecturally identical to what dedicated memory startups sell, and it shipped as a default-on feature of a developer tool. The second brain and the dev environment are merging into one file tree.

## 5. Recommendations for a solo developer on Claude Code + Obsidian

You are already positioned at the convergence point; the work is wiring, not migration. In order:

1. **First: make the vault agent-safe, then agent-legible.** `git init` the vault and commit a baseline before any agent writes to it (the universally repeated precaution — [Starmorph guide](https://blog.starmorph.com/blog/obsidian-claude-code-integration-guide)). Then install [obsidian-skills](https://github.com/kepano/obsidian-skills) into Claude Code so it writes correct Obsidian Flavored Markdown, wikilinks, and Bases instead of generic Markdown. This is the highest value-per-minute step: it upgrades every future agent interaction with your notes.

2. **Write the vault's schema file.** Add a CLAUDE.md at the vault root (Claude Code reads it automatically when run there; symlink or `@`-import AGENTS.md if you use other agents — [Anthropic docs](https://code.claude.com/docs/en/memory)) defining: folder layout (PARA works well as agent scaffolding — finding 4), naming and linking conventions, what the agent may edit vs. must never touch (e.g., your journal), and where its outputs go. This one file is what turns "an LLM with file access" into "a maintained system."

3. **Adopt the raw/wiki/schema pattern for research topics.** Follow [Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) inside the vault: a `raw/` folder for immutable sources, a `wiki/` folder the agent compiles and updates, ingest/query/lint operations defined in the schema. Run the lint pass periodically — it is the specific countermeasure to the silent-corruption critique (finding 10). Keep a separate folder of notes *you* write; don't let the agent author the things you're trying to learn.

4. **Keep Claude Code auto memory on and curate it monthly.** It's default-on and file-based (`~/.claude/projects/<project>/memory/`); put durable cross-project preferences in `~/.claude/CLAUDE.md` yourself rather than hoping auto memory catches them ([docs](https://code.claude.com/docs/en/memory)). Everything is plain Markdown — audit and prune via `/memory`.

5. **Add Smart Connections for in-editor resurfacing.** Local embeddings, no API key, offline ([repo](https://github.com/brianpetro/obsidian-smart-connections)). This covers the "surprise me with related notes while writing" function that a compile-time wiki doesn't, at zero privacy cost — the hybrid architecture from finding 18.

6. **Defer or skip the rest.** An Obsidian MCP server ([iansinnott/obsidian-claude-code-mcp](https://github.com/iansinnott/obsidian-claude-code-mcp) or Basic Memory) is worth adding only when you want live vault access from clients other than Claude Code — running Claude Code in the vault directory covers the primary case. Skip hosted AI notes apps (squeezed category, lock-in — Analysis). Treat passive capture (screenpipe) as a separate, deliberate privacy decision, not a default — and note its licensing is source-available with a subscription, whatever older marketing says (finding 15). Use NotebookLM tactically for bounded reading projects, but export conclusions back into the vault so the synthesis lives in files you own.

## 6. Open Questions

- **Does LLM maintenance actually fix second-brain abandonment?** No independent retention data exists (finding 20); the strongest claims are anecdotes under 12 months old.
- **Where exactly does the compiled-wiki pattern break down?** Critics say "a few hundred pages"; Karpathy's example is ~100 articles. Nobody has published a rigorous scaling study of a personal LLM wiki over years of accumulation.
- **Does delegating synthesis erode the owner's understanding, and how much does a human-written tier mitigate it?** The qaadika objection is plausible but unmeasured.
- **Can E2EE and useful AI genuinely coexist?** Reflect claims it; no independent audit surfaced.
- **Will agent auto-memory and the curated vault merge or stay separate?** Claude Code currently keeps them apart (memory dir vs. your files); Basic Memory bets on merging them. Unresolved.
- **What happens to vendor-embedded memories at switching time?** MCP standardizes access, but there is no portability standard for accumulated memory itself.

## 7. Sources

Primary sources (first-party: authors, vendors, official docs, repos):

1. [karpathy / llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — GitHub Gist, Andrej Karpathy, published 2026-04-04.
2. [Introducing The AI Second Brain](https://fortelabs.com/blog/introducing-the-ai-second-brain/) — Forte Labs blog, 2026.
3. [The AI Second Brain (program page)](https://www.buildingasecondbrain.com/ai-second-brain) — buildingasecondbrain.com, accessed 2026-07-18.
4. [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) — GitHub, Steph Ango / Obsidian, accessed 2026-07-18 (42.4k stars).
5. [Obsidian: "free for work" announcement](https://x.com/obsdmd/status/1892586092882276352) — @obsdmd on X, February 2025.
6. [Obsidian pricing](https://obsidian.md/pricing) — obsidian.md, accessed 2026-07-18.
7. [kepano on "file over app"](https://x.com/kepano/status/2050685329120834038) — X, 2026.
8. [How Claude remembers your project](https://code.claude.com/docs/en/memory) — Anthropic Claude Code docs, accessed 2026-07-18.
9. [Donating the Model Context Protocol](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) — Anthropic, December 2025.
10. [Linux Foundation announces the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) — Linux Foundation press release, December 2025.
11. [brianpetro/obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections) — GitHub, accessed 2026-07-18 (5.3k stars, 372 releases).
12. [khoj-ai/khoj](https://github.com/khoj-ai/khoj) — GitHub, accessed 2026-07-18 (35.8k stars, AGPL-3.0).
13. [mem0ai/mem0](https://github.com/mem0ai/mem0) — GitHub, accessed 2026-07-18 (61.1k stars, Apache-2.0; April 2026 benchmark release notes).
14. [Mem0: State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) — Mem0 blog (vendor self-reported), 2026.
15. [mediar-ai/screenpipe](https://github.com/mediar-ai/screenpipe) — GitHub, accessed 2026-07-18 (20.3k stars; source-available license, subscription pricing).
16. [basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory) — GitHub, accessed 2026-07-18.
17. [iansinnott/obsidian-claude-code-mcp](https://github.com/iansinnott/obsidian-claude-code-mcp) — GitHub, accessed 2026-07-18.
18. [SingggggYee/awesome-llm-knowledge-bases](https://github.com/SingggggYee/awesome-llm-knowledge-bases) — GitHub curated list, accessed 2026-07-18.
19. [Limitless](https://www.limitless.ai/) — limitless.ai, accessed 2026-07-18.

News and third-party reporting:

20. [Meta acquires AI device startup Limitless](https://techcrunch.com/2025/12/05/meta-acquires-ai-device-startup-limitless/) — TechCrunch, 2025-12-05.
21. [Big Tech is scooping up AI wearable startups. The customers are spooked](https://sfstandard.com/2025/12/14/big-tech-scooping-ai-wearable-startups-customers-spooked/) — SF Standard, 2025-12-14.
22. [Big tech takes steps to build open standards for agentic AI](https://www.ciodive.com/news/big-tech-develop-open-standards-agentic-ai/807608/) — CIO Dive, December 2025.
23. [A Year of MCP: From Internal Experiment to Industry Standard](https://www.pento.ai/blog/a-year-of-mcp-2025-review) — Pento, 2025/2026.

Analysis, comparisons, and community discussion (secondary; used with primary corroboration where load-bearing):

24. [Karpathy's LLM Wiki: Second Brain and the Enterprise Reality Check](https://www.innobu.com/en/articles/karpathy-llm-wiki-second-brain-enterprise-reality.html) — innobu, 2026.
25. [Andrej Karpathy's latest concept 'LLM Wiki' and the future of enterprise knowledge](https://www.aicritique.org/us/2026/05/08/andrej-karpathys-latest-concept-llm-wiki-and-the-future-of-enterprise-knowledge/) — AI Critique, 2026-05-08 (includes HN/gist-comment criticisms).
26. [What Is Karpathy's LLM Wiki? A Zettelkasten User's Honest Review](https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/) — WenHao Yu, 2026.
27. [Andrej Karpathy's LLM Wiki gist, hosted](https://hjarni.com/blog/karpathys-llm-wiki-is-right) — Hjarni, 2026.
28. [LLM Wiki tutorial](https://datasciencedojo.com/blog/llm-wiki-tutorial/) — Data Science Dojo, 2026.
29. [After 6 dead second brains, an LLM finally made one stick](https://blog.stackademic.com/after-6-dead-second-brains-an-llm-finally-made-one-stick-d6e2f680b30a) — Malik Chohra, Stackademic, May 2026 (anecdote).
30. [Notion AI vs Mem vs Reflect vs Tana: Best AI Notes Tool 2026](https://mytheai.com/blog/notion-ai-vs-mem-vs-reflect-vs-tana-2026) — MytheAI, 2026.
31. [Best AI Note-Taking Apps in 2026](https://www.techno-pulse.com/2026/04/best-ai-note-taking-apps-in-2026-notion.html) — Techno-Pulse, April 2026.
32. [NotebookLM Limits Explained (2026)](https://elephas.app/blog/notebooklm-source-limits) — Elephas, 2026.
33. [NotebookLM Limits 2026: Every Cap & Quota by Plan](https://notebooklm-guide.com/notebooklm-system-limits-benchmarks) — notebooklm-guide.com, 2026.
34. [Adding AI to your Obsidian Notes with SmartConnections and CoPilot](https://effortlessacademic.com/adding-ai-to-your-obsidian-notes-with-smartconnections-and-copilot/) — The Effortless Academic.
35. [AI plugins Obsidian 2026: comparison of 7 major](https://anthemcreation.com/en/artificial-intelligence/ai-plugins-obsidian-2026-comparison/) — Anthem Creation, 2026.
36. [Obsidian + Claude Code: The Complete Integration Guide](https://blog.starmorph.com/blog/obsidian-claude-code-integration-guide) — Starmorph, 2026.
37. [How to Set Up the Obsidian MCP Server for Claude Code (2026)](https://markanamedia.com/blog/obsidian-mcp-server-claude-code/) — Markana Media, 2026.
38. [3 Ways to Use Obsidian with Claude Code](https://awesomeclaude.ai/how-to/use-obsidian-with-claude) — Awesome Claude, 2026.
39. [Agent Memory Frameworks Tested: Mem0 vs Zep vs Letta vs Cognee](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026) — Particula Tech, 2026.
40. [AI agent memory systems in 2026: Zep, Mem0, Letta](https://hermesos.cloud/blog/ai-agent-memory-systems) — Hermes OS, 2026.
41. [AnythingLLM Setup (2026)](https://localaimaster.com/blog/anythingllm-setup-guide) — Local AI Master, 2026.
42. [Best Rewind AI Alternative: Screenpipe in 2026](https://screenpipe.com/blog/best-rewind-ai-alternative-2026) — Screenpipe blog (vendor marketing; conflicts with its own repo on license/pricing — see finding 15).

Date hygiene note: all sources above are from 2025–2026 except the February 2025 Obsidian licensing announcement (still current per the live pricing page) and the 2022 publication context for Forte's books (historical background, not a current-state claim).
