import { fromNumber, subnetBounds } from './ipv4.js';

export function createRandom(seed = Date.now()) {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

function choosePrivateNetwork(random, prefix) {
  const base = 10 * 2 ** 24;
  const bounds = subnetBounds(fromNumber(base), prefix);
  const blockSize = 2 ** (32 - prefix);
  const blockCount = 2 ** (prefix - 8);
  return bounds.network + randomInt(random, 0, blockCount - 1) * blockSize;
}

export function generateChallenge(tier, seed = Date.now()) {
  if (tier !== 1 && tier !== 2) throw new RangeError('Tier must be 1 or 2.');
  const random = createRandom(seed);
  const prefix = tier === 1 ? randomInt(random, 8, 15) : randomInt(random, 16, 24);
  const networkNumber = choosePrivateNetwork(random, prefix);
  const bounds = subnetBounds(fromNumber(networkNumber), prefix);
  const exampleNumber = randomInt(random, bounds.network + 1, bounds.broadcast - 1);
  const exampleHost = fromNumber(exampleNumber);
  const hiddenOctets = tier === 1 ? [randomInt(random, 0, 3)] : [0, 1, 2, 3];
  const visibleOctets = exampleHost.map((octet, index) => hiddenOctets.includes(index) ? null : octet);
  return {
    id: `${seed >>> 0}-${tier}`,
    seed: seed >>> 0,
    tier,
    prefix,
    network: fromNumber(bounds.network),
    networkNumber: bounds.network,
    broadcast: fromNumber(bounds.broadcast),
    exampleHost,
    hiddenOctets,
    visibleOctets,
    fishQueue: [],
    fishOrdinal: 0,
  };
}

export function nextFish(challenge, random = createRandom(challenge.seed + challenge.fishOrdinal + 1)) {
  const ordinal = challenge.fishOrdinal++;
  const isHelpful = ordinal % 2 === 0;
  const helpfulSlot = Math.floor(ordinal / 2) % challenge.hiddenOctets.length;
  const correctValue = challenge.exampleHost[challenge.hiddenOctets[helpfulSlot]];
  const lanes = [22, 41, 60, 79];
  return {
    id: `${challenge.id}-fish-${ordinal}`,
    ordinal,
    octet: isHelpful ? correctValue : Math.floor(random() * 256),
    x: ordinal % 2 ? 115 : -15,
    y: lanes[ordinal % lanes.length] + (random() * 3 - 1.5),
    duration: 8 + random() * 2,
    bornAt: Date.now(),
    state: 'swimming',
  };
}
