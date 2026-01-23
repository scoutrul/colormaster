
import React from 'react';
import { DesignTokens, AppState } from '../types';
import Button from './ui/Button';
import Heading from './ui/Heading';
import Text from './ui/Text';
import Card from './ui/Card';
import Tag from './ui/Tag';
import Editable from './ui/Editable';
import Blockquote from './ui/Blockquote';
import Divider from './ui/Divider';

interface PreviewProps {
  tokens: DesignTokens;
  config: AppState;
  onContentChange: (key: string, value: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ tokens, config, onContentChange }) => {
  const { colors } = tokens;
  const { content, mode } = config;
  const isDark = mode === 'dark';

  const heroBgStyle = config.useGradient 
    ? { background: `linear-gradient(${config.gradientAngle}deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 100%)` }
    : { backgroundColor: colors.bgPrimary };

  const borderStyle = { borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' };

  return (
    <div 
      className="w-full h-full flex flex-col transition-all duration-700 overflow-y-auto scroll-smooth"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      {/* СЕКЦИЯ 1: ВИЗУАЛЬНОЕ ЗАЯВЛЕНИЕ */}
      <div 
        className="w-full py-64 px-12 transition-all duration-500 flex justify-center overflow-visible relative min-h-[85vh] items-center" 
        style={{ backgroundColor: colors.bgTertiary }}
      >
         <div className="max-w-6xl w-full relative">
            {/* Фоновый текст */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] font-black opacity-[0.03] leading-none pointer-events-none whitespace-nowrap overflow-visible" 
              style={{ fontFamily: tokens.typography.displayFamily }}
            >
              <Editable value={content.displayBgText} field="displayBgText" onBlur={onContentChange} />
            </div>
            
            {/* Основной контент */}
            <div className="flex flex-col items-center text-center space-y-16 relative z-10 overflow-visible">
                <Heading 
                  variant="display" 
                  tokens={tokens} 
                  style={{ 
                    fontSize: 'clamp(5rem, 12vw, 14rem)', 
                    lineHeight: 0.92, 
                    padding: '0.25em 0',
                    overflow: 'visible'
                  }}
                >
                  <Editable value={content.displaySectionTitle} field="displaySectionTitle" onBlur={onContentChange} />
                </Heading>
                <Text tokens={tokens} variant="secondary" className="font-black uppercase tracking-[0.5em] text-xs max-w-lg opacity-60">
                  <Editable value={content.displaySectionSubtitle} field="displaySectionSubtitle" onBlur={onContentChange} />
                </Text>
            </div>
         </div>
      </div>

      {/* СЕКЦИЯ 2: ГЕРОЙ */}
      <div className="w-full transition-all duration-500 flex justify-center border-t" style={{ ...heroBgStyle, ...borderStyle }}>
        <div className="max-w-6xl w-full px-12 pt-16 pb-32">
          <nav className="flex justify-between items-center mb-24">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: colors.accentPrimary }}></div>
               <Heading level="s" tokens={tokens} variant="ui" tag="span" style={{ fontSize: '1.25rem' }}>
                  <Editable value={content.brandName} field="brandName" onBlur={onContentChange} />
               </Heading>
            </div>
            <div className="flex gap-10 items-center">
              <Text tokens={tokens} variant="secondary" className="font-bold uppercase text-[11px] tracking-widest">
                <Editable value={content.navLink1} field="navLink1" onBlur={onContentChange} />
              </Text>
              <Button tokens={tokens} variant="outline" className="!px-6 !py-2 !rounded-full" isDark={isDark}>
                <Editable value={content.navLink2} field="navLink2" onBlur={onContentChange} />
              </Button>
            </div>
          </nav>

          <header className="space-y-12 max-w-5xl">
            <div className="flex items-center gap-4">
              <span 
                className="uppercase tracking-[0.3em] font-black text-[10px]"
                style={{ color: colors.accentPrimary, fontFamily: tokens.typography.bodyFamily }}
              >
                <Editable value={content.heroTag} field="heroTag" onBlur={onContentChange} />
              </span>
              <div className="h-[1px] w-16" style={{ backgroundColor: colors.accentPrimary }}></div>
            </div>

            <Heading level="xl" tokens={tokens} variant="display" tag="h1">
              <Editable value={content.heroTitle} field="heroTitle" onBlur={onContentChange} />
            </Heading>

            <Text tokens={tokens} className="max-w-2xl font-medium !text-lg">
              <Editable value={content.heroSubtitle} field="heroSubtitle" onBlur={onContentChange} />
            </Text>
            
            <div className="pt-8">
              <Button tokens={tokens} isDark={isDark} className="px-12 py-5 !rounded-2xl shadow-2xl">
                <Editable value={content.heroButtonText} field="heroButtonText" onBlur={onContentChange} />
              </Button>
            </div>
          </header>
        </div>
      </div>

      {/* СЕКЦИЯ 3: ПРОГРАММЫ */}
      <div className="w-full py-32 px-12 transition-all duration-500 border-y flex justify-center" style={{ backgroundColor: colors.bgSecondary, ...borderStyle }}>
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} tokens={tokens} isDark={isDark} className="space-y-10">
                <div className="flex justify-between items-start">
                   <Tag tokens={tokens} active>
                      <Editable value={content[`card${i}Tag` as keyof typeof content]} field={`card${i}Tag`} onBlur={onContentChange} />
                   </Tag>
                   <span className="text-5xl font-black opacity-10" style={{ color: colors.textMuted, fontFamily: tokens.typography.displayFamily }}>
                      <Editable value={content[`card${i}Number` as keyof typeof content]} field={`card${i}Number`} onBlur={onContentChange} />
                   </span>
                </div>
                <div className="space-y-4">
                   <Heading level="m" tokens={tokens} variant="editorial" tag="h3">
                      <Editable value={content[`card${i}Title` as keyof typeof content]} field={`card${i}Title`} onBlur={onContentChange} />
                   </Heading>
                   <Text tokens={tokens} variant="secondary" className="text-sm">
                      <Editable value={content[`card${i}Text` as keyof typeof content]} field={`card${i}Text`} onBlur={onContentChange} />
                   </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* СЕКЦИЯ 4: СТАТЬЯ */}
      <div className="w-full py-32 px-12 flex justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <article className="max-w-3xl w-full space-y-12">
          <div className="space-y-6">
            <Tag tokens={tokens} active>
              <Editable value={content.articleTag} field="articleTag" onBlur={onContentChange} />
            </Tag>
            <Heading level="m" tokens={tokens} variant="editorial" tag="h2" style={{ fontSize: '4.5rem' }}>
              <Editable value={content.articleTitle} field="articleTitle" onBlur={onContentChange} />
            </Heading>
          </div>

          <Text tokens={tokens} variant="lead" className="!text-2xl italic" style={{ fontFamily: tokens.typography.serifFamily }}>
            <Editable value={content.articleLead} field="articleLead" onBlur={onContentChange} />
          </Text>

          <Divider tokens={tokens} variant="line" />

          <div className="columns-1 md:columns-2 gap-10">
              <Text tokens={tokens} className="mb-6">
                <Editable value={content.articleBody} field="articleBody" onBlur={onContentChange} />
              </Text>
              <Text tokens={tokens}>
                <Editable value={content.articleBody2} field="articleBody2" onBlur={onContentChange} />
              </Text>
          </div>

          <Blockquote 
            tokens={tokens} 
            author={<Editable value={content.articleAuthor} field="articleAuthor" onBlur={onContentChange} />}
          >
            <Editable value={content.articleQuote} field="articleQuote" onBlur={onContentChange} />
          </Blockquote>

          <div className="flex justify-center pt-10">
            <Button tokens={tokens} variant="soft" className="!px-16 !py-6 !rounded-full">
              <Editable value={content.articleButtonText} field="articleButtonText" onBlur={onContentChange} />
            </Button>
          </div>
        </article>
      </div>

      {/* ФУТЕР */}
      <div className="w-full py-24 px-12 flex justify-center border-t" style={{ backgroundColor: colors.bgSecondary, ...borderStyle }}>
         <div className="max-w-4xl w-full text-center">
           <Heading variant="display" tokens={tokens} level="m" className="mb-8">
             <Editable value={content.footerText} field="footerText" onBlur={onContentChange} />
           </Heading>
           <div className="flex justify-center gap-10">
              {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                <Text key={social} tokens={tokens} variant="secondary" className="font-black text-[10px] uppercase tracking-widest cursor-pointer hover:text-indigo-500 transition-colors">
                  {social}
                </Text>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default Preview;
