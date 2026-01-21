
import React, { useMemo, useState, useEffect } from 'react';
import { AppState } from '../types';
import { hexToOklch, oklchToHex } from '../utils/colorMath';

interface SidebarProps {
  state: AppState;
  onChange: (newState: AppState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, onChange }) => {
  const currentHex = useMemo(() => 
    oklchToHex(state.baseLightness, state.baseChroma, state.baseHue),
    [state.baseLightness, state.baseChroma, state.baseHue]
  );

  const [inputValue, setInputValue] = useState(currentHex.toUpperCase());

  useEffect(() => {
    setInputValue(currentHex.toUpperCase());
  }, [currentHex]);

  // Группы шрифтов с полной поддержкой кириллицы
  const bodyFonts = ['Manrope', 'Inter', 'Golos Text', 'Onest', 'Montserrat', 'Roboto', 'IBM Plex Sans'];
  const editorialFonts = ['Spectral', 'Lora', 'Playfair Display', 'Merriweather', 'PT Serif', 'Oranienbaum'];
  
  // Акцентные (Display) шрифты - только кириллица + пересечения
  const displayFonts = [
    'Unbounded', 
    'Dela Gothic One', 
    'Russo One', 
    'Rubik Mono One',
    'Montserrat',
    'Playfair Display',
    'Spectral',
    'Manrope',
    'Comfortaa'
  ];

  const handleBaseColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const oklch = hexToOklch(hex);
    onChange({
      ...state,
      baseHue: oklch.h,
      baseChroma: oklch.c,
      baseLightness: oklch.l
    });
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const oklch = hexToOklch(val);
      onChange({
        ...state,
        baseHue: oklch.h,
        baseChroma: oklch.c,
        baseLightness: oklch.l
      });
    }
  };

  return (
    <div className="w-[400px] bg-white h-full flex flex-col p-10 space-y-8 overflow-y-auto z-20 shadow-[30px_0_80px_-20px_rgba(0,0,0,0.04)] border-r border-slate-100 custom-scrollbar">
      <div className="flex items-center gap-4 shrink-0 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl italic">V</div>
        <h1 className="text-xl font-black tracking-tight text-slate-900">Vision Architect</h1>
      </div>

      {/* 1. ЦВЕТ СИСТЕМЫ */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Цвет системы</label>
        <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative w-14 h-14 shrink-0">
            <input type="color" value={currentHex} onChange={handleBaseColorPicker} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full h-full rounded-xl border-4 border-white shadow-sm" style={{ backgroundColor: currentHex }}></div>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">HEX</span>
            <input 
              type="text" 
              value={inputValue} 
              onChange={handleHexInput} 
              className="bg-transparent text-base font-bold text-slate-700 font-mono tracking-tight outline-none w-full uppercase" 
            />
          </div>
        </div>
      </section>

      {/* 2. РЕЖИМ И КОНТРАСТ */}
      <section className="space-y-6 pt-2 border-t border-slate-50">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Режим</label>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => onChange({...state, mode: 'light'})} 
              className={`flex-1 py-2.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${state.mode === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Светлая
            </button>
            <button 
              onClick={() => onChange({...state, mode: 'dark'})} 
              className={`flex-1 py-2.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${state.mode === 'dark' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Темная
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Контрастность</span>
            <span className="text-xs font-bold text-slate-900">{Math.round(state.contrastMultiplier * 100)}%</span>
          </div>
          <input 
            type="range" min="0.8" max="1.4" step="0.05" value={state.contrastMultiplier}
            onChange={(e) => onChange({...state, contrastMultiplier: Number(e.target.value)})}
            className="w-full"
          />
        </div>
      </section>

      {/* 3. ШРИФТЫ */}
      <section className="space-y-6 pt-2 border-t border-slate-50">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Шрифты</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block ml-1">Текст и интерфейс</span>
            <select 
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none cursor-pointer hover:border-slate-300 transition-colors"
              value={state.typography.bodyFont}
              onChange={(e) => onChange({...state, typography: {...state.typography, bodyFont: e.target.value}})}
            >
              {bodyFonts.sort().map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block ml-1">Заголовки</span>
            <select 
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none cursor-pointer hover:border-slate-300 transition-colors"
              value={state.typography.editorialFont}
              onChange={(e) => onChange({...state, typography: {...state.typography, editorialFont: e.target.value}})}
            >
              {editorialFonts.sort().map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block ml-1">Акцентный шрифт</span>
            <select 
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none cursor-pointer hover:border-slate-300 transition-colors"
              value={state.typography.displayFont}
              onChange={(e) => onChange({...state, typography: {...state.typography, displayFont: e.target.value}})}
            >
              {displayFonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* 4. ГРАДИЕНТ ФОНА */}
      <section className="space-y-4 pt-2 border-t border-slate-50 pb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Градиент фона</h2>
          <button 
            onClick={() => onChange({...state, useGradient: !state.useGradient})}
            className={`w-10 h-5 rounded-full transition-all relative ${state.useGradient ? 'bg-indigo-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.useGradient ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {state.useGradient && (
          <div className="space-y-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Интенсивность</span>
                <span className="text-slate-600 font-mono">{state.gradientIntensity}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={state.gradientIntensity}
                onChange={(e) => onChange({...state, gradientIntensity: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Угол</span>
                <span className="text-slate-600 font-mono">{state.gradientAngle}°</span>
              </div>
              <input 
                type="range" min="0" max="360" value={state.gradientAngle}
                onChange={(e) => onChange({...state, gradientAngle: Number(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        )}
      </section>

      <div className="flex-1"></div>
    </div>
  );
};

export default Sidebar;
