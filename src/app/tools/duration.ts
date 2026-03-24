export function duration(seconds: number) {
  const date = new Date(null);
  date.setSeconds(seconds);

  return date.getUTCMinutes() + ':' + date.getUTCSeconds();
}