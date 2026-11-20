# Subnet Sashimi · Project constitution

**Purpose:** help people learning the basics of IPv4 subnetting practice finding valid host addresses through an interactive fishing game.

**First release:** one fishing mechanic and an endless sequence of generated browser challenges. The first challenge is a single-octet warm-up; the second uses a full address with `/16`–`/24`; later full-address challenges randomly use `/8`–`/30`. The player can stop at any time. Change this scope only by updating the agreed specification.

## C1 · Technical truth is a release requirement

The game must never reward a technically incorrect answer. Grading must be reproducible from the generated challenge inputs and documented rules. Unsupported or ambiguous content is an authoring or generation error: show that the challenge is unavailable and prevent grading it.

Teach ordinary IPv4 subnet host ranges for prefixes `/8` through `/30`. The network address and directed broadcast address are not valid host addresses. `/31` point-to-point links and `/32` host routes are outside the first release. State this model in the briefing and README wherever it affects what the player can conclude. Fiction and animation may illustrate a rule; they must not change it.

Generate a subnet and a valid host address first, then construct the challenge around them. For a one-octet challenge, hide one octet of a valid address. For a full-address challenge, hide all four octets. Fish values may be random distractors, but the game must keep supplying fish that can complete a valid answer. Accept any address that satisfies the stated subnet rule, not only the address initially used to construct the challenge.

**Evidence:** hand-check correct, incorrect, and boundary cases across the supported prefix range; cite a source and section for each networking rule; review generated challenges and explanations. Expected results are recorded independently of the implementation under test.

## C2 · Every round teaches through a decision

The player's main action must exercise the target skill. Introduce the method before testing it and show the subnet and prefix needed to reason about the answer. A wrong answer explains why the submitted address is outside the valid host range and lets the player try again. A correct answer explains why it works.

Use a sequential opening progression: round one uses `/8` through `/15` with one octet missing; round two uses `/16` through `/24` with the full address missing; round three onward uses the full address with a random prefix from `/8` through `/30`. A correct submission opens the sashimi overlay; Continue advances to the next round. After a wrong submission, Show Answer reveals a valid address and locks the challenge until Continue; this is recorded as assistance, not independent mastery. Hints reveal a method first, then a worked step.

**Evidence:** a teammate can connect each player action to a learning outcome and describe what they learned from a deliberately wrong choice.

## C3 · Progress is honest and retry is safe

A challenge advances after a valid, correct submission followed by Continue, or after the player chooses Show Answer and then Continue. Assisted advances are recorded separately from correct submissions. Incorrect answers keep the challenge available. Empty or malformed submissions give input guidance without counting as a wrong attempt. Repeated Submit actions cannot award progress twice.

Award 10 points for each correct answer. Wrong answers and assistance do not change the score. No lives, countdown, or speed bonus in this first version. Hints and retries have no penalty. Show rounds advanced, attempts, assistance, and score separately; continued play is not proof of independent mastery. A correct answer locks the challenge until Continue. Show Answer also locks the challenge and records assistance; Continue advances without accepting another submission. The player may stop or restart at any point.

**Evidence:** wrong-answer, repeated-submit, hint, completion, and reset checks match the specification.

## C4 · Access is part of the core game

All core actions must be usable by keyboard with visible focus, readable labels, and an understandable order. Explain success and failure with text as well as color. Provide a text equivalent for essential diagrams. Respect reduced-motion preferences; animation must never delay the availability of feedback or controls.

Keep the challenge usable on a typical laptop and a narrow browser window. Dense technical data may scroll within its own labeled container, without hiding the action buttons.

**Evidence:** a keyboard-only playthrough, a narrow-window check, and a reduced-motion check. Record what was actually checked; do not claim full accessibility certification.

## C5 · The first version is deterministic and self-contained

The game requires no account, backend, live device connection, model, or API key. Challenge generation and grading run locally. Random selection may vary the prefix, subnet, and fish values, but the rules and expected answer set must be reproducible from the generated challenge data. AI may help write code and assets during development; its output receives the same review as any other contribution.

Runtime AI tutoring, generated questions from an external service, and free-text AI grading are stretch work. Adding them requires an explicit change to the constitution, specification, and verification approach before implementation.

**Evidence:** a clean browser session can play using only the project's static files; no external content service decides an answer.

## C6 · Content and logic can be reviewed separately

Keep subnet generation, grading rules, level progression, and rendering separate. Validate generated challenges before presenting them. Feedback must agree with the evaluator's reasoning. Adding another supported prefix or fish distractor must not create a separate scoring path or screen implementation.

**Evidence:** trace one generated answer through the evaluator and add a trial challenge without modifying the rule engine.

## C7 · Done is demonstrated

Ship only the agreed scope. Requirements, plan, tasks, and README must describe the same game. A feature is complete when its acceptance criteria pass and its actual status is recorded. A screenshot, a checked task box, or the agent saying “done” is insufficient by itself.

When time is short, reduce scope explicitly. Fix incorrect teaching and broken core interactions before adding visual effects. Keep failed and untested checks visible.

**Evidence:** reproducible run/test commands, recorded verification results, a fresh-start playthrough, and a README another attendee can follow.

## How we change these rules

For any material change, record the reason, update the affected spec and plan, and rerun analysis. A conflict with this constitution is resolved openly; the build agent must not weaken a principle merely to make its implementation pass.
