import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { Calculator } from './components/Calculator';
import { BookReader } from './components/BookReader';
import { EndowmentSection } from './components/EndowmentSection';
import { DictionaryView } from './components/DictionaryView';
import { SmartAssistantView } from './components/SmartAssistantView';
import { EngineTestsView } from './components/EngineTestsView';
import { AboutView } from './components/AboutView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NavigationController, TAB_NAMES } from './components/NavigationController';
import { MessageCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [history, setHistory] = useState<ActiveTab[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Sub-navigation state for inner card/chapter readers
  const [subTitle, setSubTitle] = useState<string | undefined>(undefined);
  const [subBackHandler, setSubBackHandler] = useState<(() => void) | undefined>(undefined);

  const activeTab = history[historyIndex] || 'home';

  // Navigate to a specific tab
  const navigateTo = useCallback(
    (tab: ActiveTab) => {
      // Clear any sub-title / inner back handler
      setSubTitle(undefined);
      setSubBackHandler(undefined);

      if (tab === activeTab) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setHistory((prevHistory) => {
        const nextHistory = prevHistory.slice(0, historyIndex + 1);
        nextHistory.push(tab);
        const nextIndex = nextHistory.length - 1;
        setHistoryIndex(nextIndex);
        try {
          window.history.pushState({ index: nextIndex, tab }, '', `#${tab}`);
        } catch (e) {
          // ignore potential iframe restrictions
        }
        return nextHistory;
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeTab, historyIndex]
  );

  // Go Back
  const goBack = useCallback(() => {
    if (subBackHandler) {
      subBackHandler();
      setSubBackHandler(undefined);
      setSubTitle(undefined);
      return;
    }

    if (historyIndex > 0) {
      setSubTitle(undefined);
      setSubBackHandler(undefined);
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      try {
        window.history.back();
      } catch (e) {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab !== 'home') {
      navigateTo('home');
    }
  }, [subBackHandler, historyIndex, activeTab, navigateTo]);

  // Go Forward
  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setSubTitle(undefined);
      setSubBackHandler(undefined);
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      try {
        window.history.forward();
      } catch (e) {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [historyIndex, history.length]);

  // Go Home directly
  const goHome = useCallback(() => {
    setSubTitle(undefined);
    setSubBackHandler(undefined);
    navigateTo('home');
  }, [navigateTo]);

  // Listen to browser popstate (back/forward keys & gestures)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.index === 'number') {
        const targetIndex = event.state.index;
        if (targetIndex >= 0 && targetIndex < history.length) {
          setHistoryIndex(targetIndex);
          setSubTitle(undefined);
          setSubBackHandler(undefined);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history.length]);

  const canGoBack = historyIndex > 0 || activeTab !== 'home' || !!subBackHandler;
  const canGoForward = historyIndex < history.length - 1;

  const previousTab =
    historyIndex > 0
      ? history[historyIndex - 1]
      : activeTab !== 'home'
      ? 'home'
      : undefined;

  const nextTab = historyIndex < history.length - 1 ? history[historyIndex + 1] : undefined;

  const previousTabName = previousTab ? TAB_NAMES[previousTab] : undefined;
  const nextTabName = nextTab ? TAB_NAMES[nextTab] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-islamic-pattern text-[#1c2925] selection:bg-[#c5a059]/20 selection:text-[#0e382c]">
      {/* Top Navbar with quick Back/Forward buttons */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={goBack}
        onGoForward={goForward}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Navigation Breadcrumb, Back/Forward & Floating Action Bar */}
        <NavigationController
          currentTab={activeTab}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          previousTabName={previousTabName}
          nextTabName={nextTabName}
          onGoBack={goBack}
          onGoForward={goForward}
          onGoHome={goHome}
          subTitle={subTitle}
          onSubBack={subBackHandler}
        />

        {/* View Switching */}
        {activeTab === 'home' && <HeroHome onNavigate={navigateTo} />}
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'book' && (
          <BookReader
            onChapterSelect={(title) => {
              setSubTitle(title);
              setSubBackHandler(() => () => {
                setSubTitle(undefined);
                setSubBackHandler(undefined);
              });
            }}
          />
        )}
        {activeTab === 'endowment' && (
          <EndowmentSection
            onNavigateHome={goHome}
            onSubStateChange={(title, onBack) => {
              setSubTitle(title);
              setSubBackHandler(() => onBack);
            }}
          />
        )}
        {activeTab === 'dictionary' && <DictionaryView />}
        {activeTab === 'assistant' && <SmartAssistantView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'tests' && <EngineTestsView />}
      </main>

      {/* Offline Alert Badge if connection is lost */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="mt-auto bg-[#0a271f] text-[#fbf9f4] border-t border-[#c5a059]/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          {/* Logo & App Info */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c5d4b] to-[#09291f] border border-[#c5a059] flex items-center justify-center shadow-md">
              <span className="font-amiri text-[#f3e5ab] text-2xl font-bold">م</span>
            </div>
            <h3 className="font-bold text-2xl font-amiri text-[#fdfbf7]">
              المواريث والوقف وأحكامهما
            </h3>
            <p className="text-xs text-[#dcd7cb] max-w-lg mx-auto leading-relaxed">
              منصة إسلامية تخصصية تجمع بين علم الفرائض وحاسبة التركات، وقسم متكامل في فقه الوقف وأحكامه ونظارته ومصارفه.
            </p>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-[#f3e5ab]">
            <button onClick={() => navigateTo('home')} className="hover:underline">
              الرئيسية
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('calculator')} className="hover:underline">
              حاسبة المواريث
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('book')} className="hover:underline">
              كتاب الفرائض (28 فصلاً)
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('endowment')} className="hover:underline text-white font-bold">
              الوقف وأحكامه
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('dictionary')} className="hover:underline">
              قاموس المصطلحات
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('assistant')} className="hover:underline">
              المساعد الذكي
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('about')} className="hover:underline">
              عن التطبيق
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('tests')} className="hover:underline">
              الاختبارات الحسابية
            </button>
          </div>

          {/* Official Credits, Dedication, and WhatsApp Contact */}
          <div className="pt-6 border-t border-[#c5a059]/25 max-w-2xl mx-auto space-y-3">
            <div className="text-sm font-semibold text-[#fdfbf7] flex flex-wrap items-center justify-center gap-2">
              <span>تصميم وتطوير: كمال جعفر زكريا</span>
              <span className="text-[#c5a059]">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span>واتساب:</span>
                <a
                  href="https://wa.me/249919980435"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f3e5ab] hover:underline font-bold font-mono inline-flex items-center gap-1"
                >
                  00249919980435
                  <ExternalLink className="w-3 h-3 text-[#c5a059]" />
                </a>
              </span>
            </div>

            <div className="text-xs text-[#c5a059] font-amiri font-bold text-sm tracking-wide">
              إهداء إلى وزارة الأوقاف – جمهورية السودان
            </div>
          </div>

          {/* Sharia Reminder */}
          <div className="pt-3 border-t border-[#c5a059]/15 text-[11px] text-[#b3ae9f] max-w-xl mx-auto space-y-1">
            <p>
              ﴿ تِلْكَ حُدُودُ اللَّهِ وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ يُدْخِلْهُ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ﴾
            </p>
            <p className="text-[10px] text-[#8e8a7d]">
              التطبيق مرجع شرعي وحسابي استرشادي وفق مذهب جمهور الفقهاء الأربعة. في حال النزاعات أو الإجراءات الرسمية، يرجى التوجه للمحاكم الشرعية ووزارات الأوقاف المختصة.
            </p>
          </div>

          <div className="pt-1 text-[10px] text-[#7d7a6f]">
            المواريث © {new Date().getFullYear()} — تطبيق ويب تقدمي (PWA) قابل للتثبيت
          </div>
        </div>
      </footer>
    </div>
  );
}
