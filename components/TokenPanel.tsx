
import React, { useState } from 'react';
import { DesignTokens } from '../types';
import { parseOklchString, oklchToHex, oklchToRgbString, oklchToHslString, oklchToString } from '../utils/colorMath';

interface TokenPanelProps {
  tokens: DesignTokens;
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

const TokenPanel: React.FC<TokenPanelProps> = ({ tokens, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');

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

    return `:root {\n` +
      `  /* Цвета системы */\n` +
      Object.entries(formattedColors).map(([key, val]) => `  --color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val};`).join('\n') +
      `\n\n  /* Типографика */\n` +
      `  --font-heading: "${tokens.typography.headingFamily}";\n` +
      `  --font-body: "${tokens.typography.bodyFamily}";\n` +
      `}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[460px] bg-white border-l border-slate-100 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="p-10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Готовый код</h2>
          <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Экспорт визуальной системы</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
        {/* Переключатель формата цвета (Перенесен вверх) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Формат цвета</label>
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            {['hex', 'hsl', 'rgb', 'oklch'].map(fmt => (
              <button 
                key={fmt}
                onClick={() => setColorFormat(fmt as any)}
                className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest ${colorFormat === fmt ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-400'}`}
              >{fmt}</button>
            ))}
          </div>
        </div>

        {/* Список ролей и цветов */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Цветовые роли</label>
          <div className="flex flex-col gap-2">
            {Object.entries(tokens.colors).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-300 transition-all">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl shadow-sm border border-white flex-shrink-0" 
                    style={{ backgroundColor: value }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">{roleInfo[key]?.category || 'SYSTEM'}</span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-none">{roleInfo[key]?.sub || key}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono group-hover:text-slate-900 transition-colors uppercase">{formatColor(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Секция редактора */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            {/* Переключатель CSS/JSON перенесен сюда */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
              {['css', 'json'].map(fmt => (
                <button 
                  key={fmt}
                  onClick={() => setExportFormat(fmt as any)}
                  className={`px-5 py-1.5 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest ${exportFormat === fmt ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-400'}`}
                >{fmt}</button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre 
              className="p-8 bg-slate-900 text-slate-300 rounded-[2.5rem] text-[12px] font-mono leading-relaxed overflow-x-auto shadow-2xl max-h-[400px] border border-white/5"
            >
              {getCode()}
            </pre>
            
            <button 
              onClick={copyToClipboard}
              title="Копировать в буфер"
              className={`absolute top-6 right-6 p-3 rounded-xl transition-all shadow-lg active:scale-90 flex items-center justify-center ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPanel;
