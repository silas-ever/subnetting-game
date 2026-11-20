import { generateChallenge } from './generate.js';
import { formatIPv4, fromNumber, isValidHost } from './ipv4.js';

export function createSession(seed = Date.now()) {
  return {
    seed: seed >>> 0,
    tier: 1,
    round: 1,
    challenge: generateChallenge(1, seed),
    attempts: 0,
    score: 0,
    assistedRounds: 0,
    challengeWrongCount: 0,
    assistanceUsed: false,
    view: 'briefing',
    feedback: null,
    answerShown: false,
  };
}

export function submitAnswer(session, octets) {
  if (session.view === 'briefing' || session.feedback?.status === 'correct' || session.answerShown) return { session, result: null };
  const result = isValidHost(octets, session.challenge);
  const next = { ...session, feedback: result };
  if (result.status === 'invalid-input' || result.status === 'content-error') {
    next.view = 'feedback';
    return { session: next, result };
  }
  next.attempts += 1;
  if (result.status === 'incorrect') next.challengeWrongCount += 1;
  if (result.status === 'correct') next.score += 10;
  next.view = 'feedback';
  return { session: next, result };
}

export function advanceAfterCorrect(session) {
  if (session.feedback?.status !== 'correct' && !session.answerShown) return session;
  const nextRound = session.round + 1;
  // Rounds 1 and 2 introduce the game; every later round stays in the endless tier.
  const nextTier = nextRound === 1 ? 1 : nextRound === 2 ? 2 : 3;
  return {
    ...session,
    tier: nextTier,
    round: nextRound,
    challenge: generateChallenge(nextTier, session.seed + nextRound * 101),
    view: 'challenge',
    feedback: null,
    answerShown: false,
    challengeWrongCount: 0,
  };
}

export function showAnswer(session) {
  if (session.challengeWrongCount < 1) return session;
  if (session.answerShown) return session;
  return { ...session, assistanceUsed: true, assistedRounds: session.assistedRounds + 1, answerShown: true, feedback: null, view: 'challenge' };
}

export function revealFeedback(session) {
  if (session.feedback?.status === 'correct') return advanceAfterCorrect(session);
  return { ...session, view: 'challenge', feedback: null };
}

export function answerString(session) {
  return formatIPv4(session.challenge.exampleHost);
}

export function acceptableRange(session) {
  const challenge = session.challenge;
  return {
    first: formatIPv4(fromNumber(challenge.networkNumber + 1)),
    last: formatIPv4(fromNumber(challenge.networkNumber + (2 ** (32 - challenge.prefix)) - 2)),
  };
}
