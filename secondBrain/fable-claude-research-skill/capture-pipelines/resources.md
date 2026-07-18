# Resources — Capture Pipelines

Star counts and activity checked via the GitHub API on 2026-07-18 (where applicable).

## Speech-to-text engines

- [openai/whisper](https://github.com/openai/whisper) — MIT. The base models incl. `turbo` (optimized large-v3). Runs offline.
- [m-bain/whisperX](https://github.com/m-bain/whisperX) — 23.1k★, BSD-2-Clause, pushed July 2026. Word-level timestamps + speaker diarization for meetings/interviews.
- [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) — CTranslate2 port, the standard for fast local transcription (~13x realtime, large-v3, RTX 3090 per [Local AI Master's benchmarks](https://localaimaster.com/blog/whisper-local-speech-to-text)).

## Capture apps

- [OpenWhispr](https://openwhispr.com/) — open-source, offline system-wide dictation (Whisper + NVIDIA Parakeet).
- [Whisper Notes](https://whispernotes.app/) — 100% offline iPhone/Mac transcription app; record memos, import audio.
- [Wispr Flow](https://wisprflow.ai/) — polished commercial dictation (closed-source, cloud processing — check privacy fit).
- [Obsidian Web Clipper](https://obsidian.md/clipper) — official browser extension, web → Markdown.
- [karakeep-app/karakeep](https://github.com/karakeep-app/karakeep) — 27.5k★, AGPL-3.0, active. Self-hosted bookmark-everything with AI auto-tagging. [Docs](https://docs.karakeep.app).

## Pipelines & tutorials

- [From Voice Memos to Searchable Text with Local Whisper on macOS (Feb 2026)](https://jonnyzzz.com/blog/2026/02/28/voice-memos-local-ai-transcription/) — the reference DIY pipeline: AppleScript → local Whisper → Markdown; extends into a pgvector-indexed RAG over the resulting vault.
- [Run Whisper Locally 2026: Free Offline Speech-to-Text Setup (Local AI Master)](https://localaimaster.com/blog/whisper-local-speech-to-text) — model-size/speed/VRAM decision tables.
- [Use OpenAI Whisper for Automated Transcriptions (Towards Data Science)](https://towardsdatascience.com/use-openai-whisper-for-automated-transcriptions/) — scripting basics.

## Adjacent commercial meeting-capture

- [Granola](https://www.granola.ai) — AI meeting notes on-device-ish; frequently cited as the AI-native meeting tool of 2025–26.
- [Otter.ai](https://otter.ai) — the incumbent cloud transcription service (cloud privacy trade-offs apply).
