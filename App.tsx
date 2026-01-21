
import React, { useState, useMemo, useEffect } from 'react';
import { AppState } from './types';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import TokenPanel from './components/TokenPanel';
import { generateSystem } from './services/systemGenerator';

const App: React.FC = () => {
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
  const [state, setState] = useState<AppState>({
    baseHue: 220,
    baseChroma: 0.15,
    baseLightness: 0.6,
    baseRole: 'accent',
    mode: 'light',
    useGradient: true,
    gradientIntensity: 25,
    gradientAngle: 165,
    useSecondaryHue: false,
    secondaryHue: 260,
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Inter'
    },
    content: {
      heroTag: 'ЭКСКЛЮЗИВНЫЙ ОПЫТ',
      heroTitle: 'Будущее создается\nв тишине',
      heroSubtitle: 'Проектируем глубокие трансформационные путешествия для лидеров и команд. Мы объединяем когнитивную психологию, биохакинг и силу природы для кратного роста вашего видения.',
      card1Title: 'Нейробаланс',
      card1Text: 'Научные методики восстановления фокуса и снятия хронического напряжения в условиях полной неопределенности.',
      card2Title: 'Радикальная стратегия',
      card2Text: 'Модерируемые сессии в изоляции для поиска нестандартных решений и формирования долгосрочного вектора развития.',
      card3Title: 'Экосистема доверия',
      card3Text: 'Создание непоколебимой связи внутри коллектива через совместное преодоление барьеров и сонастройку ценностей.',
      footerText: 'Наша миссия — превратить человеческий капитал в осознанное сообщество, способное менять реальность через инновации и внутренний покой.',
      articleTitle: 'Искусство глубокой фокусировки в эпоху цифрового шума',
      articleLead: 'В мире, где внимание стало самым дорогим ресурсом, способность к глубокой работе отделяет визионеров от исполнителей. Мы исследуем механизмы восстановления когнитивного ресурса.',
      articleBody: 'Постоянные уведомления и фрагментация задач приводят к состоянию "внимательного истощения". Исследования показывают, что после каждого прерывания мозгу требуется до 23 минут, чтобы вернуться к состоянию глубокого потока. Мы разработали систему архитектурной тишины, которая позволяет мозгу переключиться из режима "выживания" в режим "созидания". Этот процесс требует не просто отсутствия звука, но правильной визуальной и сенсорной среды.',
      articleQuote: 'Тишина — это не пустота. Это пространство, где рождаются ответы, которые не слышны в суете.',
      articleAuthor: 'Марк Оливер, PhD'
    }
  });

  const tokens = useMemo(() => generateSystem(state), [state]);

  // Динамическая загрузка шрифтов Google Fonts
  useEffect(() => {
    const linkId = 'dynamic-google-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const headingFont = state.typography.headingFont.replace(/\s+/g, '+');
    const bodyFont = state.typography.bodyFont.replace(/\s+/g, '+');
    
    const url = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@700;800;900&family=${bodyFont}:wght@400;500;600&display=swap`;
    
    link.href = url;
  }, [state.typography]);

  const updateContent = (key: string, value: string) => {
    setState(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 relative font-sans">
      <Sidebar state={state} onChange={setState} />
      
      <main className="flex-1 relative overflow-hidden bg-slate-50 p-6">
         <div className="w-full h-full rounded-[3rem] shadow-2xl overflow-hidden bg-white border border-slate-200">
            <Preview tokens={tokens} config={state} onContentChange={updateContent} />
         </div>

         {/* Понятная кнопка экспорта */}
         <button 
           onClick={() => setIsTokenPanelOpen(true)}
           className="absolute top-12 right-12 z-40 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 font-black text-xs tracking-widest uppercase"
         >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Получить код
         </button>
      </main>

      {isTokenPanelOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-40 transition-opacity"
          onClick={() => setIsTokenPanelOpen(false)}
        ></div>
      )}

      <TokenPanel 
        tokens={tokens} 
        isOpen={isTokenPanelOpen} 
        onClose={() => setIsTokenPanelOpen(false)} 
      />
    </div>
  );
};

export default App;
