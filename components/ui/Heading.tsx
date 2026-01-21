
import React from 'react';
import { DesignTokens } from '../../types';

interface HeadingProps {
  children: React.ReactNode;
  level?: 'xl' | 'm';
  tokens: DesignTokens;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
}

const Heading: React.FC<HeadingProps> = ({ children, level = 'm', tokens, className = '', style = {}, tag = 'h2' }) => {
  const { colors, typography } = tokens;
  const Tag = tag;

  const sizeMap = {
    xl: typography.headingXL,
    m: typography.headingM,
  };

  const finalStyle: React.CSSProperties = {
    color: colors.textHeading,
    fontSize: sizeMap[level],
    fontFamily: `"${typography.headingFamily}", serif`,
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: level === 'xl' ? '-0.04em' : 'normal',
    ...style
  };

  return (
    <Tag className={`${className} transition-all duration-300`} style={finalStyle}>
      {children}
    </Tag>
  );
};

export default Heading;
