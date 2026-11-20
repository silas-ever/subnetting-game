export function parseIPv4(value) {
  if (typeof value !== 'string') return null;
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return null;
  const octets = parts.map(Number);
  return octets.every((octet) => octet >= 0 && octet <= 255) ? octets : null;
}

export function toNumber(octets) {
  if (!Array.isArray(octets) || octets.length !== 4 || octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return octets.reduce((value, octet) => value * 256 + octet, 0);
}

export function fromNumber(value) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 0xffffffff) return null;
  return [24, 16, 8, 0].map((shift) => Math.floor(value / (2 ** shift)) % 256);
}

export function formatIPv4(octets) {
  return Array.isArray(octets) && octets.length === 4 ? octets.join('.') : '';
}

export function subnetBounds(address, prefix) {
  const value = Array.isArray(address) ? toNumber(address) : toNumber(parseIPv4(address));
  if (value === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  const hostBits = 32 - prefix;
  const blockSize = 2 ** hostBits;
  const network = Math.floor(value / blockSize) * blockSize;
  return { network, broadcast: network + blockSize - 1, prefix };
}

export function isValidHost(address, challenge) {
  const octets = Array.isArray(address) ? address : parseIPv4(address);
  const value = toNumber(octets);
  if (value === null || !challenge || !Number.isInteger(challenge.prefix) || challenge.prefix < 8 || challenge.prefix > 30) {
    return { status: 'invalid-input', reasonCode: 'malformed-address' };
  }
  const bounds = subnetBounds(challenge.network, challenge.prefix);
  if (!bounds || bounds.network !== challenge.networkNumber) return { status: 'content-error', reasonCode: 'invalid-challenge' };
  if (value < bounds.network || value > bounds.broadcast) return { status: 'incorrect', reasonCode: 'outside-subnet', address: octets, ...bounds };
  if (value === bounds.network) return { status: 'incorrect', reasonCode: 'network-address', address: octets, ...bounds };
  if (value === bounds.broadcast) return { status: 'incorrect', reasonCode: 'broadcast-address', address: octets, ...bounds };
  return { status: 'correct', reasonCode: 'valid-host', address: octets, ...bounds };
}
