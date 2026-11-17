# Research notes · Subnet Fishing

## Decision: generate within the stated IPv4 prefix range

Generate prefixes `/8`–`/15` for tier one and `/16`–`/24` for tier two. Generate an aligned network address, derive its broadcast address, and select an example host strictly between those endpoints. Reject any generated challenge that fails these invariants.

**Rationale:** The spec requires random challenge variety while keeping grading rule-based and reproducible. Generating a valid example before hiding it guarantees the challenge starts from sound content; the evaluator still accepts any valid host.

**Alternatives considered:** Hand-author a fixed list of subnets (less variety); choose random octets without validation (can produce invalid or misleading challenges).

## Decision: use local seeded randomness

Use a small deterministic pseudo-random generator with an explicit session seed. Store the seed and generated challenge record for reproduction. Randomness selects challenge inputs and fish values only; it does not participate in evaluation.

**Rationale:** This satisfies random variation, offline use, and reproducible reports.

**Alternatives considered:** Browser `Math.random()` alone (cannot reproduce a reported session); external generation service (adds a runtime dependency and violates the constitution).

## Decision: use native browser technology

Use semantic HTML, CSS, and native JavaScript modules, served statically. Use DOM/CSS for the lake and fish unless a small SVG improves clarity.

**Rationale:** The game has no backend or heavy graphics requirement; native modules support a small self-contained build and accessible controls.

**Alternatives considered:** A framework or rendering library (extra setup and dependency without a demonstrated need).

## Source check

- [RFC 1812 §4.2.3.1](https://www.rfc-editor.org/rfc/rfc1812.html#section-4.2.3.1): source for the IPv4 network-prefix-directed broadcast convention.
- [RFC 3021 §2.1](https://www.rfc-editor.org/rfc/rfc3021.html#section-2.1): documents `/31` point-to-point behavior; `/31` and `/32` are excluded from this game's supported range.

The game uses the educational host-range model specified in the constitution: exclude the network address and directed broadcast address from assignable hosts for prefixes `/8`–`/24`.
