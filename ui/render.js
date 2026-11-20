import { formatIPv4 } from '../engine/ipv4.js';
import { answerString, acceptableRange } from '../engine/state.js';

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function feedbackText(session) {
  const result = session.feedback;
  if (!result) return '';
  if (result.status === 'correct') return `Nice catch! ${formatIPv4(result.address)} is a valid host in this subnet.`;
  if (result.status === 'invalid-input') return 'That address is incomplete or malformed. Catch the required octets and submit a four-octet IPv4 address.';
  if (result.status === 'content-error') return 'This challenge could not be checked. Restart the session to get a fresh challenge.';
  const address = formatIPv4(result.address || []);
  if (result.reasonCode === 'network-address') return `${address} is the network address. It identifies the subnet itself, so it cannot be used as a host.`;
  if (result.reasonCode === 'broadcast-address') return `${address} is the broadcast address. It reaches all hosts in this subnet, so it cannot be used as one host.`;
  return `${address} is outside this subnet. Check the prefix and valid host range, then try again.`;
}

function addressSlots(challenge, caught, turnToSashimi = false) {
  const values = challenge.visibleOctets.slice();
  challenge.hiddenOctets.forEach((octetIndex, index) => { values[octetIndex] = caught[index] ?? null; });
  return values.map((value, index) => {
    const hiddenSlot = challenge.hiddenOctets.indexOf(index);
    if (hiddenSlot >= 0 && value !== null) {
      if (turnToSashimi) return `<span class="octet caught-fish sashimi-transform" aria-label="Octet ${value}, sliced into sashimi">${fishIcon(value)}<span class="sashimi-pieces" aria-hidden="true"><i></i><i></i><i></i></span></span>`;
      return `<button class="octet caught-fish" data-remove-slot="${hiddenSlot}" aria-label="Remove octet ${value} from position ${index + 1}">${fishIcon(value)}</button>`;
    }
    return `<span class="octet ${challenge.hiddenOctets.includes(index) ? 'octet-blank' : ''}" aria-label="Octet ${index + 1}: ${value ?? 'empty'}">${value ?? '···'}</span>`;
  }).join('<span class="dot">.</span>');
}

function fishIcon(value) {
  return `<svg class="fish-icon" viewBox="0 0 112 64" aria-hidden="true" focusable="false"><g class="fish-shapes"><path class="fish-tail-shape" d="M20 32 3 17v30z"/><path class="fish-body-shape" d="M18 32c9-17 25-24 45-22 16 1 27 11 33 22-6 12-17 21-33 22-20 2-36-5-45-22Z"/><path class="fish-fin-shape" d="m45 13 9-10 12 11M48 51l9 10 11-11"/><path class="fish-gill-shape" d="M77 22c-7 6-7 14 0 20"/><circle class="fish-eye-shape" cx="87" cy="27" r="2.6"/></g><text class="fish-number" x="51" y="37" text-anchor="middle">${esc(value)}</text></svg>`;
}

function fishNodeMarkup(item) {
  const age = Math.max(0, (Date.now() - (item.bornAt ?? Date.now())) / 1000);
  const direction = item.x < 50 ? 'normal' : 'reverse';
  return `<button class="fish ${direction === 'reverse' ? 'swim-reverse' : ''}" data-fish="${esc(item.id)}" style="left:${item.x}%;top:${item.y}%;--swim-duration:${item.duration ?? 9}s;animation-delay:-${age}s;animation-direction:${direction}" aria-label="Fish with octet value ${item.octet}">${fishIcon(item.octet)}</button>`;
}

export function render(app, session, caught = [], fish = [], onAction = () => {}, releasedFish = []) {
  if (session.view === 'briefing') {
    app.innerHTML = `<section class="card intro"><div class="brand-mark">✿</div><p class="eyebrow">A little subnet practice</p><h1>Subnet Sashimi</h1><p>Find a valid host address in each subnet. Fish for the octets, reel them in, and submit when your address is ready.</p><div class="brief-box"><strong>Quick method</strong><ol><li>Use the prefix to find the subnet range.</li><li>The network and broadcast addresses are not host addresses.</li><li>Any address between them is a valid host for this game.</li></ol></div><button class="primary" data-action="start">Let's fish</button></section>`;
    app.querySelector('[data-action=start]').addEventListener('click', () => onAction('start'));
    return;
  }
  const challenge = session.challenge;
  const tierLabel = session.tier === 1 ? 'Warm-up · one octet' : session.tier === 2 ? 'Full address · practice' : 'Full address · endless';
  const feedback = session.view === 'feedback' && session.feedback?.status !== 'correct' ? `<section class="feedback try-again" role="status"><p>${esc(feedbackText(session))}</p><div class="feedback-actions"><button class="secondary" data-action="retry">Try again</button>${session.challengeWrongCount > 0 && !session.answerShown ? '<button class="text-button" data-action="show-answer">Show Answer</button>' : ''}</div></section>` : '';
  const hint = session.hintVisible ? '<p class="inline-hint" role="status">Find the subnet boundary from the prefix, then avoid the network and broadcast addresses.</p>' : '';
  const correct = session.feedback?.status === 'correct';
  const locked = correct || session.answerShown;
  const range = session.answerShown ? acceptableRange(session) : null;
  const celebration = correct ? `<div class="celebration-overlay"><section class="celebration" role="dialog" aria-modal="true" aria-labelledby="celebration-title"><p class="eyebrow">Round ${session.round} complete</p><h2 id="celebration-title">Fresh sashimi!</h2><div class="celebration-stage"><div class="celebration-fish">${fishIcon(session.feedback.address[3])}</div><div class="celebration-knife" aria-hidden="true"></div><div class="celebration-platter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div><p>${esc(feedbackText(session))}</p><button class="primary celebration-continue" data-action="next">Continue</button></section></div>` : session.answerShown ? `<div class="celebration-overlay"><section class="answer-dialog" role="dialog" aria-modal="true" aria-labelledby="answer-title"><p class="eyebrow">Answer revealed · assistance recorded</p><h2 id="answer-title">One valid host address</h2><p class="revealed-address">${esc(answerString(session))}</p><p>Any host in the inclusive range <strong>${range.first}–${range.last}</strong> is accepted for <strong>${formatIPv4(session.challenge.network)}/${session.challenge.prefix}</strong>.</p><button class="primary celebration-continue" data-action="next">Continue to next round</button></section></div>` : '';
  const releaseMarkup = releasedFish.map((item) => `<span class="released-fish" style="left:${item.x}%" aria-hidden="true">${fishIcon(item.octet)}<i class="release-ripple"></i></span>`).join('');
  app.innerHTML = `<header class="topbar" ${locked ? 'inert' : ''}><a class="wordmark" href="#" aria-label="Subnet Sashimi home">✿ Subnet Sashimi</a><span class="progress">Round ${session.round} · ${session.round - 1} advanced</span><span class="score" aria-label="Score ${session.score} points">${session.score} pts</span><button class="text-button restart-button" data-action="restart">Restart</button></header><section class="game-card" ${locked ? 'inert' : ''}><div class="challenge-head"><div><p class="eyebrow">${tierLabel}</p><h1>Catch a valid host</h1></div><div class="subnet-badge"><span>Subnet</span><strong>${formatIPv4(challenge.network)}/${challenge.prefix}</strong></div></div><p class="instruction">Fish for the missing octet${session.tier === 1 ? '' : 's'}. You can catch more than one fish, then submit the address.</p><div class="basket ${correct ? 'sashimi' : ''}" aria-label="Address basket"><div class="basket-handle" aria-hidden="true"></div><div class="address-board" aria-label="Address to complete">${addressSlots(challenge, caught, correct)}</div></div><div class="lake-wrap"><div class="shoreline" aria-hidden="true"></div><div class="sky-label">Move from the top, touch a fish, then return to reel it in</div><div class="fishing-line" aria-hidden="true"></div><div class="bobber" aria-hidden="true">●</div><div class="fish-layer">${fish.map(fishNodeMarkup).join('')}${releaseMarkup}</div><div class="lake-hint" aria-hidden="true">˚ ｡⋆</div></div><div class="action-row"><p class="caught-count">${caught.length} octet${caught.length === 1 ? '' : 's'} caught</p><button class="primary submit" data-action="submit" ${locked || caught.length < challenge.hiddenOctets.length ? 'disabled' : ''}>Submit address</button></div><div class="help-row"><button class="text-button" data-action="hint">Show a hint</button>${session.challengeWrongCount > 0 && !session.answerShown ? '<button class="text-button" data-action="show-answer">Show Answer</button>' : ''}<span>Attempts: ${session.attempts} · Assisted: ${session.assistedRounds}</span></div>${hint}<div id="live" class="sr-only" aria-live="polite"></div>${feedback}<details class="how-to"><summary>How to fish with a keyboard</summary><p>Use Tab to focus a fish. Press Enter or Space to catch it. Use the basket octet buttons to remove a caught fish.</p></details></section>${celebration}`;
  app.querySelector('[data-action=submit]').addEventListener('click', () => onAction('submit'));
  app.querySelector('[data-action=restart]').addEventListener('click', () => onAction('restart'));
  app.querySelectorAll('[data-fish]').forEach((button) => {
    button.addEventListener('click', () => onAction('catch', button.dataset.fish));
    button.addEventListener('animationend', () => onAction('fish-left', button.dataset.fish), { once: true });
  });
  app.querySelectorAll('[data-remove-slot]').forEach((button) => button.addEventListener('click', () => onAction('remove', Number(button.dataset.removeSlot))));
  app.querySelector('[data-action=hint]').addEventListener('click', () => onAction('hint'));
  app.querySelectorAll('[data-action=show-answer]').forEach((button) => button.addEventListener('click', () => onAction('show-answer')));
  app.querySelectorAll('[data-action=retry]').forEach((button) => button.addEventListener('click', () => onAction('retry')));
  app.querySelectorAll('[data-action=next]').forEach((button) => button.addEventListener('click', () => onAction('next')));
}

export function appendFish(app, item, onAction) {
  const layer = app.querySelector('.fish-layer');
  if (!layer) return;
  layer.insertAdjacentHTML('beforeend', fishNodeMarkup(item));
  const button = layer.querySelector(`[data-fish="${CSS.escape(item.id)}"]`);
  button?.addEventListener('click', () => onAction('catch', item.id));
  button?.addEventListener('animationend', () => onAction('fish-left', item.id), { once: true });
}

export function updateCaught(app, session, caught, onAction) {
  const board = app.querySelector('.address-board');
  if (board) {
    board.innerHTML = addressSlots(session.challenge, caught);
    board.querySelectorAll('[data-remove-slot]').forEach((button) => button.addEventListener('click', () => onAction('remove', Number(button.dataset.removeSlot))));
  }
  const count = app.querySelector('.caught-count');
  if (count) count.textContent = `${caught.length} octet${caught.length === 1 ? '' : 's'} caught`;
  const submit = app.querySelector('[data-action=submit]');
  if (submit) submit.disabled = caught.length < session.challenge.hiddenOctets.length;
}
