import React from 'react';
import { BookOpen, Calculator, BookMarked, Sparkles, CheckCircle2, Home, Menu, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'home' | 'calculator' | 'book' | 'dictionary' | 'assistant' | 'tests';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'calculator', label: 'حاسبة المواريث', icon: <Calculator className="w-4 h-4" /> },
    { id: 'book', label: 'كتاب الفرائض (28 فصلاً)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dictionary', label: 'القاموس', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'assistant', label: 'المساعد الذكي', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tests', label: 'الاختبارات الحسابية', icon: <CheckCircle2 className="w-4 h-4" /> },
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
          
          {/* Logo & App Name */}
          <div
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#1c5d4b] to-[#0a2c22] border border-[#c5a059] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="font-amiri text-[#f3e5ab] text-xl font-bold">م</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-amiri tracking-wide text-[#fdfbf7]">
                  المواريث
                </span>
                <span className="text-[10px] uppercase tracking-wider bg-[#c5a059]/20 text-[#f3e5ab] border border-[#c5a059]/40 rounded-full px-2 py-0.5 font-medium">
                  علم الفرائض
                </span>
              </div>
              <p className="text-[11px] text-[#e0ded8]/80 hidden sm:block">
                الحساب الشرعي القطعي والمنهج التأصيلي
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#09291f]/60 p-1.5 rounded-2xl border border-[#c5a059]/20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
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

          {/* Actions & PWA Install Button */}
          <div className="flex items-center gap-2">
            <PWAInstallButton
              variant="outline"
              className="hidden sm:inline-flex text-xs py-2 px-3.5"
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
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
                className="w-full py-3 text-sm"
                label="تثبيت تطبيق المواريث على الهاتف"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
