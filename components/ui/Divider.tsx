
import React from 'react';
import { DesignTokens } from '../../types';

interface DividerProps {
  tokens: DesignTokens;
  variant?: 'line' | 'dots';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ tokens, variant = 'line', className = '' }) => {
  const { colors } = tokens;

  if (variant === 'dots') {
    return (
      <div className={`${className} flex justify-center gap-3 my-16`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accentSoft }}></div>
        ))}
      </div>
    );
  }

  return (
    <hr 
      className={`${className} my-16 border-t-2 opacity-10`} 
      style={{ borderColor: colors.textMuted }} 
    />
  );
};

export default Divider;
