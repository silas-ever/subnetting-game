# Data model · Subnet Sashimi

## Session

| Field | Type | Validation / behavior |
| --- | --- | --- |
| `seed` | Unsigned integer | Initializes deterministic generation; regenerated on restart. |
| `round` | Positive integer | Advances after a correct answer or Show Answer → Continue. Never capped. |
| `tier` | `1`, `2`, or `3` | Round 1 uses tier 1; round 2 uses tier 2; round 3 onward uses tier 3 generation. |
| `challenge` | Challenge record | Must validate before presentation. |
| `caughtOctets` | Integer array | Each value is 0–255; placement follows visible slot order. |
| `attempts` | Integer | Counts well-formed submissions while the challenge is unsolved. |
| `score` | Non-negative integer | Starts at zero; adds 10 for each correct answer; never decreases. |
| `assistedRounds` | Integer | Counts rounds advanced by choosing Show Answer and Continue. |
| `assistanceUsed` | Boolean or count | Records hint/worked solution use separately from correctness. |
| `wrongSubmissionCount` | Integer | Enables the Show Answer control after the first wrong answer. |
| `view` | State enum | `briefing`, `challenge`, `feedback`, `answer-overlay`, `success-overlay`, `error`. |

## Challenge

| Field | Type | Validation |
| --- | --- | --- |
| `id` | String | Unique within the session. |
| `seed` | Unsigned integer | Captured for replay/debugging. |
| `tier` | `1`, `2`, or `3` | Round 1: tier 1; round 2: tier 2; round 3 onward: tier 3. |
| `prefix` | Integer | 8–15 in round 1; 16–24 in round 2; 8–30 in round 3 onward. |
| `network` | Four octets or unsigned 32-bit number | Canonical, aligned to prefix. |
| `broadcast` | Four octets or unsigned 32-bit number | Derived from network and prefix. |
| `exampleHost` | Four octets or unsigned 32-bit number | Strictly inside network and broadcast. |
| `blankOctetIndices` | Integer array | Exactly one index 0–3 in round 1; all four indices in later rounds. |
| `visibleOctets` | Four slots | Round 1 has exactly one hidden slot; later rounds have all four hidden. Other visible values are 0–255. |

## Fish

| Field | Type | Validation |
| --- | --- | --- |
| `id` | String | Unique while active. |
| `octet` | Integer | 0–255. |
| `position` | Coordinate pair | Within the fish play area or marked as leaving. |
| `state` | Enum | `swimming`, `hooked`, `caught`, `leaving`. |

The fish generator supplies distractors and continues to supply octets capable of forming at least one accepted address. Fish identity is not part of grading.

## Evaluation result

`evaluate(challenge, answer)` returns `status`, `reasonCode`, and evidence containing the submitted address, prefix, network, and broadcast. Status is one of `correct`, `incorrect`, `invalid-input`, or `content-error`. Reasons distinguish valid host, outside subnet, network address, broadcast address, malformed address, and invalid challenge.

## State transitions

- `briefing` → tier-one challenge.
- Unsolved challenge + invalid input → guidance; no attempt increment.
- Unsolved challenge + well-formed incorrect answer → increment attempts; release caught fish; remain on challenge.
- Any incorrect answer → give specific reason feedback; remain on challenge for unlimited retries.
- First incorrect answer enables Show Answer. Selecting it reveals a valid address, stops fish generation, locks the challenge, and records assistance.
- The player may review the answer without a timer. Continue advances to the next round; further submissions to the locked challenge are rejected.
- Correct answer → blocking celebration overlay; Continue advances to the next round.
- Round 1 uses one missing octet; round 2 uses `/16`–`/24` with the full address; round 3 onward uses `/8`–`/30` with the full address.
- Confirmed restart → new seed and briefing; canceled restart preserves all state.
- Invalid generated challenge → error/recovery; never grade or advance.
