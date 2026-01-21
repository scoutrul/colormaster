
import React from 'react';
import { DesignTokens } from '../../types';

interface CardProps {
  children: React.ReactNode;
  tokens: DesignTokens;
  variant?: 'secondary' | 'tertiary';
  className?: string;
  isDark?: boolean;
}

const Card: React.FC<CardProps> = ({ children, tokens, variant = 'secondary', className = '', isDark }) => {
  const { colors } = tokens;
  
  const bgMap = {
    secondary: colors.bgSecondary,
    tertiary: colors.bgTertiary,
  };

  // В темной теме граница должна быть чуть светлее фона, чтобы отделять объект
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const shadowColor = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div 
      className={`${className} p-10 rounded-[3rem] border transition-all duration-500`}
      style={{ 
        backgroundColor: bgMap[variant],
        borderColor: borderColor,
        boxShadow: `0 25px 50px -12px ${shadowColor}`
      }}
    >
      {children}
    </div>
  );
};

export default Card;
