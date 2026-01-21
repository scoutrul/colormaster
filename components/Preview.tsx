
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
      {/* SECTION 1: HERO */}
      <div className="w-full transition-all duration-500 flex justify-center" style={heroBgStyle}>
        <div className="max-w-6xl w-full px-12 pt-16 pb-32">
          <nav className="flex justify-between items-center mb-24">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: colors.accentPrimary }}></div>
               <Heading level="m" tokens={tokens} tag="span" style={{ fontSize: '1.25rem' }}>VISION</Heading>
            </div>
            <div className="flex gap-10">
              <Text tokens={tokens} variant="secondary" className="font-bold uppercase text-[11px] tracking-widest">Метод</Text>
              <Button tokens={tokens} variant="outline" className="!px-6 !py-2 !rounded-full" isDark={isDark}>Обсудить</Button>
            </div>
          </nav>

          <header className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-4">
              <Heading level="m" tokens={tokens} tag="span" style={{ color: colors.accentPrimary, fontSize: tokens.typography.textS, letterSpacing: '0.2em' }}>
                <Editable value={content.heroTag} field="heroTag" onBlur={onContentChange} />
              </Heading>
              <div className="h-[1px] w-24" style={{ backgroundColor: colors.accentPrimary }}></div>
            </div>

            <Heading level="xl" tokens={tokens} tag="h1">
              <Editable value={content.heroTitle} field="heroTitle" onBlur={onContentChange} />
            </Heading>

            <Text tokens={tokens} className="max-w-2xl font-medium">
              <Editable value={content.heroSubtitle} field="heroSubtitle" onBlur={onContentChange} />
            </Text>
            
            <div className="pt-10">
              <Button tokens={tokens} isDark={isDark} className="px-12 py-5 !rounded-2xl shadow-2xl">Заказать ретрит</Button>
            </div>
          </header>
        </div>
      </div>

      {/* SECTION 2: PROGRAMS */}
      <div className="w-full py-32 px-12 transition-all duration-500 border-y flex justify-center" style={{ backgroundColor: colors.bgSecondary, ...borderStyle }}>
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} tokens={tokens} isDark={isDark} className="space-y-8">
                <div className="flex justify-between items-start">
                   <Tag tokens={tokens} active>{i === 1 ? '1 день' : i === 2 ? '4-6 часов' : '2-3 дня'}</Tag>
                   <span className="text-6xl font-black opacity-10" style={{ color: colors.textMuted }}>0{i}</span>
                </div>
                <div className="space-y-4">
                   <Heading level="m" tokens={tokens} tag="h3">
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

      {/* SECTION 3: ARTICLE LAYOUT */}
      <div className="w-full py-32 px-12 flex justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <article className="max-w-3xl w-full space-y-12">
          <div className="space-y-6">
            <Tag tokens={tokens} active>Insight</Tag>
            <Heading level="m" tokens={tokens} tag="h2" style={{ fontSize: '3.5rem' }}>
              <Editable value={content.articleTitle} field="articleTitle" onBlur={onContentChange} />
            </Heading>
          </div>

          <Text tokens={tokens} variant="lead">
            <Editable value={content.articleLead} field="articleLead" onBlur={onContentChange} />
          </Text>

          <Divider tokens={tokens} variant="line" />

          <Text tokens={tokens}>
            <Editable value={content.articleBody} field="articleBody" onBlur={onContentChange} />
          </Text>

          <Blockquote 
            tokens={tokens} 
            author={<Editable value={content.articleAuthor} field="articleAuthor" onBlur={onContentChange} />}
          >
            <Editable value={content.articleQuote} field="articleQuote" onBlur={onContentChange} />
          </Blockquote>

          <Text tokens={tokens}>
            Практика глубокой работы требует дисциплины и системного подхода к дизайну собственного окружения. Когда мы минимизируем визуальный шум, наш мозг освобождает ресурсы для решения сложных задач.
          </Text>

          <Divider tokens={tokens} variant="dots" />
          
          <div className="flex justify-center">
            <Button tokens={tokens} variant="soft" className="!px-16 !py-6 !rounded-full">Поделиться мыслями</Button>
          </div>
        </article>
      </div>

      {/* FOOTER */}
      <div className="w-full py-20 px-12 flex justify-center border-t" style={{ backgroundColor: colors.bgSecondary, ...borderStyle }}>
         <Card tokens={tokens} variant="tertiary" className="max-w-4xl w-full text-center p-20 !rounded-[4rem]">
           <Heading level="m" tokens={tokens}>
             <Editable value={content.footerText} field="footerText" onBlur={onContentChange} />
           </Heading>
           <div className="mt-12 flex justify-center gap-4">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.accentPrimary }}></div>
           </div>
         </Card>
      </div>
    </div>
  );
};

export default Preview;
