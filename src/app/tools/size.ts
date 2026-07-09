const units = [
  'bytes',
  'KiB',
  'MiB',
  'GiB',
  'TiB'
]

export function bytes(orig: number) {
  let l = 0;

  while (orig >= 1024 && ++l) {
    orig /= 1024;
  }

  return (orig.toFixed(orig < 10 && l > 0 ? 2 : 0) + ' ' + units[l]);
}
