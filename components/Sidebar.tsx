
import React, { useMemo } from 'react';
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

  const secondaryHex = useMemo(() => 
    oklchToHex(0.6, 0.15, state.secondaryHue),
    [state.secondaryHue]
  );
  
  const headingFonts = [
    'Montserrat', 'Playfair Display', 'Outfit', 'Clash Display', 'Manrope', 'Lora', 'Unbounded', 'Raleway', 'Jost'
  ];
  const bodyFonts = [
    'Inter', 'Roboto', 'Plus Jakarta Sans', 'Satoshi', 'IBM Plex Sans', 'Open Sans', 'Work Sans'
  ];

  const handleBaseColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const oklch = hexToOklch(e.target.value);
    onChange({
      ...state,
      baseHue: oklch.h,
      baseChroma: oklch.c,
      baseLightness: oklch.l
    });
  };

  const handleSecondaryColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const oklch = hexToOklch(e.target.value);
    onChange({
      ...state,
      secondaryHue: oklch.h
    });
  };

  return (
    <div className="w-[400px] bg-white h-full flex flex-col p-12 space-y-14 overflow-y-auto z-20 shadow-[30px_0_80px_-20px_rgba(0,0,0,0.04)] border-r border-slate-100">
      {/* Лого */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-3xl italic shadow-xl">V</div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">Vision</h1>
      </div>

      {/* Выбор цвета */}
      <section className="space-y-10">
        <div className="space-y-6">
          <label className="text-base font-bold text-slate-900 block">Основной цвет</label>
          <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-slate-100/50">
            <div className="relative w-16 h-16 shrink-0">
              <input 
                type="color" 
                value={currentHex}
                onChange={handleBaseColorPicker}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="w-full h-full rounded-[1.25rem] border-4 border-white shadow-md transition-transform hover:scale-105" 
                style={{ backgroundColor: currentHex }}
              ></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">HEX CODE</span>
              <span className="text-lg font-bold text-slate-600 font-mono tracking-tight">{currentHex.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-10 px-1">
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Тон</span>
            </div>
            <input 
              type="range" min="0" max="360" value={state.baseHue}
              onChange={(e) => onChange({...state, baseHue: Number(e.target.value)})}
              className="w-full h-2"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Насыщенность</span>
            </div>
            <input 
              type="range" min="0" max="0.37" step="0.01" value={state.baseChroma}
              onChange={(e) => onChange({...state, baseChroma: Number(e.target.value)})}
              className="w-full h-2"
            />
          </div>
        </div>

        {/* Секция вторичного тона */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <button 
            onClick={() => onChange({...state, useSecondaryHue: !state.useSecondaryHue})}
            className={`w-full flex items-center justify-between font-bold text-sm transition-colors ${state.useSecondaryHue ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${state.useSecondaryHue ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
               <span>Двухцветная схема</span>
            </div>
            <div className="relative">
              <div className={`w-10 h-5 rounded-full transition-colors ${state.useSecondaryHue ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${state.useSecondaryHue ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </button>

          {state.useSecondaryHue && (
            <div className="space-y-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-6">
                <div className="relative w-12 h-12 shrink-0">
                   <input 
                      type="color" 
                      value={secondaryHex}
                      onChange={handleSecondaryColorPicker}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                   <div className="w-full h-full rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: secondaryHex }}></div>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Secondary Hue</span>
                   <span className="text-sm font-bold text-slate-500 font-mono tracking-tighter">{state.secondaryHue.toFixed(0)}° Hue</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="360" value={state.secondaryHue}
                onChange={(e) => onChange({...state, secondaryHue: Number(e.target.value)})}
                className="w-full h-1.5"
              />
            </div>
          )}
        </div>
      </section>

      {/* Шрифты */}
      <section className="space-y-10">
        <h2 className="text-base font-bold text-slate-900">Типографика</h2>
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Заголовки</label>
            <select 
              className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-base font-bold outline-none appearance-none cursor-pointer focus:border-indigo-400 transition-colors shadow-sm"
              value={state.typography.headingFont}
              onChange={(e) => onChange({...state, typography: {...state.typography, headingFont: e.target.value}})}
            >
              {headingFonts.sort().map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Контент</label>
            <select 
              className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-base font-bold outline-none appearance-none cursor-pointer focus:border-indigo-400 transition-colors shadow-sm"
              value={state.typography.bodyFont}
              onChange={(e) => onChange({...state, typography: {...state.typography, bodyFont: e.target.value}})}
            >
              {bodyFonts.sort().map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Оформление */}
      <section className="space-y-10">
        <h2 className="text-base font-bold text-slate-900">Режим отображения</h2>
        <div className="space-y-8">
          <div className="flex p-2 bg-slate-100 rounded-[1.5rem]">
            <button 
              onClick={() => onChange({...state, mode: 'light'})}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all uppercase tracking-widest ${state.mode === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Светлая
            </button>
            <button 
              onClick={() => onChange({...state, mode: 'dark'})}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all uppercase tracking-widest ${state.mode === 'dark' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
            >
              Темная
            </button>
          </div>

          <div className="space-y-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <button 
              onClick={() => onChange({...state, useGradient: !state.useGradient})}
              className={`w-full flex items-center justify-between font-bold text-sm transition-colors ${state.useGradient ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <span>Сложные градиенты</span>
              <div className="relative">
                <div className={`w-10 h-5 rounded-full transition-colors ${state.useGradient ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${state.useGradient ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </button>

            {state.useGradient && (
              <div className="space-y-8 pt-6 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Глубина</label>
                  <input 
                    type="range" min="0" max="100" value={state.gradientIntensity}
                    onChange={(e) => onChange({...state, gradientIntensity: Number(e.target.value)})}
                    className="w-full h-1.5"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Направление</label>
                  <input 
                    type="range" min="0" max="360" value={state.gradientAngle}
                    onChange={(e) => onChange({...state, gradientAngle: Number(e.target.value)})}
                    className="w-full h-1.5"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pt-8 text-center">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.4em]">Vision 2025</span>
      </div>
    </div>
  );
};

export default Sidebar;
