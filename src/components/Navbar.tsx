import React from 'react';
import {
  BookOpen,
  Calculator,
  BookMarked,
  Sparkles,
  CheckCircle2,
  Home,
  Menu,
  X,
  Layers,
  Info,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab =
  | 'home'
  | 'calculator'
  | 'book'
  | 'endowment'
  | 'dictionary'
  | 'assistant'
  | 'about'
  | 'tests';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'calculator', label: 'حاسبة المواريث', icon: <Calculator className="w-4 h-4" /> },
    { id: 'book', label: 'كتاب المواريث', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'endowment', label: 'الوقف وأحكامه', icon: <Layers className="w-4 h-4 text-[#c5a059]" /> },
    { id: 'dictionary', label: 'قاموس المصطلحات', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'assistant', label: 'المساعد الذكي', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'عن التطبيق', icon: <Info className="w-4 h-4" /> },
    { id: 'tests', label: 'الاختبارات', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e382c]/95 backdrop-blur-md border-b border-[#c5a059]/30 text-[#fbf9f4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Navigation Back/Forward Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top Quick Back Button (In RTL, ArrowRight goes back) */}
            {onGoBack && (
              <div className="flex items-center bg-[#09291f]/80 p-1 rounded-xl border border-[#c5a059]/30">
                <button
                  onClick={onGoBack}
                  disabled={!canGoBack}
                  title="رجوع للخلف"
                  aria-label="رجوع للخلف"
                  className={`p-1.5 rounded-lg transition ${
                    canGoBack
                      ? 'text-[#f3e5ab] hover:bg-white/10 active:scale-95'
                      : 'text-gray-500 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="w-px h-3.5 bg-[#c5a059]/30 mx-0.5" />

                <button
                  onClick={onGoForward}
                  disabled={!canGoForward}
                  title="تقدم للأمام"
                  aria-label="تقدم للأمام"
                  className={`p-1.5 rounded-lg transition ${
                    canGoForward
                      ? 'text-[#f3e5ab] hover:bg-white/10 active:scale-95'
                      : 'text-gray-500 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Logo */}
            <div
              onClick={() => handleSelectTab('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#1c5d4b] to-[#0a2c22] border border-[#c5a059] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <span className="font-amiri text-[#f3e5ab] text-lg sm:text-xl font-bold">م</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-2xl font-bold font-amiri tracking-wide text-[#fdfbf7]">
                    المواريث
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-[#c5a059]/20 text-[#f3e5ab] border border-[#c5a059]/40 rounded-full px-1.5 sm:px-2 py-0.5 font-medium">
                    والوقف
                  </span>
                </div>
                <p className="text-[11px] text-[#e0ded8]/80 hidden md:block">
                  علم الفرائض والمواريث والوقف وأحكامه
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#09291f]/60 p-1.5 rounded-2xl border border-[#c5a059]/20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#c5a059] text-[#0e382c] font-bold shadow-sm'
                      : 'text-[#e8e4da] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screens (lg) Compact Navigation */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-[#09291f]/60 p-1.5 rounded-2xl border border-[#c5a059]/20">
            {navItems.slice(0, 5).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#c5a059] text-[#0e382c] font-bold shadow-sm'
                      : 'text-[#e8e4da] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleSelectTab('about')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-[#c5a059] text-[#0e382c] font-bold'
                  : 'text-[#e8e4da] hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>عن التطبيق</span>
            </button>
          </nav>

          {/* Actions & PWA Install Button & Search Trigger */}
          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09291f] hover:bg-[#0e3b2d] border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-medium transition shadow-xs active:scale-95"
                title="بحث سريع في كل محتويات التطبيق (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="hidden sm:inline">بحث</span>
                <span className="hidden md:inline bg-black/40 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#c5a059] border border-[#c5a059]/20">
                  Ctrl+K
                </span>
              </button>
            )}

            <PWAInstallButton
              variant="outline"
              className="hidden sm:inline-flex text-xs py-1.5 px-3"
              label="تثبيت التطبيق"
            />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#f3e5ab] hover:bg-white/10 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c5a059]/20 bg-[#0a2e24] px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {onOpenSearch && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#c5a059]/20 text-[#f3e5ab] border border-[#c5a059]/40 mb-1"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-[#c5a059]" />
                  <span>بحث سريع في كل الأبواب والمصطلحات</span>
                </div>
                <span className="text-[10px] bg-[#0e382c] px-2 py-0.5 rounded text-[#c5a059]">بحث</span>
              </button>
            )}

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#c5a059] text-[#0e382c] font-bold'
                      : 'text-[#f5f2eb] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#0e382c]" />}
                </button>
              );
            })}

            <div className="pt-2">
              <PWAInstallButton
                variant="primary"
                className="w-full py-2.5 text-xs sm:text-sm"
                label="تثبيت تطبيق المواريث على الهاتف"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
