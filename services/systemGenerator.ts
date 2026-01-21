
import { AppState, DesignTokens } from '../types';
import { findLForContrast, oklchToString, getAccentL } from '../utils/colorMath';

export function generateSystem(state: AppState): DesignTokens {
  const { 
    baseHue, 
    baseChroma, 
    baseLightness, 
    baseRole, 
    mode, 
    typography, 
    gradientIntensity,
    useSecondaryHue,
    secondaryHue
  } = state;
  const isDark = mode === 'dark';

  let bgL: number;
  let bgC: number;
  let accentL: number;
  let accentC: number;

  if (baseRole === 'bg') {
    // Для темной темы базовый фон делаем глубоким, но не абсолютно черным
    bgL = isDark ? Math.min(baseLightness * 0.15, 0.10) : Math.max(baseLightness, 0.94);
    bgC = isDark ? Math.min(baseChroma * 0.5, 0.02) : Math.min(baseChroma, 0.03);
    
    accentL = getAccentL(bgL, isDark);
    accentC = Math.max(baseChroma, 0.18);
  } else {
    accentL = baseLightness;
    accentC = baseChroma;
    
    bgL = isDark ? 0.06 : 0.98;
    bgC = isDark ? 0.015 : 0.015;
  }

  const bgPrimary = { l: bgL, c: bgC, h: baseHue };
  
  // Увеличиваем шаги (delta) для темной темы, чтобы слои были различимы
  const baseDelta = isDark ? 0.07 : 0.04; 
  const intensityFactor = (gradientIntensity / 100);
  const targetHue = useSecondaryHue ? secondaryHue : baseHue;
  
  const bgSecondary = { 
    l: isDark 
      ? Math.min(bgL + baseDelta + (intensityFactor * 0.05), 0.25) 
      : Math.max(bgL - baseDelta - (intensityFactor * 0.05), 0.85), 
    c: isDark ? bgC + 0.01 : bgC, 
    h: targetHue 
  };
  
  const bgTertiary = {
    l: isDark 
      ? Math.min(bgSecondary.l + baseDelta + 0.03, 0.35) 
      : Math.max(bgSecondary.l - baseDelta - 0.03, 0.75),
    c: isDark ? bgC + 0.02 : bgC,
    h: targetHue // Также используем вторичный тон для третьего слоя, если включен
  };

  // Контрастность текста по WCAG
  const textHeadingL = findLForContrast(isDark ? 10 : 9, bgL, baseHue, bgC, isDark);
  const textPrimaryL = findLForContrast(isDark ? 8 : 7, bgL, baseHue, bgC, isDark);
  const textSecondaryL = findLForContrast(isDark ? 5.5 : 4.5, bgL, baseHue, bgC, isDark);
  const textMutedL = findLForContrast(isDark ? 4 : 3, bgL, baseHue, bgC, isDark);

  const accentPrimary = { l: accentL, c: accentC, h: baseHue };
  const accentHover = { ...accentPrimary, l: isDark ? Math.min(accentL + 0.08, 0.9) : Math.max(accentL - 0.08, 0.2) };
  
  // Accent Soft теперь может слегка подмешивать вторичный тон для связности
  const accentSoft = { 
    l: isDark ? bgL + 0.12 : bgL - 0.08, 
    c: isDark ? Math.max(accentC * 0.4, 0.08) : Math.min(accentC * 0.3, 0.06), 
    h: useSecondaryHue ? (baseHue + targetHue) / 2 : baseHue 
  };

  return {
    colors: {
      bgPrimary: oklchToString(bgPrimary),
      bgSecondary: oklchToString(bgSecondary),
      bgTertiary: oklchToString(bgTertiary),
      textHeading: oklchToString({ l: textHeadingL, c: isDark ? 0.02 : 0.04, h: baseHue }),
      textPrimary: oklchToString({ l: textPrimaryL, c: isDark ? 0.01 : 0.02, h: baseHue }),
      textSecondary: oklchToString({ l: textSecondaryL, c: isDark ? 0.01 : 0.02, h: baseHue }),
      textMuted: oklchToString({ l: textMutedL, c: isDark ? 0.01 : 0.02, h: baseHue }),
      accentPrimary: oklchToString(accentPrimary),
      accentHover: oklchToString(accentHover),
      accentSoft: oklchToString(accentSoft),
    },
    typography: {
      headingXL: '5.5rem',
      headingM: '2.5rem',
      textM: '1.25rem',
      textS: '0.875rem',
      headingFamily: typography.headingFont,
      bodyFamily: typography.bodyFont,
    }
  };
}
