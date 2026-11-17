# Subnet Fishing · Implementation plan

## Build target

Implement the two-tier subnet fishing game in the browser. Deliver a complete loop from briefing through two generated challenges, retry, feedback, and session summary. A tier-one challenge uses a prefix from `/8`–`/15` and hides one octet. Tier two uses `/16`–`/24` and hides the full address.

**Hardest behavior to get right:** generate valid subnet challenges and fish streams while grading any valid host address for the displayed subnet, rather than checking against one hidden answer.

**First evidence to establish:** independently verify that `10.37.0.1` is accepted for `10.0.0.0/8`, while `192.168.1.0` and `192.168.1.255` are rejected as network and broadcast addresses for `192.168.1.0/24`.

## Stack and serving

- Semantic HTML, CSS, and native JavaScript modules. No framework, bundler, backend, runtime model, or external rendering dependency.
- Use DOM and CSS for the lake, fish, fishing line, and address slots. SVG is optional for simple decorative elements if it stays accessible.
- Keep the game self-contained and suitable for static hosting, including a repository subpath. Use relative asset paths and case-correct filenames.
- Keep session state in memory. Reload starts a new session. No persistence in v1.
- Use a local seeded pseudo-random generator for challenge and fish generation. Record the seed and generated challenge data in session state so a reported run can be reproduced. Randomness may vary challenges; it must not vary grading rules.

Preview after implementation creates `index.html`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000**. On Windows use `py` instead of `python3`. Native modules need a web server; `file://` is not the supported run path.

## Proposed files and responsibilities

```text
index.html                   Semantic page shell and module entry point
style.css                    Layout, focus, feedback states, reduced motion
main.js                      Initialize, start, render errors
engine/
  ipv4.js                    Address parsing, masks, subnet/network/broadcast math
  generate.js                Seeded challenge and fish generation
  evaluate.js                Pure answer evaluation and reason codes
  state.js                   Tier progression, attempts, assistance, restart
  feedback.js                Explain evaluation results from structured evidence
ui/
  render.js                  Briefing, challenge, feedback, and summary views
  fishing.js                 Pointer and keyboard fishing interactions
data/
  content.js                 Briefing, hints, learning outcomes, sources
tests/
  index.html                 Dependency-free browser test runner
  ipv4.test.js               Independently checked subnet cases
  generate.test.js           Range, seed, valid-answer, and fish guarantees
  state.test.js              Attempts, assistance, progression, restart
README.md                    Run instructions, behavior, and verification record
```

Keep modules small enough to review; combine view files if separate files add no value. Do not add a backend or external dependency.

## Challenge and fish data contract

Each generated challenge is an immutable record containing:

| Field | Type and rule |
| --- | --- |
| `id` | Stable session-local identifier. |
| `seed` | Integer seed used to reproduce generated content. |
| `tier` | `1` or `2`. |
| `prefix` | Integer `8`–`15` for tier 1; `16`–`24` for tier 2. |
| `networkAddress` | Canonical IPv4 network address as four octets. |
| `broadcastAddress` | Directed broadcast address for the prefix. |
| `displayAddress` | Tier 1: valid generated host address with exactly one octet hidden. Tier 2: four blank octets. |
| `hiddenOctets` | One index from `0`–`3` in tier 1; all four indices in tier 2. |
| `exampleHostAddress` | Generated valid host address used to construct the challenge, not the sole accepted answer. |
| `fish` | Ordered stream records with stable ID, integer octet `0`–`255`, and visible position/state. Include distractors and continue producing values that can form a valid answer. |

Use unsigned 32-bit IPv4 arithmetic carefully; JavaScript bitwise operations are signed. A simple implementation may parse to a safe integer and use arithmetic division/modulo or normalize bitwise results with unsigned conversion. Validate prefix ranges, octet bounds, and canonical network alignment before showing a challenge. Reject generated data if the network, broadcast, or example host is inconsistent.

Fish caught by the player are placed into the currently available blank slots in order. In tier one there is one slot. In tier two there are four slots ordered from first through fourth octet. The player may remove/reorder caught values before submitting; if the implementation chooses a simpler fixed order, the UI must make that order clear and still permit retry after a wrong submission.

## Domain evaluation contract

```text
evaluate(challenge, submittedOctets) → {
  status: "correct" | "incorrect" | "invalid-input" | "content-error",
  reasonCode: "valid-host" | "outside-subnet" | "network-address" |
              "broadcast-address" | "malformed-address" | "invalid-challenge",
  evidence: { address, prefix, networkAddress, broadcastAddress }
}
```

- Evaluation is pure: same challenge and answer yield the same result; no DOM, randomness, timer, or progress changes.
- Parse exactly four decimal octets, each from `0` through `255`.
- A correct answer belongs to the displayed subnet and is neither the network nor broadcast address. Any such host address is accepted.
- Check malformed/incomplete input before grading. Do not count it as an attempt.
- Generate only prefixes `/8`–`/24`. `/31` and `/32` are explicitly unsupported.
- Feedback comes from the result's reason code and evidence. Do not select correctness by fish identity, answer position, animation, or the generated example address.
- Expected results in the browser checks are written independently from the evaluator.

**Feedback examples:** `192.168.1.255` for `192.168.1.0/24` is rejected because all host bits are one, making it the directed broadcast address. `192.168.1.42` is accepted because it is within the subnet and differs from both boundary addresses.

## Session transitions

```text
loading → briefing → tier-1 challenge
  invalid input → guidance → same challenge
  incorrect → release all caught fish → same challenge
  correct → explanation → tier-2 challenge
tier-2 challenge
  invalid input → guidance → same challenge
  incorrect → release all caught fish → same challenge
  correct → explanation → session summary
confirmed restart → fresh briefing and new session seed
```

Count each well-formed submitted address once as an attempt while the challenge is unsolved. Hints and fishing do not count as attempts. Wrong answers give specific feedback and allow unlimited retries. After the first wrong submission, enable **Show Answer**; selecting it displays a valid address and explanation and records assistance. Revealing a solution does not complete a tier: the learner must still submit a valid address. Disable Submit after success and guard progression in state logic. A correct answer advances once. Restart asks for confirmation; cancellation changes nothing. If challenge generation fails validation, show a recoverable error and never grade it.

## Constitution check

| Principle | Plan response |
| --- | --- |
| C1 · Technical truth | Pure IPv4 evaluator, source-backed host-range model, independently checked boundaries, unsupported prefix rejection. |
| C2 · Learning decision | Two tiers, briefing before play, specific explanations, hints and worked solution recorded as assistance. |
| C3 · Honest progress | Correct-only advancement, unlimited retry, malformed input excluded from attempts, duplicate-submit guard, explicit session reset. |
| C4 · Access | Keyboard equivalent for fishing, visible focus, text feedback, reduced-motion behavior, narrow-window layout. |
| C5 · Self-contained | Native modules, local seeded generation, static hosting, no runtime service. |
| C6 · Separable content and logic | IPv4, generation, evaluation, state, and rendering separated; challenges validated before display. |
| C7 · Demonstrated done | Acceptance checks and manual playthrough evidence recorded in README. |

**Gate:** Pass, contingent on generated challenge validation and accepted answers being computed from subnet rules rather than the generation example.

## Interaction and visual direction

Use a minimalist, cute visual style: a calm uncluttered lake, friendly fish, simple expressive animation, and a small color palette. Keep subnet and address values high-contrast and easy to read. The fishing line follows the pointer; touching a fish hooks it, and returning to the top reels it in. Provide equivalent keyboard controls and do not make precision motion necessary. Correct submissions get a short sashimi animation; incorrect submissions release all caught fish. Under reduced motion, replace movement with immediate state changes and retain the same textual feedback.

Always show the subnet/prefix, blank address slots, caught octets in order, Submit, hint/help controls, and tier progress. Use semantic buttons, labels, a live region for result feedback, and deliberate focus movement after state changes.

## Implementation order

| Slice | Deliverable | Evidence before the next slice |
| --- | --- | --- |
| 1 · Prove IPv4 rules | Address parsing, prefix math, network/broadcast calculation, evaluator | Independently reviewed correct, network, broadcast, outside-subnet cases. |
| 2 · Generate safe challenges | Seeded prefix/subnet/host generation and fish stream | Every supported prefix produces aligned subnet boundaries and at least one valid answer stream; same seed reproduces the same challenge. |
| 3 · Complete the core loop | Briefing, tier 1, fishing, submit, feedback, retry, tier 2, summary | Browser playthrough completes both tiers; wrong answers retry without progress. |
| 4 · Make it accessible and polished | Keyboard interaction, reduced motion, responsive layout, minimalist cute art direction | Keyboard-only and narrow-window manual checks; feedback remains understandable without animation. |
| 5 · Package and document | README, source notes, run instructions, verification record | Another attendee can start a fresh session and explain how a valid host is determined. |

Generate `tasks.md` from these slices and the acceptance criteria. Do not create a large task tree for stretch features.

## Verification and reporting

Use a dependency-free browser test runner at `tests/index.html` that imports the pure modules and shows pass/fail totals. Cover all required boundaries and representative prefixes from both tiers. The runner must report zero discovered checks as failure.

| Check | What must be established |
| --- | --- |
| IPv4 evaluator | Correct host, network address, broadcast address, malformed input, and outside-subnet outcomes. |
| Prefix coverage | `/8`, `/15`, `/16`, `/23`, and `/24` plus generated cases spanning each tier. |
| Generator | Canonical network, distinct network/broadcast, valid example host, correct hidden slots, valid fish availability, seed reproducibility. |
| State | Unlimited retries, Show Answer availability after first error, assistance, correct-only advancement, duplicate submission, summary, restart/cancel. |
| Source and teaching review | Briefing and generated feedback match cited IPv4 rules. |
| Browser interaction | Fresh start to summary; pointer and keyboard fishing; understandable feedback. |
| Access and layout | Keyboard-only core flow, visible focus, reduced motion, laptop and narrow viewport. |
| Hosting, if used | Relative assets and generated content work under a repository subpath. |

Record pass/fail/not-run with date, environment, and evidence in README or a linked verification note. Automated checks do not replace human review of teaching content or interaction.

## Scope controls

In scope: local procedural challenge and fish generation, two tiers, hints, retry, session summary, keyboard fishing, and the minimalist cute visual direction. Out of scope: persistence, multiplayer, runtime AI, external content services, IPv6, prefixes outside `/8`–`/24`, audio, and level editor. If time runs short, reduce scope explicitly in the spec and tasks; do not silently weaken correctness or hide skipped verification.
