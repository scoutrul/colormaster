
import React from 'react';
import { DesignTokens } from '../../types';

interface TagProps {
  children: React.ReactNode;
  tokens: DesignTokens;
  active?: boolean;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, tokens, active = false, className = '' }) => {
  const { colors, typography } = tokens;

  return (
    <span 
      className={`${className} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors duration-300`}
      style={{
        backgroundColor: active ? colors.accentSoft : 'transparent',
        color: active ? colors.accentPrimary : colors.textMuted,
        borderColor: active ? 'transparent' : 'rgba(0,0,0,0.1)',
        fontSize: typography.textS
      }}
    >
      {children}
    </span>
  );
};

export default Tag;
