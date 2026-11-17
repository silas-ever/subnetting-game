# Subnet Sashimi · Implementation tasks

## Loop 1 · Prove subnet rules and generate challenges

- [x] T001 Create root `index.html`, `style.css`, and `main.js` shell using native modules.
- [x] T002 Implement IPv4 parsing, prefix masks, network/broadcast calculation, and host evaluation in `engine/ipv4.js`.
- [x] T003 Implement reproducible random generation for `/8`–`/15` and `/16`–`/24` challenges in `engine/generate.js`.
- [x] T004 Ensure generated fish include distractors and continue to supply octets that can form a valid answer in `engine/generate.js`.

## Loop 2 · Complete the fishing game loop

- [x] T005 Implement tier progression, attempts, hints, Show Answer assistance, restart, and completion state in `engine/state.js`.
- [x] T006 Implement challenge rendering, address slots, summary, and accessible feedback in `ui/render.js`.
- [x] T007 Implement pointer fishing, reeling, fish lifecycle, and keyboard-equivalent controls in `ui/fishing.js`.
- [x] T008 Connect briefing, generated challenges, submit evaluation, wrong-answer retry, Show Answer, and session summary in `main.js`.

## Loop 3 · Polish and align with the spec

- [x] T009 Apply the minimalist, cute lake aesthetic and responsive styles in `style.css`.
- [x] T010 Add reduced-motion behavior, visible focus, screen-reader announcements, and labeled controls in `index.html`, `style.css`, and `ui/render.js`.
- [x] T011 Update root `README.md` with run instructions and current implementation status.
- [x] T012 Review implementation against `StarterKit/SPEC.md`, `StarterKit/CONSTITUTION.md`, and `StarterKit/PLAN.md`; fix discrepancies in affected files.

## Follow-up · Basket and caught-fish interaction

- [x] T013 Use inline fish silhouettes, present the address slots in a woven fish basket, allow caught octets to be removed, and preserve other fish DOM nodes and swim positions when catching or spawning in `ui/render.js`, `main.js`, `engine/generate.js`, and `style.css`.
- [x] T014 Rename the game to Subnet Sashimi and animate caught fish into sashimi on correct submissions and back into the lake on incorrect submissions in `index.html`, `ui/render.js`, `main.js`, `style.css`, `README.md`, and StarterKit docs.
