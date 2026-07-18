# Capture Pipelines: Voice, Clipping & Auto-Filing

A second brain is only as good as what reaches it. This family covers the **input layer**: frictionless capture (voice, web, bookmarks) plus automated transcription and filing — increasingly done by LLMs rather than by you.

## Voice → text → notes

**The engine**: [OpenAI Whisper](https://github.com/openai/whisper) remains the best speech-to-text you can run on your own hardware; the `turbo` model is an optimized large-v3 with minimal accuracy loss. Production-grade wrappers:

- [WhisperX](https://github.com/m-bain/whisperX) (23.1k★, BSD-2-Clause, active) — word-level timestamps + speaker diarization; the standard for meeting recordings.
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — CTranslate2 reimplementation; ~13x realtime for a 60-min file with large-v3 on an RTX 3090 ([benchmark](https://localaimaster.com/blog/whisper-local-speech-to-text)).

**The pattern** (fully local, e.g. [Eugene Petrenko's macOS pipeline, Feb 2026](https://jonnyzzz.com/blog/2026/02/28/voice-memos-local-ai-transcription/)): pull recordings from Voice Memos via AppleScript → transcribe locally on Apple Silicon → emit searchable Markdown into the vault. Add local summarization (faster-whisper + Ollama) and you have a private meeting-notes pipeline competitive with commercial tools.

**Dictation-first tools**: [OpenWhispr](https://openwhispr.com/) (open source, offline, Whisper/Parakeet) and [Whisper Notes](https://whispernotes.app/) (offline iPhone/Mac) for push-to-talk capture; [Wispr Flow](https://wisprflow.ai/) (closed, cloud) for polished system-wide dictation.

## Web & bookmark capture

- [Obsidian Web Clipper](https://obsidian.md/clipper) — official, free: article → clean Markdown in the vault. The natural sources-feeder for an [LLM wiki](../llm-generated-wikis/overview.md).
- [Karakeep](https://github.com/karakeep-app/karakeep) (27.5k★, AGPL-3.0, active — formerly Hoarder) — self-hosted bookmark-everything (links, notes, images) with **AI auto-tagging** and full-text search. The best current example of "LLM does the filing."
- [NotebookLM](https://notebooklm.google) source discovery — hands web-finding itself to the AI: it proposes related sources you approve into a notebook.

## Auto-filing: the LLM as librarian

The 2026 shift: capture goes to an **inbox**, and an LLM routes it — tags it (Karakeep), files it into PARA folders, or ingests it into a wiki (Karpathy pattern). If you use Claude Code, a cron/loop that processes `inbox/` into your vault per your `CLAUDE.md` conventions replicates the commercial "auto-organization" feature (Mem's pitch) on files you own.

## Trade-offs

**Strengths**
- Highest ROI-per-hour of any family: capture friction, not storage or retrieval, is where most second brains actually fail.
- The voice stack is genuinely private and free (Whisper is MIT, runs offline).
- Composable with every other family — this is the input layer for all of them.

**Weaknesses**
- Pipelines are DIY plumbing: AppleScript/cron/watch-folders that *you* maintain.
- Auto-tagging quality is decent but imperfect; a periodic human (or lint-agent) review pass is still needed.
- Capturing everything ≠ knowing anything — without a processing step (distillation, wiki ingest), you build a well-indexed landfill.

## Who it's for

Everyone, as a complement: pick your storage family first, then add one capture upgrade. Voice-heavy thinkers and meeting-laden professionals gain the most.

## Getting started (concrete)

1. Install [Obsidian Web Clipper](https://obsidian.md/clipper) (or self-host [Karakeep](https://docs.karakeep.app) via Docker for AI-tagged bookmarks).
2. Voice: try [OpenWhispr](https://openwhispr.com/) for dictation; for batch memos, `pip install faster-whisper` and script Voice-Memos→Markdown per [this walkthrough](https://jonnyzzz.com/blog/2026/02/28/voice-memos-local-ai-transcription/).
3. Create an `inbox/` folder in your vault; end each week (or wire an agent) to empty it into its proper home.
