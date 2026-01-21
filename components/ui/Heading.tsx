
import React from 'react';
import { DesignTokens } from '../../types';

interface HeadingProps {
  children: React.ReactNode;
  variant?: 'display' | 'editorial' | 'ui';
  level?: 'xl' | 'm' | 's';
  tokens: DesignTokens;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
}

const Heading: React.FC<HeadingProps> = ({ children, variant = 'ui', level = 'm', tokens, className = '', style = {}, tag = 'h2' }) => {
  const { colors, typography } = tokens;
  const Tag = tag;

  const sizeMap = {
    xl: typography.headingXL,
    m: typography.headingM,
    s: typography.textM,
  };

  const familyMap = {
    display: typography.displayFamily,
    editorial: typography.serifFamily,
    ui: typography.bodyFamily,
  };

  const finalStyle: React.CSSProperties = {
    color: colors.textHeading,
    fontSize: sizeMap[level],
    fontFamily: `"${familyMap[variant]}", ${variant === 'editorial' ? 'serif' : 'sans-serif'}`,
    fontWeight: variant === 'display' ? 900 : (variant === 'editorial' ? 700 : 800),
    lineHeight: variant === 'display' ? 0.95 : 1.15,
    letterSpacing: variant === 'display' ? '-0.05em' : (variant === 'ui' ? '-0.02em' : 'normal'),
    ...style
  };

  return (
    <Tag className={`${className} transition-all duration-300`} style={finalStyle}>
      {children}
    </Tag>
  );
};

export default Heading;
