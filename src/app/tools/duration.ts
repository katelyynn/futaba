export function parseDuration(seconds: number) {
  const date = new Date('');
  date.setSeconds(seconds);

  return date.getUTCMinutes() + ':' + date.getUTCSeconds().toString().padStart(2, "0");
}
