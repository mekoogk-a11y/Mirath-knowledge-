import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Home, ChevronLeft, ArrowUp } from 'lucide-react';
import { ActiveTab } from './Navbar';

export const TAB_NAMES: Record<ActiveTab, string> = {
  home: 'الرئيسية',
  calculator: 'حاسبة المواريث',
  book: 'كتاب الفرائض والمواريث',
  endowment: 'الوقف وأحكامه',
  dictionary: 'قاموس المصطلحات',
  assistant: 'المساعد الذكي',
  about: 'عن التطبيق',
  tests: 'الاختبارات الحسابية',
};

interface NavigationControllerProps {
  currentTab: ActiveTab;
  canGoBack: boolean;
  canGoForward: boolean;
  previousTabName?: string;
  nextTabName?: string;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
  subTitle?: string;
  onSubBack?: () => void;
}

export const NavigationController: React.FC<NavigationControllerProps> = ({
  currentTab,
  canGoBack,
  canGoForward,
  previousTabName,
  nextTabName,
  onGoBack,
  onGoForward,
  onGoHome,
  subTitle,
  onSubBack,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Breadcrumb & History Toolbar */}
      <div className="mb-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-[#c5a059]/30 shadow-xs flex flex-wrap items-center justify-between gap-3 text-right">
        {/* Back & Forward Buttons */}
        <div className="flex items-center gap-2">
          {/* Back Button (In RTL, ArrowRight points backwards) */}
          <button
            onClick={onSubBack || onGoBack}
            disabled={!canGoBack && !onSubBack}
            title={previousTabName ? `رجوع إلى ${previousTabName}` : 'رجوع للخلف'}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
              canGoBack || onSubBack
                ? 'bg-[#0e382c] text-white hover:bg-[#165644] shadow-xs'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-[#f3e5ab]" />
            <span>
              {onSubBack
                ? 'رجوع للقائمة'
                : previousTabName
                ? `رجوع: ${previousTabName}`
                : 'رجوع للخلف'}
            </span>
          </button>

          {/* Forward Button (In RTL, ArrowLeft points forward) */}
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            title={nextTabName ? `تقدم إلى ${nextTabName}` : 'تقدم للأمام'}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
              canGoForward
                ? 'bg-[#c5a059] text-[#0e382c] hover:bg-[#d8b56d] shadow-xs'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <span>{nextTabName ? `تقدم: ${nextTabName}` : 'تقدم للأمام'}</span>
            <ArrowLeft className="w-4 h-4 text-[#0e382c]" />
          </button>

          {/* Home Button if not on home */}
          {currentTab !== 'home' && (
            <button
              onClick={onGoHome}
              title="العودة إلى الصفحة الرئيسية"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <Home className="w-4 h-4 text-[#0e382c]" />
            </button>
          )}
        </div>

        {/* Current Location Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium overflow-hidden">
          <button
            onClick={onGoHome}
            className="hover:text-[#0e382c] font-semibold flex items-center gap-1 transition"
          >
            <Home className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>الرئيسية</span>
          </button>

          {currentTab !== 'home' && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-bold text-[#0e382c] truncate">
                {TAB_NAMES[currentTab]}
              </span>
            </>
          )}

          {subTitle && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                {subTitle}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Floating Fast-Navigation Dock (Fixed at bottom for easy thumb access on mobile & desktop) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="bg-[#0e382c]/95 backdrop-blur-md text-white rounded-full px-3 py-2 border-2 border-[#c5a059] shadow-2xl flex items-center gap-1.5 sm:gap-2">
          {/* Floating Back Button */}
          <button
            onClick={onSubBack || onGoBack}
            disabled={!canGoBack && !onSubBack}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-90 ${
              canGoBack || onSubBack
                ? 'bg-white/15 hover:bg-white/25 text-[#f3e5ab]'
                : 'text-gray-500 opacity-40 cursor-not-allowed'
            }`}
            title="رجوع للخلف"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">رجوع</span>
          </button>

          <div className="w-px h-4 bg-[#c5a059]/40" />

          {/* Floating Home Button */}
          <button
            onClick={onGoHome}
            className={`p-2 rounded-full transition active:scale-90 ${
              currentTab === 'home'
                ? 'bg-[#c5a059] text-[#0e382c]'
                : 'hover:bg-white/15 text-[#f3e5ab]'
            }`}
            title="الصفحة الرئيسية"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-[#c5a059]/40" />

          {/* Floating Forward Button */}
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-90 ${
              canGoForward
                ? 'bg-white/15 hover:bg-white/25 text-[#f3e5ab]'
                : 'text-gray-500 opacity-40 cursor-not-allowed'
            }`}
            title="تقدم للأمام"
          >
            <span className="hidden sm:inline">تقدم</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Scroll to Top */}
          {showScrollTop && (
            <>
              <div className="w-px h-4 bg-[#c5a059]/40" />
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full hover:bg-white/20 text-[#f3e5ab] transition active:scale-90"
                title="للأعلى"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
