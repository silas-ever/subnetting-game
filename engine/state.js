import { generateChallenge } from './generate.js';
import { formatIPv4, isValidHost } from './ipv4.js';

export function createSession(seed = Date.now()) {
  return {
    seed: seed >>> 0,
    tier: 1,
    challenge: generateChallenge(1, seed),
    attempts: 0,
    challengeWrongCount: 0,
    assistanceUsed: false,
    view: 'briefing',
    feedback: null,
    answerShown: false,
  };
}

export function submitAnswer(session, octets) {
  if (session.view === 'summary' || session.view === 'briefing' || session.feedback?.status === 'correct') return { session, result: null };
  const result = isValidHost(octets, session.challenge);
  const next = { ...session, feedback: result };
  if (result.status === 'invalid-input' || result.status === 'content-error') {
    next.view = 'feedback';
    return { session: next, result };
  }
  next.attempts += 1;
  if (result.status === 'incorrect') next.challengeWrongCount += 1;
  next.view = 'feedback';
  return { session: next, result };
}

export function advanceAfterCorrect(session) {
  if (session.feedback?.status !== 'correct') return session;
  if (session.tier === 1) {
    return {
      ...session,
      tier: 2,
      challenge: generateChallenge(2, session.seed + 101),
      view: 'challenge',
      feedback: null,
      answerShown: false,
      challengeWrongCount: 0,
    };
  }
  return { ...session, view: 'summary' };
}

export function showAnswer(session) {
  if (session.challengeWrongCount < 1 || session.view === 'summary') return session;
  return { ...session, assistanceUsed: true, answerShown: true };
}

export function revealFeedback(session) {
  if (session.feedback?.status === 'correct') return advanceAfterCorrect(session);
  return { ...session, view: 'challenge', feedback: null };
}

export function answerString(session) {
  return formatIPv4(session.challenge.exampleHost);
}
