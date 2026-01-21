
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
    secondaryHue,
    contrastMultiplier = 1.0
  } = state;
  const isDark = mode === 'dark';

  let bgL: number;
  let bgC: number;
  let accentL: number;
  let accentC: number;

  // Базовые параметры фона
  if (baseRole === 'bg') {
    bgL = isDark ? Math.min(baseLightness * 0.12, 0.08) : Math.max(baseLightness, 0.96);
    bgC = isDark ? Math.min(baseChroma * 0.4, 0.015) : Math.min(baseChroma, 0.02);
    
    accentL = getAccentL(bgL, isDark);
    accentC = Math.max(baseChroma, 0.22);
  } else {
    accentL = baseLightness;
    accentC = baseChroma;
    
    bgL = isDark ? 0.07 : 0.98;
    bgC = isDark ? 0.012 : 0.012;
  }

  const bgPrimary = { l: bgL, c: bgC, h: baseHue };
  
  // Слои фона (Elevation)
  const stepL = isDark ? 0.05 : 0.04;
  const targetHue = useSecondaryHue ? secondaryHue : baseHue;
  const intensityShift = (gradientIntensity / 100) * 0.03;

  const bgSecondary = { 
    l: isDark 
      ? Math.min(bgL + stepL + intensityShift, 0.16) 
      : Math.max(bgL - stepL - intensityShift, 0.90), 
    c: isDark ? bgC + 0.01 : bgC + 0.005, 
    h: targetHue 
  };
  
  const bgTertiary = {
    l: isDark 
      ? Math.min(bgSecondary.l + stepL, 0.22) 
      : Math.max(bgSecondary.l - stepL, 0.82),
    c: isDark ? bgC + 0.02 : bgC + 0.01,
    h: targetHue
  };

  // Расчет контраста текста
  const contrastRefL = bgPrimary.l;

  /**
   * Мы снижаем базовые значения целевого контраста для светлой темы.
   * Раньше Heading был 7.0, что в светлой теме почти всегда давало черный.
   * Теперь базовый 5.5. При множителе 0.7 (Soft) мы получим ~3.8 (средне-серый),
   * а при 1.5 (Intense) — ~8.2 (глубокий черный).
   */
  const textHeadingL = findLForContrast((isDark ? 9.0 : 5.5) * contrastMultiplier, contrastRefL, baseHue, bgC, isDark);
  const textPrimaryL = findLForContrast((isDark ? 6.5 : 4.5) * contrastMultiplier, contrastRefL, baseHue, bgC, isDark);
  const textSecondaryL = findLForContrast((isDark ? 4.5 : 3.0) * contrastMultiplier, contrastRefL, baseHue, bgC, isDark);
  const textMutedL = findLForContrast((isDark ? 3.0 : 2.0) * contrastMultiplier, contrastRefL, baseHue, bgC, isDark);

  const accentPrimary = { l: accentL, c: accentC, h: baseHue };
  const accentHover = { ...accentPrimary, l: isDark ? Math.min(accentL + 0.1, 0.95) : Math.max(accentL - 0.1, 0.15) };
  
  const accentSoft = { 
    l: isDark ? bgL + 0.10 : bgL - 0.06, 
    c: isDark ? Math.max(accentC * 0.3, 0.06) : Math.min(accentC * 0.25, 0.05), 
    h: useSecondaryHue ? targetHue : baseHue 
  };

  return {
    colors: {
      bgPrimary: oklchToString(bgPrimary),
      bgSecondary: oklchToString(bgSecondary),
      bgTertiary: oklchToString(bgTertiary),
      textHeading: oklchToString({ l: textHeadingL, c: isDark ? 0.01 : 0.04, h: baseHue }),
      textPrimary: oklchToString({ l: textPrimaryL, c: isDark ? 0.005 : 0.02, h: baseHue }),
      textSecondary: oklchToString({ l: textSecondaryL, c: isDark ? 0.005 : 0.02, h: baseHue }),
      textMuted: oklchToString({ l: textMutedL, c: isDark ? 0.005 : 0.02, h: baseHue }),
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
