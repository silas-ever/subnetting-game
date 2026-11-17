# Data model · Subnet Fishing

## Session

| Field | Type | Validation / behavior |
| --- | --- | --- |
| `seed` | Unsigned integer | Initializes deterministic generation; regenerated on restart. |
| `tier` | `1` or `2` | Tier 1 advances to tier 2 after one correct answer. |
| `challenge` | Challenge record | Must validate before presentation. |
| `caughtOctets` | Integer array | Each value is 0–255; placement follows visible slot order. |
| `attempts` | Integer | Counts well-formed submissions while the challenge is unsolved. |
| `assistanceUsed` | Boolean or count | Records hint/worked solution use separately from correctness. |
| `wrongSubmissionCount` | Integer | Enables the Show Answer control after the first wrong answer. |
| `view` | State enum | `briefing`, `challenge`, `feedback`, `summary`, `error`. |

## Challenge

| Field | Type | Validation |
| --- | --- | --- |
| `id` | String | Unique within the session. |
| `seed` | Unsigned integer | Captured for replay/debugging. |
| `tier` | `1` or `2` | Consistent with prefix. |
| `prefix` | Integer | 8–15 for tier 1; 16–24 for tier 2. |
| `network` | Four octets or unsigned 32-bit number | Canonical, aligned to prefix. |
| `broadcast` | Four octets or unsigned 32-bit number | Derived from network and prefix. |
| `exampleHost` | Four octets or unsigned 32-bit number | Strictly inside network and broadcast. |
| `blankOctetIndices` | Integer array | Exactly one index 0–3 in tier 1; all four in tier 2. |
| `visibleOctets` | Four slots | Non-hidden slots contain values 0–255. |

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
- First incorrect answer enables Show Answer. Selecting it reveals a valid address and explanation and records assistance.
- Revealed answer does not complete the challenge. Only a valid submitted address advances the tier.
- Tier-one challenge + correct answer → explanation → tier-two challenge.
- Tier-two challenge + correct answer → explanation → summary.
- Confirmed restart → new seed and briefing; canceled restart preserves all state.
- Invalid generated challenge → error/recovery; never grade or advance.
