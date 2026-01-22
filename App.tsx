
import React, { useState, useMemo, useEffect } from 'react';
import { AppState } from './types';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import TokenPanel from './components/TokenPanel';
import { generateSystem } from './services/systemGenerator';

const App: React.FC = () => {
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
  const [isFontsLoading, setIsFontsLoading] = useState(false);
  const [state, setState] = useState<AppState>({
    baseHue: 205,
    baseChroma: 0.1,
    baseLightness: 0.6,
    baseRole: 'accent',
    mode: 'light',
    useGradient: true,
    gradientIntensity: 30,
    gradientAngle: 165,
    useSecondaryHue: false,
    secondaryHue: 260,
    contrastMultiplier: 1.0,
    typography: {
      bodyFont: 'Manrope',      
      editorialFont: 'Spectral', 
      displayFont: 'Unbounded'  
    },
    content: {
      brandName: 'VISION',
      navLink1: 'Метод',
      navLink2: 'Обсудить',
      heroTag: 'ЭКСКЛЮЗИВНЫЙ ОПЫТ',
      heroTitle: 'Будущее создается\nв тишине',
      heroSubtitle: 'Проектируем глубокие трансформационные путешествия для лидеров и команд. Мы объединяем когнитивную психологию и биохакинг для кратного роста вашего видения.',
      heroButtonText: 'Заказать ретрит',
      card1Tag: '1 день',
      card1Number: '01',
      card1Title: 'Нейробаланс',
      card1Text: 'Научные методики восстановления фокуса и снятия хронического напряжения в условиях неопределенности.',
      card2Tag: '4-6 часов',
      card2Number: '02',
      card2Title: 'Радикальная стратегия',
      card2Text: 'Модерируемые сессии в изоляции для поиска нестандартных решений и формирования вектора развития.',
      card3Tag: '2-3 дня',
      card3Number: '03',
      card3Title: 'Экосистема доверия',
      card3Text: 'Создание непоколебимой связи внутри коллектива через совместное преодоление барьеров и сонастройку.',
      articleTag: 'Editorial Insight',
      articleTitle: 'Искусство глубокой фокусировки',
      articleLead: 'В мире, где внимание стало самым дорогим ресурсом, способность к глубокой работе отделяет визионеров.',
      articleBody: 'Постоянные уведомления и фрагментация задач приводят к состоянию "внимательного истощения". Исследования показывают, что после каждого прерывания мозгу требуется до 23 минут, чтобы вернуться к потоку.',
      articleBody2: 'Практика глубокой работы требует дисциплины и системного подхода к дизайну собственного окружения. Когда мы минимизируем визуальный шум, наш мозг освобождает ресурсы для созидания.',
      articleQuote: 'Тишина — это не пустота. Это пространство, где рождаются ответы.',
      articleAuthor: 'Марк Оливер, PhD',
      articleButtonText: 'Связаться с автором',
      footerText: 'Превращаем человеческий капитал в осознанное сообщество.',
      displaySectionTitle: 'FOCUS\nENERGY\nFLOW',
      displaySectionSubtitle: 'Экспериментальная лаборатория смыслов и трансформаций',
      displayBgText: 'TRANSFORM'
    }
  });

  const tokens = useMemo(() => generateSystem(state), [state]);

  useEffect(() => {
    const linkId = 'dynamic-google-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const { bodyFont, editorialFont, displayFont } = state.typography;
    
    // Показываем лоадер перед началом смены шрифтов
    setIsFontsLoading(true);

    const fontConfigs = [
      `${bodyFont.replace(/\s+/g, '+')}:wght@400;700;800`,
      `${editorialFont.replace(/\s+/g, '+')}:ital,wght@0,400;0,700;1,400`,
      `${displayFont.replace(/\s+/g, '+')}:wght@400;700;900`
    ];

    const url = `https://fonts.googleapis.com/css2?${fontConfigs.map(f => `family=${f}`).join('&')}&display=swap`;
    
    link.href = url;

    // Ждем, пока браузер полностью обработает новые шрифты
    document.fonts.ready.then(() => {
      // Небольшая задержка для плавности анимации, даже если загрузка мгновенная
      setTimeout(() => setIsFontsLoading(false), 300);
    });
  }, [state.typography]);

  const updateContent = (key: string, value: string) => {
    setState(prev => ({
      ...prev,
      content: { ...prev.content, [key as keyof AppState['content']]: value }
    }));
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 relative font-sans">
      <Sidebar state={state} onChange={setState} />
      <main className="flex-1 relative overflow-hidden bg-slate-50 p-6">
         <div className="w-full h-full rounded-[3rem] shadow-2xl overflow-hidden bg-white border border-slate-200 relative">
            
            {/* Font Loading Overlay */}
            {isFontsLoading && (
              <div className="absolute inset-0 z-[55] flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl animate-in fade-in duration-500">
                <div className="flex flex-col items-center gap-6">
                  {/* High-end minimalist pulse indicator */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-slate-900/10 animate-ping absolute"></div>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic text-xl shadow-2xl">V</div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] block animate-pulse">
                      Syncing Typography
                    </span>
                    <div className="w-32 h-[1px] bg-slate-100 overflow-hidden relative rounded-full">
                       <div className="absolute inset-0 bg-slate-900 animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Preview */}
            <div className={`w-full h-full transition-all duration-700 ${isFontsLoading ? 'blur-sm scale-[0.99] opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
              <Preview tokens={tokens} config={state} onContentChange={updateContent} />
            </div>
         </div>

         {!isTokenPanelOpen && (
           <button 
             onClick={() => setIsTokenPanelOpen(true)}
             className="absolute top-12 right-12 z-[60] px-8 py-4 rounded-[1.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 font-black text-xs tracking-widest uppercase bg-slate-900 text-white"
           >
              Получить код
           </button>
         )}
      </main>
      <TokenPanel tokens={tokens} config={state} isOpen={isTokenPanelOpen} onClose={() => setIsTokenPanelOpen(false)} />
      
      {/* Keyframes for the loading bar */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
