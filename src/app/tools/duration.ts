export function parseDuration(seconds: number) {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(seconds);

  return date.getUTCMinutes() + ':' + date.getUTCSeconds().toString().padStart(2, "0");
}
