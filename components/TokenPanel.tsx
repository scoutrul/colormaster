
import React, { useState } from 'react';
import { DesignTokens, AppState } from '../types';
import { parseOklchString, oklchToHex, oklchToRgbString, oklchToHslString, oklchToString } from '../utils/colorMath';

interface TokenPanelProps {
  tokens: DesignTokens;
  config: AppState;
  isOpen: boolean;
  onClose: () => void;
}

const roleInfo: Record<string, { category: string; sub: string }> = {
  bgPrimary: { category: 'ФОН', sub: 'primary' },
  bgSecondary: { category: 'ФОН', sub: 'secondary' },
  bgTertiary: { category: 'ФОН', sub: 'tertiary' },
  textHeading: { category: 'ТЕКСТ', sub: 'heading' },
  textPrimary: { category: 'ТЕКСТ', sub: 'primary' },
  textSecondary: { category: 'ТЕКСТ', sub: 'secondary' },
  textMuted: { category: 'ТЕКСТ', sub: 'muted' },
  accentPrimary: { category: 'АКЦЕНТ', sub: 'primary' },
  accentHover: { category: 'АКЦЕНТ', sub: 'hover' },
  accentSoft: { category: 'АКЦЕНТ', sub: 'soft' },
};

type ColorFormat = 'hex' | 'hsl' | 'rgb' | 'oklch';

const TokenPanel: React.FC<TokenPanelProps> = ({ tokens, config, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  const formatColor = (oklchStr: string) => {
    const { l, c, h } = parseOklchString(oklchStr);
    switch (colorFormat) {
      case 'hsl': return oklchToHslString(l, c, h);
      case 'rgb': return oklchToRgbString(l, c, h);
      case 'oklch': return oklchToString({ l, c, h });
      default: return oklchToHex(l, c, h).toUpperCase();
    }
  };

  const getCode = () => {
    const formattedColors = Object.fromEntries(
      Object.entries(tokens.colors).map(([key, val]) => [key, formatColor(val)])
    );

    if (exportFormat === 'json') {
      return JSON.stringify({ ...tokens, colors: formattedColors }, null, 2);
    }

    let css = `:root {\n` +
      `  /* Цвета системы */\n` +
      Object.entries(formattedColors).map(([key, val]) => `  --color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val};`).join('\n');
    
    if (config.useGradient) {
      css += `\n  --bg-gradient: linear-gradient(${config.gradientAngle}deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);`;
    }

    css += `\n\n  /* Типографика */\n` +
      `  --font-heading: "${tokens.typography.headingFamily}";\n` +
      `  --font-body: "${tokens.typography.bodyFamily}";\n` +
      `}`;
    
    return css;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[540px] bg-white border-l border-slate-100 z-50 flex flex-col shadow-[-40px_0_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="p-8 pb-6 flex items-center justify-between shrink-0 border-b border-slate-50">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Визуальная система</h2>
        <button 
          onClick={onClose}
          className="group flex items-center gap-3 py-2 px-4 bg-slate-50 hover:bg-slate-900 rounded-full transition-all duration-300"
        >
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Закрыть панель</span>
          <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 space-y-4 scroll-smooth custom-scrollbar">
        
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50 mb-4">
          {['hex', 'hsl', 'rgb', 'oklch'].map(fmt => (
            <button 
              key={fmt}
              onClick={() => setColorFormat(fmt as any)}
              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${colorFormat === fmt ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >{fmt}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {Object.entries(tokens.colors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl shadow-md border-2 border-white flex-shrink-0" 
                  style={{ backgroundColor: value }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-widest opacity-60">{roleInfo[key]?.category || 'SYSTEM'}</span>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none">{roleInfo[key]?.sub || key}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900 font-mono uppercase tracking-tighter block">
                  {formatColor(value)}
                </span>
              </div>
            </div>
          ))}

          {/* СЕКЦИЯ ГРАДИЕНТА С ПАРАМЕТРАМИ */}
          {config.useGradient && (
            <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 transition-all duration-200 mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-md border-2 border-white flex-shrink-0" 
                    style={{ background: `linear-gradient(${config.gradientAngle}deg, ${tokens.colors.bgPrimary} 0%, ${tokens.colors.bgSecondary} 100%)` }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-indigo-400 uppercase leading-none mb-1 tracking-widest opacity-80">GRADIENT</span>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none">Background</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600 font-mono uppercase tracking-tighter block">
                    {config.gradientAngle}°
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/50">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Start color</span>
                  <span className="text-[11px] font-bold text-slate-600 font-mono truncate">{formatColor(tokens.colors.bgPrimary)}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">End color</span>
                  <span className="text-[11px] font-bold text-slate-600 font-mono truncate">{formatColor(tokens.colors.bgSecondary)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 mt-4 border-t border-slate-50">
          <button 
            onClick={() => setIsCodeExpanded(!isCodeExpanded)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group"
          >
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Просмотреть код экспорта</span>
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCodeExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isCodeExpanded && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
                {['css', 'json'].map(fmt => (
                  <button 
                    key={fmt}
                    onClick={() => setExportFormat(fmt as any)}
                    className={`px-6 py-1.5 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${exportFormat === fmt ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >{fmt}</button>
                ))}
              </div>

              <div className="relative group/code">
                <pre 
                  className="p-8 bg-slate-900 text-slate-300 rounded-[2.5rem] text-[12px] font-mono leading-relaxed overflow-x-auto shadow-2xl max-h-[400px] border border-white/5 custom-scrollbar transition-all"
                >
                  {getCode()}
                </pre>
                
                <button 
                  onClick={copyToClipboard}
                  className={`absolute top-6 right-6 p-4 rounded-2xl transition-all shadow-xl active:scale-90 flex items-center justify-center ${copied ? 'bg-emerald-500 text-white scale-110' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
                >
                  {copied ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPanel;
