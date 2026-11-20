# Subnet Sashimi · First playable specification

## The pitch

The learner fishes for IPv4 octets and builds a valid host address in a displayed subnet. Correct addresses are celebrated as sashimi; incorrect submissions release all caught fish.

## Who this is for

- **Learner:** People interested in learning or practicing IPv4 subnetting.
- **Assumed knowledge:** Familiarity with IPv4 dotted-decimal addresses and the idea of a subnet. The briefing teaches how a CIDR prefix determines a subnet's address range.
- **What the briefing teaches:** Read a prefix, find the network and broadcast addresses, and identify the valid host range.
- **Why interaction helps:** The player tests a calculated address against competing fish values and sees the result.
- **Session target:** Open-ended, with no time limit. A player can stop after any round.

## Learning outcomes and evidence

| ID | After playing, the learner can… | The game asks them to… | Evidence of success |
| --- | --- | --- | --- |
| LO1 | Identify a missing octet that completes a valid host address in a `/8`–`/15` subnet. | Fish for one missing octet and submit the address. | The address is within the valid host range. |
| LO2 | Calculate a valid host address in a `/16`–`/30` subnet. | Fish for all four octets and submit the address. | The address belongs to the subnet and is neither its network nor broadcast address. |

## The technical model

- **Rule being taught:** A valid answer is any IPv4 address in the displayed subnet other than its network address or directed broadcast address.
- **Context:** Ordinary IPv4 subnetting with CIDR prefixes from `/8` through `/30`.
- **Assumptions:** The challenge displays the subnet address and prefix. The player is constructing a host address for that subnet.
- **Excluded behavior:** `/31` point-to-point links, `/32` host routes, multicast, special-purpose address rules, routing, address assignment policy, and vendor-specific behavior are not modeled.
- **Authoritative references:** [RFC 1812, section 4.2.3.1](https://www.rfc-editor.org/rfc/rfc1812.html#section-4.2.3.1) describes network-prefix-directed broadcast addresses; [RFC 3021, section 2.1](https://www.rfc-editor.org/rfc/rfc3021.html#section-2.1) documents the special `/31` behavior excluded here.

The briefing explains the common teaching model: the all-zero host part identifies the subnet and the all-one host part is its directed broadcast. Both are excluded from host answers. `/31` and `/32` exceptions are outside the game model.

## The repeatable game loop

1. **Brief:** Explain the host-range method with a worked example not used in the current challenge.
2. **Inspect:** Show the subnet, prefix, and address slots. Round one has one blank octet; every later round has four.
3. **Fish:** The player moves the pointer from the top of the play area; a fishing line follows it. Touching a fish hooks it. The player returns the pointer to the top to reel it in. Keyboard controls provide an equivalent.
4. **Build:** Reeled-in fish contribute their values to the blank octet or address slots. The player may keep fishing until ready to submit.
5. **Submit:** Validate the assembled address. Empty or malformed answers give guidance and do not count as attempts. A wrong answer releases all caught fish, explains the specific error, and leaves the challenge active for unlimited retries. After the first wrong answer, show a **Show Answer** button. Selecting it reveals one valid address and the inclusive host range with an explanation, records assistance, and locks the challenge. The player can review it without a timer, then press Continue to advance. A correct submission adds 10 points, opens the sashimi overlay, explains why the address is valid, and locks the challenge until Continue.
6. **Continue:** Advance to the next round. The sequence has no final round; the player can stop at any time.

**Worked interaction:** The player sees `192.168.1.0/24` and is asked to build a valid host address. They catch fish labeled `192`, `168`, `1`, and `255`, then submit `192.168.1.255`. The fish are released; feedback explains that `.255` is the broadcast address for this `/24`. The player retries with `.42`; the game accepts `192.168.1.42` and explains that it lies between network `.0` and broadcast `.255`.

## Required stories and acceptance criteria

### US1 · Make and understand a subnetting decision — P1

As a learner, I want to apply the host-range rule to visible subnet information and understand the result.

- **AC1:** A fresh session begins with a short briefing before the first challenge.
- **AC2:** Tier one selects a prefix from `/8` through `/15`, generates a valid address in its subnet, hides exactly one octet, and accepts any address valid for the displayed subnet.
- **AC3:** Round two selects a prefix from `/16` through `/24`, generates a valid address in its subnet, hides all four octets, and accepts any address valid for the displayed subnet. Each later round selects any prefix from `/8` through `/30`, generates a valid address in its subnet, hides all four octets, and accepts any valid host address.
- **AC4:** Each challenge shows the subnet and prefix. A correct submission opens a large sashimi celebration overlay with an explanation and a Continue action. The challenge underneath becomes inactive; further fishing, editing, and submission are blocked until the player continues.
- **AC5:** Any wrong, well-formed address triggers the release animation and identifies whether it is outside the subnet or is the network/broadcast address. Progress remains unchanged and unlimited retry is available.
- **AC6:** After the first wrong submission, a **Show Answer** button becomes available. Selecting it displays a valid address and explanation, records assistance, and locks the current challenge. The player can review it without a timer, then choose Continue to advance; no further answer submission is accepted for that challenge.
- **AC7:** Empty or malformed input gives actionable guidance and does not count as an attempt or change progress.

### US2 · Fish, track progress, and continue — P1

As a learner, I want to catch candidate octets, submit when ready, and see clear progress.

- **AC8:** Fish display integer octet values from `0` through `255`. They swim across the lake or leave the visible area. New fish continue to appear until submission or Show Answer.
- **AC9:** Fish values include random distractors and keep supplying values that can complete a valid answer. Where multiple octet values can lead to valid addresses, multiple correct options appear over the challenge.
- **AC10:** The player catches fish by moving down from the top toward a fish and returning to the top to reel it in. Fishing, Submit, hint, and advance actions are keyboard accessible.
- **AC11:** A correct submission opens the sashimi overlay and locks the challenge until Continue; Continue advances to the next round. Choosing Continue after Show Answer also advances, marked as assisted rather than correct. Rounds continue without a final cap or summary; after round two, each new challenge uses a random prefix from `/8` through `/30` and requires a full address. Repeated submission cannot award progress twice.
- **AC12:** Each correct submission adds 10 points to the persistent in-session score. Wrong submissions and Show Answer do not change the score. Show Answer displays one valid host address and the inclusive acceptable host range (`network + 1` through `broadcast - 1`).
- **AC13:** Restart asks for confirmation; confirming clears the session and returns to the first briefing, while cancel preserves progress.

### US3 · Play accessibly — P1

As a keyboard or reduced-motion user, I want to operate the game and understand results without relying on precise pointer control, color, or animation.

- **AC14:** Core controls have accessible names, visible focus, and logical keyboard order. Keyboard users can select/reel fish, submit, request hints, and advance.
- **AC15:** Correct and incorrect feedback includes readable text and is announced to assistive technology. Reduced motion minimizes animation without losing information or delaying controls.
- **AC16:** The layout works on a typical laptop and narrow browser window. Essential subnet and address information remains visible or available through a labeled, accessible scroll region.

## Difficulty progression and generated challenges

| Rounds | Prefix range | Challenge | Advance condition |
| --- | --- | --- | --- |
| 1 | `/8`–`/15` | One octet is missing from a generated valid host address. | Correct submission or choose Continue after Show Answer. |
| 2 | `/16`–`/24` | The full four-octet address is missing. | Correct submission or choose Continue after Show Answer. |
| 3 onward | `/8`–`/30` | The full four-octet address is missing. | Correct submission or choose Continue after Show Answer. |

For each challenge, generate a prefix and subnet, calculate its network and broadcast addresses, and choose a valid host address. Round one hides one octet; all later rounds hide all four octets. The generated address is an example, not the only accepted answer. Accept every address satisfying the displayed subnet and host-range rule.

Fish values are generated as octets and may be distractors. Keep supplying fish that can form a valid answer, so random distractors never make a challenge impossible. Multiple combinations may be valid; feedback must follow the rule, not a hidden answer key. Generation and grading run locally and are reproducible from challenge data.

Progress, score, and assistance counts are session-only. Reload starts a new session. The game has no final round; the player can stop at any time. Each correct answer adds 10 points; wrong answers and assistance do not change the score. After the first wrong answer, **Show Answer** reveals one valid address and the inclusive host range, stops fish generation, locks that challenge, and offers Continue. A correct answer also locks the challenge until Continue. Report rounds advanced, attempts, assistance, and score separately.

## Cases the implementation must satisfy

Check expected results independently of the implementation. Add generated boundary cases across the supported prefixes before release.

| Case | Input state | Player action | Expected result | Why / source |
| --- | --- | --- | --- | --- |
| Tier-one correct | `10.0.0.0/8`; `10.___.0.1` | Submit `10.37.0.1` | Accept; complete tier one once | Host part is neither all zero nor all one; RFC 1812 §4.2.3.1 describes broadcast convention. |
| Tier-two correct | `192.168.1.0/24` | Submit `192.168.1.42` | Accept; complete tier two | In subnet, not network or broadcast. |
| Network mistake | `192.168.1.0/24` | Submit `192.168.1.0` | Reject; explain network address; release fish; progress unchanged | All host bits are zero. |
| Broadcast mistake | `192.168.1.0/24` | Submit `192.168.1.255` | Reject; explain directed broadcast; release fish; progress unchanged | All host bits are one; RFC 1812 §4.2.3.1. |
| Outside subnet | `192.168.1.0/24` | Submit `192.168.2.42` | Reject; explain it is outside the subnet; release fish | Prefix membership check. |
| Invalid generation | Challenge has no valid host answer or no fish can complete one | Open challenge | Do not grade; show content error and provide a valid replacement or stop safely | Generation invariant in C1 and C6. |
| Unsupported prefix | Data uses `/31` or `/7` | Open challenge | Reject as unsupported; do not grade or advance | Supported prefixes are `/8`–`/30`. |

## Experience direction

- **Aesthetic:** Minimalist and cute, with a calm, uncluttered lake scene, friendly fish, and simple expressive animation. Keep the subnet and address values easy to read.
- **Visual metaphor:** A calm lake where fish carry IPv4 octet values; the fishing line makes selecting a value feel like fishing.
- **Memorable moment:** On success, the caught fish visibly transform into sashimi in a large celebration overlay. On a wrong submission, all caught fish splash back into the lake with a specific explanation.
- **Always visible:** Subnet and prefix, address slots, caught octets in order, Submit, and current/completed round count.
- **Feedback voice:** Patient and specific; describe the submitted address and rule before offering a next step.
- **Layout:** Challenge first, fishing area and address assembly next, Submit and hints within reach, explanation beside or below. Do not hide technical values behind hover-only interactions.

## Non-goals

No accounts, multiplayer, backend, live infrastructure access, runtime AI, leaderboard, or level editor. No IPv6, `/31`–`/32`, multicast, routing behavior, or vendor-specific subnetting behavior. Visual polish must fit the fishing mechanic.

## Open decisions for clarify

No core scope decisions remain open. Implementation planning may choose generation distributions and presentation details if they preserve these rules and acceptance criteria.

## Release evidence

Record results for every acceptance criterion. Check correct, incorrect, network, broadcast, and outside-subnet answers at representative prefixes across `/8`–`/30`, including `/30`. A teammate must complete the core flow using only the keyboard. The README must describe implemented behavior, exact run/test commands, and remaining limits.
