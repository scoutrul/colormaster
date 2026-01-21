
import React, { useState } from 'react';
import { DesignTokens } from '../types';
import { parseOklchString, oklchToHex } from '../utils/colorMath';

interface TokenPanelProps {
  tokens: DesignTokens;
  isOpen: boolean;
  onClose: () => void;
}

const TokenPanel: React.FC<TokenPanelProps> = ({ tokens, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'tailwind'>('css');

  const getHex = (oklchStr: string) => {
    const { l, c, h } = parseOklchString(oklchStr);
    return oklchToHex(l, c, h).toUpperCase();
  };

  const getCode = () => {
    const hexColors = Object.fromEntries(
      Object.entries(tokens.colors).map(([key, val]) => [key, getHex(val)])
    );

    if (exportFormat === 'json') {
      return JSON.stringify({ ...tokens, colors: hexColors }, null, 2);
    }

    if (exportFormat === 'tailwind') {
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n` +
        Object.entries(hexColors).map(([key, val]) => `        '${key.replace(/([A-Z])/g, "-$1").toLowerCase()}': '${val}',`).join('\n') +
        `\n      },\n      fontFamily: {\n        heading: ['${tokens.typography.headingFamily}'],\n        body: ['${tokens.typography.bodyFamily}'],\n      }\n    }\n  }\n}`;
    }

    return `:root {\n` +
      `  /* Цвета */\n` +
      Object.entries(hexColors).map(([key, val]) => `  --color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val};`).join('\n') +
      `\n\n  /* Шрифты */\n` +
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
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Готовый код</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Скопируйте настройки для вашего сайта</p>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-12">
        {/* Формат экспорта */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Формат</label>
          <div className="flex p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {['css', 'tailwind', 'json'].map(fmt => (
              <button 
                key={fmt}
                onClick={() => setExportFormat(fmt as any)}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${exportFormat === fmt ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-400'}`}
              >{fmt}</button>
            ))}
          </div>
        </div>

        {/* Превью палитры */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Палитра</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tokens.colors).slice(0, 6).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div 
                  className="w-10 h-10 rounded-xl shadow-sm border border-white flex-shrink-0" 
                  style={{ backgroundColor: value }}
                ></div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate leading-tight uppercase">{getHex(value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Окно кода */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Код</label>
            <button 
              onClick={copyToClipboard}
              className={`text-[11px] font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {copied ? 'СКОПИРОВАНО!' : 'СКОПИРОВАТЬ КОД'}
            </button>
          </div>
          <pre className="p-8 bg-slate-900 text-slate-300 rounded-[2rem] text-[12px] font-mono leading-relaxed overflow-x-auto shadow-xl max-h-[400px]">
            {getCode()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TokenPanel;
