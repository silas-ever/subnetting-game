# Quickstart · Subnet Sashimi

This guide describes the planned end-to-end validation flow. Run commands become actionable after implementation creates the referenced files.

## Prerequisites

- A modern browser with JavaScript modules enabled.
- Python 3, or the platform equivalent `py` on Windows.

## Run locally

From the repository root, after `index.html` exists:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Use the server rather than `file://` so native modules and local data load correctly.

## Verify the core flow

1. Start a fresh session and read the subnet-range briefing.
2. Confirm tier one displays a `/8`–`/15` subnet and one missing octet.
3. Fish for an octet, submit a valid host address, and confirm the explanation advances to tier two.
4. Submit a network, broadcast, or outside-subnet address in tier two; confirm the fish release and specific feedback, with progress unchanged.
5. Confirm **Show Answer** is available after the first wrong submission. Select it; verify a valid address and explanation appear, assistance is recorded, submissions are locked, and Continue advances to the next round.
6. Submit any valid host address; confirm the success overlay blocks the challenge until Continue.
7. Continue into round three; verify the full-address challenge uses a prefix from `/8` through `/30`. Repeat for additional rounds.
8. Verify the score rises by 10 on a correct answer and is unchanged by a wrong answer or Show Answer.
9. Verify Show Answer displays the valid example plus the inclusive acceptable host range.
10. Restart and cancel once to confirm progress is preserved; restart again and confirm a fresh session.
11. Repeat the core actions with keyboard controls and reduced motion enabled.

## Automated checks

After implementation, open `http://127.0.0.1:8000/tests/` and verify the runner reports passing IPv4, generation, and state checks with no failures and a nonzero number of discovered checks. Independently inspect the expected values recorded in the spec; do not derive expected values by calling the evaluator under test.

## Expected boundary examples

- `10.37.0.1` is accepted in `10.0.0.0/8`.
- `192.168.1.42` is accepted in `192.168.1.0/24`.
- `192.168.1.0` and `192.168.1.255` are rejected in that `/24` as network and directed broadcast addresses.
- `192.168.2.42` is rejected in that `/24` as outside the subnet.
- A `/30` challenge offers a valid host address between its network and broadcast addresses.
