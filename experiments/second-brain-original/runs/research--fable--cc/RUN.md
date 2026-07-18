---
experiment: second-brain-original
variant: research--fable--cc
skills:
  - { name: research, sha: f8e55ff }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 12m11s
tokens: 95903
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

do a deep dive on second brain creation using llms, knowledge graphs, wikis etc. Find out the most current and most popular techniques, create a set of resources for each including github links, code, articles, tutorials, video links etc. Create documentation for each and create a detailed summary that goes over the concept and its variations in depth then summarizes the main details of each alternative methods, then summarizes each alternative option (git repos, tools, etc). The aim is to have a comprehensive overview of all current methods and options for getting started, a deep understanding of how to build a second brain in the variuous ways, and all the research, links, instructions and such that I  would need to follow up and trial any of the options. create everything in markdown files in the subdirectory secondBrain and collect resources for different methods under their own subdirectories within secondBrain

## Deviations & notes

The prompt's "subdirectory secondBrain" output location is mapped into the harness: the run's `output/` directory stands in as the working root, so the deliverable tree lands at `output/secondBrain/`. Prompt otherwise verbatim, including the owner's original typos ("variuous", double space) — deliberately preserved for prompt fidelity.
