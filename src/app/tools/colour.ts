import { oklch } from 'culori';

export function rgbToOklch(r: number, g: number, b: number) {
  const result = oklch({ mode: 'rgb', r: r / 255, g: g / 255, b: b / 255 });

  const L = result.l ?? 0;
  const c = result.c ?? 0;
  const h = result.h ?? 0;

  const maxChroma = 0.4;
  const sat = Math.min(c / maxChroma, 1);

  return { l: ((L * 100) * 0.92) - 21, s: (sat * 158), h: Math.round(h) };
}

export function clampSat(sat: number) {
  if (sat > 4) return 4;

  return roundTwo(sat);
}

export function clampLit(lit: number, raiseMinimum = false) {
  if (raiseMinimum && lit < 0.5) lit = 0.5;

  return roundTwo(lit);
}

export function roundTwo(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function convertColour(values: [ number, number, number, number ]) {
  const [ r, g, b, a ] = values;

  const converted = rgbToOklch(r, g, b);

  const h = converted.h;
  const s = clampSat((converted.s / 100) * 3);
  const l = clampLit(converted.l / 100 + 0.45);

  return {
    h,
    s,
    l
  }
}