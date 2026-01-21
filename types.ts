
export type ColorMode = 'light' | 'dark';
export type BaseRole = 'accent' | 'bg';

export interface OKLCH {
  l: number; // 0-1
  c: number; // 0-0.4
  h: number; // 0-360
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
}

export interface DesignTokens {
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textHeading: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentPrimary: string;
    accentHover: string;
    accentSoft: string;
  };
  typography: {
    headingXL: string;
    headingM: string;
    textM: string;
    textS: string;
    headingFamily: string;
    bodyFamily: string;
  };
}

export interface EditableContent {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  card1Title: string;
  card1Text: string;
  card2Title: string;
  card2Text: string;
  card3Title: string;
  card3Text: string;
  footerText: string;
  // Article fields
  articleTitle: string;
  articleLead: string;
  articleBody: string;
  articleQuote: string;
  articleAuthor: string;
}

export interface AppState {
  baseHue: number;
  baseChroma: number;
  baseLightness: number;
  baseRole: BaseRole;
  mode: ColorMode;
  useGradient: boolean;
  gradientIntensity: number;
  gradientAngle: number;
  useSecondaryHue: boolean;
  secondaryHue: number;
  typography: TypographyConfig;
  content: EditableContent;
}
