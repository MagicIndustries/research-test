---
experiment: second-brain-original
variant: spartan-deep-research--fable--cc
skills:
  - { name: spartan-deep-research, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 11m8s
tokens: 98079
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

do a deep dive on second brain creation using llms, knowledge graphs, wikis etc. Find out the most current and most popular techniques, create a set of resources for each including github links, code, articles, tutorials, video links etc. Create documentation for each and create a detailed summary that goes over the concept and its variations in depth then summarizes the main details of each alternative methods, then summarizes each alternative option (git repos, tools, etc). The aim is to have a comprehensive overview of all current methods and options for getting started, a deep understanding of how to build a second brain in the variuous ways, and all the research, links, instructions and such that I  would need to follow up and trial any of the options. create everything in markdown files in the subdirectory secondBrain and collect resources for different methods under their own subdirectories within secondBrain

## Deviations & notes

Same conventions overrides as the sibling experiment's spartan run: scope step pre-answered from the prompt (full report; audience unspecified by the prompt — none assumed); the skill's `02-research/` output rule and the prompt's `secondBrain/` location both mapped into the harness — deliverable tree lands at `output/secondBrain/`. Prompt verbatim including original typos.
