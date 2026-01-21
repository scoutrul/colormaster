
import React, { useState, useMemo, useEffect } from 'react';
import { AppState } from './types';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import TokenPanel from './components/TokenPanel';
import { generateSystem } from './services/systemGenerator';

const App: React.FC = () => {
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
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
    
    // Формируем URL для Google Fonts с поддержкой всех необходимых весов и кириллицы
    const fontConfigs = [
      `${bodyFont.replace(/\s+/g, '+')}:wght@400;700;800`,
      `${editorialFont.replace(/\s+/g, '+')}:ital,wght@0,400;0,700;1,400`,
      `${displayFont.replace(/\s+/g, '+')}:wght@400;700;900`
    ];

    const url = `https://fonts.googleapis.com/css2?${fontConfigs.map(f => `family=${f}`).join('&')}&display=swap`;
    
    link.href = url;
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
         <div className="w-full h-full rounded-[3rem] shadow-2xl overflow-hidden bg-white border border-slate-200">
            <Preview tokens={tokens} config={state} onContentChange={updateContent} />
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
    </div>
  );
};

export default App;
