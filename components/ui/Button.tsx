
import React, { useState } from 'react';
import { DesignTokens } from '../../types';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'soft';
  tokens: DesignTokens;
  className?: string;
  onClick?: () => void;
  isDark?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', tokens, className = '', onClick, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors } = tokens;

  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isHovered ? colors.accentHover : colors.accentPrimary,
          color: isDark ? '#000' : '#fff',
          boxShadow: isHovered ? '0 10px 25px -5px rgba(0,0,0,0.2)' : 'none',
        };
      case 'outline':
        return {
          backgroundColor: isHovered ? colors.accentSoft : 'transparent',
          color: colors.accentPrimary,
          border: `1px solid ${colors.accentPrimary}`,
        };
      case 'soft':
        return {
          backgroundColor: colors.accentSoft,
          color: colors.accentPrimary,
        };
      default:
        return {};
    }
  };

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`${className} px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 active:scale-95`}
      style={getStyles()}
    >
      {children}
    </button>
  );
};

export default Button;
