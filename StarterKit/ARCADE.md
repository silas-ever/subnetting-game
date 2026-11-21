---
arcade_version: 1

game:
  title: "Subnet Sashimi"
  slug: "subnet-sashimi"
  tagline: "An educational fishing game for practicing IPv4 subnetting."
  summary: "Catch octets and build a valid host address for each displayed subnet. Learn to identify the network, broadcast, and valid host range through feedback and repeated practice."
  topics: [IPv4, subnetting, CIDR, network address, broadcast address]
  category: "network-fundamentals"
  skill_level: "beginner"
  play_minutes: 3
  levels: 0
  card_image: ""
  card_image_alt: ""
  repo: "https://github.com/silas-ever/subnetting-game"
  repo_path: ""
  license: ""

creator:
  name: "Silas Ever"
  github: "silas-ever"
  location: "Atlanta, GA"
  organization: ""
  links: []
  first_spec_project: true
  workshop: "NAF AC6"
  consent_to_publish: true

build:
  started: "unknown"
  finished: "unknown"
  wall_time: "unknown"
  spec_driven:
    framework: "Spec Kit-style workflow"
    framework_version: "unknown"
    artifacts: [constitution, spec, plan, tasks]
    task_count: 16
    loops_or_phases: 3
  model: "unknown"
  helper_models: []
  harness: "Codex"
  harness_version: "unknown"
  mcp_servers: [unified-computer-use]
  rag_and_sources: ["StarterKit/SPEC.md", "StarterKit/CONSTITUTION.md", "RFC 1812 section 4.2.3.1", "RFC 3021 section 2.1"]
  skills_and_plugins: ["Repository Spec Kit skills"]
  other_tools: ["Python 3 built-in HTTP server"]
  human_prompts: unknown
  usage:
    input_tokens: unknown
    output_tokens: unknown
    cost_note: "unknown"
  ai_generated_assets: []

runtime:
  kind: "static-web"
  stack: [HTML, CSS, "native JavaScript modules"]
  start: "python3 -m http.server 8000 --bind 127.0.0.1"
  url_after_start: "http://127.0.0.1:8000"
  hosted_url: ""
  static_root: "."
  requires_install: false
  requires_network: false
  requires_api_key: false
  uses_ai_at_runtime: false
  browsers: ["Google Chrome (version unknown)"]
  accessibility: "Confirmed the briefing and Round 1 load in Chrome. Keyboard, screen reader, reduced-motion, and narrow-window behavior have not been verified."
  save_state: "In memory only; reloading starts a new session."

verification:
  tests: "Not run; no automated test suite is present."
  tests_passing: 0
  facts_sourced_from: ["RFC 1812 section 4.2.3.1", "RFC 3021 section 2.1"]
  known_limits: ["Supports ordinary IPv4 host ranges from /8 through /30; /31 and /32 are excluded", "Progress is not saved after reload", "Keyboard, screen reader, reduced-motion, and narrow-window behavior have not been verified"]
---

## In one paragraph

Subnet Sashimi is a small educational browser game for people learning IPv4 subnetting. Players catch fish labeled with octet values and assemble a valid host address for the displayed subnet. An opening single-octet round leads into full-address rounds with prefixes from `/8` through `/30`. Explanations, a hint, retries, and a worked answer help players practice at their own pace.

## How it was built

Work began by shaping the pitch into a constitution and specification, followed by a plan, data model, research notes, quickstart, and implementation tasks. The scope changed several times: the initial short MVP became a two-round opening progression followed by endless full-address challenges. The player also clarified how fishing should work, how Show Answer locks a challenge, and how scoring and the answer range should be presented. The game was implemented as a static page with native JavaScript modules and locally generated challenges. During iteration, the start action, fish removal, fish motion, direction, basket, and sashimi/release effects were adjusted. The old two-round summary screen also conflicted with the endless design, so that end state was removed. The code and documents describe the intended behavior, but a browser playthrough and automated checks have not been recorded. The next builder should verify the actual game in a browser before claiming the endless progression or accessibility behavior is confirmed.

## What we'd tell the next builder

- Keep grading based on subnet boundaries, not the example address used to generate a challenge.
- Preserve the first two rounds as onboarding, then continue with full-address `/8`–`/30` rounds without a final screen.
- Verify pointer, keyboard, reduced-motion, and narrow-window behavior in a real browser and record the results.
