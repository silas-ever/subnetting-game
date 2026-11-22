import { createSession, submitAnswer, advanceAfterCorrect, showAnswer, revealFeedback } from './engine/state.js';
import { nextFish, createRandom } from './engine/generate.js';
import { render, appendFish, updateCaught } from './ui/render.js';
import { bindFishing } from './ui/fishing.js';

const app = document.querySelector('#app');
let session = createSession();
let caught = [];
let fish = [];
let releasedFish = [];
let fishTimer;
let cleanupFishing = () => {};
let random = createRandom(session.seed ^ 0xa5a5a5a5);
let hintVisible = false;

function replenish() {
  if (session.view === 'briefing' || session.answerShown || session.feedback?.status === 'correct') return;
  // Stationary fish still refresh, but never disappear while keyboard-focused.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fish = fish.filter((item) => {
      const node = app.querySelector(`[data-fish="${CSS.escape(item.id)}"]`);
      if (Date.now() - item.bornAt < 12000 || node === document.activeElement) return true;
      node?.remove();
      return false;
    });
  }
  if (fish.length >= 12) return;
  const newFish = nextFish(session.challenge, random);
  newFish.slot = Array.from({ length: 12 }, (_, i) => i).find(i => !fish.some(item => item.slot === i));
  fish = [...fish, newFish];
  appendFish(app, newFish, action);
}

function startFishStream() {
  clearInterval(fishTimer);
  fish = [];
  caught = [];
  for (let i = 0; i < 4; i += 1) fish.push({ ...nextFish(session.challenge, random), slot: i });
  fishTimer = setInterval(replenish, 1800);
}

function paint() {
  cleanupFishing();
  render(app, { ...session, hintVisible }, caught, fish, action, releasedFish);
  cleanupFishing = bindFishing(app.querySelector('.lake-wrap'), (id) => action('catch', id));
  if (session.feedback?.status === 'correct' || session.answerShown) app.querySelector('.celebration-continue')?.focus();
}

function action(name, payload) {
  let patchOnly = false;
  if ((session.answerShown || session.feedback?.status === 'correct') && name !== 'next' && name !== 'restart') return;
  if (name === 'start') {
    session = { ...session, view: 'challenge' };
    startFishStream();
  } else if (name === 'catch') {
    if (session.feedback?.status === 'correct') return;
    const index = fish.findIndex((item) => item.id === payload);
    if (index >= 0 && caught.length < session.challenge.hiddenOctets.length) {
      const [caughtFish] = fish.splice(index, 1);
      caught = [...caught, caughtFish.octet];
      app.querySelector(`[data-fish="${CSS.escape(payload)}"]`)?.remove();
      patchOnly = true;
    }
  } else if (name === 'remove') {
    if (session.feedback?.status === 'correct') return;
    if (Number.isInteger(payload) && payload >= 0 && payload < caught.length) {
      caught = caught.filter((_, index) => index !== payload);
      patchOnly = true;
    }
  } else if (name === 'fish-left') {
    const node = app.querySelector(`[data-fish="${CSS.escape(payload)}"]`);
    if (node === document.activeElement) app.querySelector('[data-action=hint]')?.focus();
    node?.remove();
    fish = fish.filter((item) => item.id !== payload);
    setTimeout(replenish, 60);
    return;
  } else if (name === 'submit') {
    if (caught.length !== session.challenge.hiddenOctets.length) return;
    const address = session.challenge.visibleOctets.slice();
    session.challenge.hiddenOctets.forEach((index, position) => { address[index] = caught[position]; });
    const outcome = submitAnswer(session, address);
    session = outcome.session;
    hintVisible = false;
    if (outcome.result?.status === 'correct') clearInterval(fishTimer);
    else if (outcome.result?.status === 'incorrect') {
      releasedFish = caught.map((octet, index) => ({ octet, x: 12 + index * 21 }));
      caught = [];
      setTimeout(() => {
        releasedFish = [];
        app.querySelectorAll('.released-fish').forEach((node) => node.remove());
      }, 1200);
    }
  } else if (name === 'retry') {
    session = revealFeedback(session);
    caught = [];
    hintVisible = false;
  } else if (name === 'next') {
    session = advanceAfterCorrect(session);
    startFishStream();
  } else if (name === 'show-answer') {
    session = showAnswer(session);
    clearInterval(fishTimer);
  } else if (name === 'hint') {
    hintVisible = !hintVisible;
  } else if (name === 'restart') {
    if (window.confirm('Start a fresh fishing session? Current progress will be cleared.')) {
      session = createSession(Date.now());
      random = createRandom(session.seed ^ 0xa5a5a5a5);
      caught = [];
      fish = [];
      releasedFish = [];
      hintVisible = false;
      clearInterval(fishTimer);
    }
  }
  if (patchOnly) {
    updateCaught(app, session, caught, action);
    if (document.activeElement === document.body) {
      (app.querySelector('[data-action=submit]:not(:disabled)') || app.querySelector('[data-fish]'))?.focus({ preventScroll: true });
    }
  }
  else paint();
}

paint();
