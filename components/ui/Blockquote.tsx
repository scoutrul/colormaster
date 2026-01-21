
import React from 'react';
import { DesignTokens } from '../../types';

interface BlockquoteProps {
  children: React.ReactNode;
  tokens: DesignTokens;
  className?: string;
  author?: React.ReactNode;
}

const Blockquote: React.FC<BlockquoteProps> = ({ children, tokens, className = '', author }) => {
  const { colors, typography } = tokens;

  return (
    <div className={`${className} pl-8 border-l-4 my-12 transition-all duration-300`} style={{ borderColor: colors.accentPrimary }}>
      <blockquote 
        className="italic font-medium"
        style={{ 
          color: colors.textHeading, 
          fontSize: `calc(${typography.textM} * 1.3)`,
          // Fix: replaced non-existent headingFamily with serifFamily
          fontFamily: typography.serifFamily
        }}
      >
        "{children}"
      </blockquote>
      {author && (
        <cite className="block mt-4 not-italic font-black uppercase tracking-widest text-[10px]" style={{ color: colors.accentPrimary }}>
          — {author}
        </cite>
      )}
    </div>
  );
};

export default Blockquote;
