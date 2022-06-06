export function getRandom16Id() {
  return (Math.random().toString(36) + "00000000000000000").slice(2, 16 + 2);
}
