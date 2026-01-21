
import { OKLCH } from '../types';

// Вспомогательные функции для конвертации Hex -> RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

// Конверсия OKLCH -> RGB -> Hex
export function oklchToHex(l: number, c: number, h: number): string {
  const hr = (h * Math.PI) / 180;
  const a = Math.cos(hr) * c;
  const b = Math.sin(hr) * c;

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l_c = l_ * l_ * l_;
  const m_c = m_ * m_ * m_;
  const s_c = s_ * s_ * s_;

  let r = +4.0767416621 * l_c - 3.3077115913 * m_c + 0.2309699292 * s_c;
  let g = -1.2684380046 * l_c + 2.6097574011 * m_c - 0.3413193965 * s_c;
  let b_ = -0.0041960863 * l_c - 0.7034186147 * m_c + 1.707614701 * s_c;

  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    const val = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(val * 255).toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b_)}`;
}

// Приблизительная конверсия RGB -> OKLCH
export function hexToOklch(hex: string): OKLCH {
  const { r, g, b } = hexToRgb(hex);
  
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073970037 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720404 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: Math.max(0, Math.min(1, L)), c: Math.max(0, Math.min(0.4, C)), h: H };
}

export function oklchToString(color: OKLCH): string {
  return `oklch(${(color.l * 100).toFixed(2)}% ${color.c.toFixed(3)} ${color.h.toFixed(2)})`;
}

// Парсинг строки oklch(L% C H) в объект OKLCH
export function parseOklchString(str: string): OKLCH {
  const match = str.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return { l: 0, c: 0, h: 0 };
  return {
    l: parseFloat(match[1]) / 100,
    c: parseFloat(match[2]),
    h: parseFloat(match[3])
  };
}

export function findLForContrast(targetContrast: number, bgL: number, hue: number, chroma: number, isDark: boolean): number {
  const step = 0.01;
  if (isDark) {
    let currentL = bgL;
    while (currentL <= 1) {
      const contrast = (currentL + 0.05) / (bgL + 0.05);
      if (contrast >= targetContrast) return currentL;
      currentL += step;
    }
    return 1;
  } else {
    let currentL = bgL;
    while (currentL >= 0) {
      const contrast = (bgL + 0.05) / (currentL + 0.05);
      if (contrast >= targetContrast) return currentL;
      currentL -= step;
    }
    return 0;
  }
}

export function getAccentL(bgL: number, isDark: boolean): number {
    return isDark ? 0.75 : 0.55;
}
