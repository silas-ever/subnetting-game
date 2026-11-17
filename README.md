# Subnet Sashimi

A small browser game for IPv4 subnet practice. Fish for octets, assemble a valid host address, and learn from the subnet and broadcast boundaries.

## Run locally

Use a local web server because the game uses native JavaScript modules:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. On Windows, use `py` instead of `python3`.

## How to play

1. Read the short host-range briefing.
2. In tier one, complete one missing octet for a `/8`–`/15` subnet.
3. In tier two, build a full address for a `/16`–`/24` subnet.
4. Move from the top of the lake toward a fish, then return to the top to reel it in. Keyboard users can focus and select fish.
5. Submit when the address is ready. Incorrect submissions release the caught fish and explain the issue. After the first wrong submission, **Show Answer** reveals a valid example and records assistance; it does not advance the tier.

The game accepts any IPv4 host address inside the displayed subnet except the network and directed broadcast addresses. `/31` and `/32` are outside the supported range. Challenges and fish values are generated locally; the game needs no account, network service, or API key.

## Project documents

- Game requirements: [StarterKit/SPEC.md](StarterKit/SPEC.md)
- Project principles: [StarterKit/CONSTITUTION.md](StarterKit/CONSTITUTION.md)
- Implementation plan: [StarterKit/PLAN.md](StarterKit/PLAN.md)
- Implementation tasks: [StarterKit/tasks.md](StarterKit/tasks.md)

## Current status

The first playable implementation is present. It has not yet been verified in a browser or with automated checks. Known accessibility and layout behavior should be checked during the release review.
