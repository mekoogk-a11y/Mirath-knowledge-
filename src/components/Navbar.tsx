import React, { useState } from 'react';
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
  FolderKanban,
  FileCheck,
  FileCheck2,
  FileText,
  Bell,
  Settings,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { platformStore } from '../data/platformStore';

export type ActiveTab =
  | 'home'
  | 'calculator'
  | 'estates'
  | 'waqf'
  | 'documents'
  | 'reviews'
  | 'reports'
  | 'alerts'
  | 'settings'
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
  const currentUser = platformStore.getCurrentUser();
  const unreadAlertsCount = platformStore.getAlerts().filter((a) => !a.isRead).length;

  // Primary navigation items on top bar
  const mainNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'calculator', label: 'حاسبة الميراث', icon: <Calculator className="w-4 h-4" /> },
    { id: 'estates', label: 'ملفات التركات', icon: <FolderKanban className="w-4 h-4 text-[#c5a059]" /> },
    { id: 'waqf', label: 'إدارة الوقف', icon: <Layers className="w-4 h-4" /> },
    { id: 'documents', label: 'المستندات', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'reviews', label: 'المراجعات', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'reports', label: 'التقارير', icon: <FileText className="w-4 h-4" /> },
    { id: 'book', label: 'كتاب الفرائض', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'endowment', label: 'أحكام الوقف', icon: <BookMarked className="w-4 h-4" /> },
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
                  <span className="text-base sm:text-xl font-bold font-amiri tracking-wide text-[#fdfbf7]">
                    منصة الميراث والوقف
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#c5a059] hidden sm:block">
                  معرفة أوضح · إدارة منظمة · أثر مستمر
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#09291f]/60 p-1.5 rounded-2xl border border-[#c5a059]/20">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
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
            {mainNavItems.slice(0, 5).map((item) => {
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
          </nav>

          {/* Actions: Role Badge + Alerts Bell + Search + PWA */}
          <div className="flex items-center gap-2">
            {/* User Role Indicator Pill */}
            <button
              onClick={() => handleSelectTab('settings')}
              title={`الدور الحالي: ${currentUser.roleTitle} (${currentUser.name}) - انقر للتبديل`}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#09291f] hover:bg-[#0e3b2d] border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-medium transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="font-semibold">{currentUser.roleTitle}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => handleSelectTab('alerts')}
              className="relative p-2 rounded-xl bg-[#09291f] hover:bg-[#0e3b2d] border border-[#c5a059]/40 text-[#f3e5ab] transition shadow-xs"
              title="التنبيهات ومواعيد الاستحقاق"
            >
              <Bell className="w-4 h-4 text-[#c5a059]" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Quick Search Trigger */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09291f] hover:bg-[#0e3b2d] border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-medium transition shadow-xs active:scale-95"
                title="بحث سريع في كل محتويات المنصة (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="hidden sm:inline">بحث</span>
                <span className="hidden md:inline bg-black/40 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#c5a059] border border-[#c5a059]/20">
                  Ctrl+K
                </span>
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#09291f] text-[#f3e5ab] hover:bg-white/10 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c5a059]/20 bg-[#0a271f] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* User Role Card */}
          <div
            onClick={() => handleSelectTab('settings')}
            className="p-3 bg-[#09291f] rounded-xl border border-[#c5a059]/30 flex items-center justify-between text-xs text-[#f3e5ab] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c5a059]" />
              <div>
                <span className="font-bold block">{currentUser.roleTitle}: {currentUser.name}</span>
                <span className="text-[10px] text-gray-300">انقر لتبديل الدور والصلاحيات</span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>

          {/* Group 1: الخدمات الرئيسية */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block px-2">
              الخدمات الرئيسية للمنصة:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
                { id: 'calculator', label: 'حاسبة الميراث', icon: <Calculator className="w-4 h-4" /> },
                { id: 'estates', label: 'ملفات التركات', icon: <FolderKanban className="w-4 h-4 text-[#c5a059]" /> },
                { id: 'waqf', label: 'إدارة الوقف', icon: <Layers className="w-4 h-4" /> },
                { id: 'documents', label: 'المستندات', icon: <FileCheck className="w-4 h-4" /> },
                { id: 'reviews', label: 'المراجعات', icon: <FileCheck2 className="w-4 h-4" /> },
                { id: 'reports', label: 'التقارير', icon: <FileText className="w-4 h-4" /> },
                { id: 'alerts', label: 'التنبيهات', icon: <Bell className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-right transition ${
                    activeTab === item.id
                      ? 'bg-[#c5a059] text-[#0e382c]'
                      : 'bg-white/5 text-[#fbf9f4] hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: المعرفة الشرعية */}
          <div className="space-y-1 pt-2 border-t border-[#c5a059]/20">
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block px-2">
              المعرفة والتعليم الشرعي:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'book', label: 'كتاب الفرائض (28 فصلاً)', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'endowment', label: 'الوقف وأحكامه', icon: <Layers className="w-4 h-4" /> },
                { id: 'dictionary', label: 'قاموس المصطلحات', icon: <BookMarked className="w-4 h-4" /> },
                { id: 'assistant', label: 'المساعد الذكي', icon: <Sparkles className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-right transition ${
                    activeTab === item.id
                      ? 'bg-[#c5a059] text-[#0e382c]'
                      : 'bg-white/5 text-[#fbf9f4] hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: النظام والحساب */}
          <div className="space-y-1 pt-2 border-t border-[#c5a059]/20">
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block px-2">
              النظام والحساب:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'settings', label: 'الصلاحيات والإعدادات', icon: <Settings className="w-4 h-4" /> },
                { id: 'tests', label: 'الاختبارات الحسابية', icon: <CheckCircle2 className="w-4 h-4" /> },
                { id: 'about', label: 'عن المنصة والمطور', icon: <Info className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-right transition ${
                    activeTab === item.id
                      ? 'bg-[#c5a059] text-[#0e382c]'
                      : 'bg-white/5 text-[#fbf9f4] hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
