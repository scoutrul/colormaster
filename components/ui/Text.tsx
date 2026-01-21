
import React from 'react';
import { DesignTokens } from '../../types';

interface TextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'muted' | 'lead';
  size?: 'm' | 's';
  tokens: DesignTokens;
  className?: string;
  style?: React.CSSProperties;
}

const Text: React.FC<TextProps> = ({ children, variant = 'primary', size = 'm', tokens, className = '', style = {} }) => {
  const { colors, typography } = tokens;
  
  const colorMap = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    lead: colors.textPrimary,
  };

  const sizeMap = {
    m: typography.textM,
    s: typography.textS,
  };

  const finalStyle: React.CSSProperties = {
    color: colorMap[variant],
    fontSize: variant === 'lead' ? `calc(${typography.textM} * 1.25)` : sizeMap[size],
    fontFamily: `"${typography.bodyFamily}", sans-serif`,
    lineHeight: variant === 'lead' ? 1.4 : 1.6,
    fontWeight: variant === 'lead' ? 500 : 'normal',
    ...style
  };

  return (
    <p className={`${className} transition-colors duration-300`} style={finalStyle}>
      {children}
    </p>
  );
};

export default Text;
