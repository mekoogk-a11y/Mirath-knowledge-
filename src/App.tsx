import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { Calculator } from './components/Calculator';
import { BookReader } from './components/BookReader';
import { DictionaryView } from './components/DictionaryView';
import { SmartAssistantView } from './components/SmartAssistantView';
import { EngineTestsView } from './components/EngineTestsView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { BookOpen, Calculator as CalcIcon, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  return (
    <div className="min-h-screen flex flex-col bg-islamic-pattern text-[#1c2925] selection:bg-[#c5a059]/20 selection:text-[#0e382c]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {activeTab === 'home' && <HeroHome onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'book' && <BookReader />}
        {activeTab === 'dictionary' && <DictionaryView />}
        {activeTab === 'assistant' && <SmartAssistantView />}
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
              المواريث
            </h3>
            <p className="text-xs text-[#dcd7cb] max-w-md mx-auto">
              تطبيق إسلامي تخصصي مؤصل في علم الفرائض وقسمة التركات في الإسلام، مع حاسبة قطعية وكتاب تعليمي كامل من 28 فصلاً.
            </p>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#f3e5ab]">
            <button onClick={() => setActiveTab('home')} className="hover:underline">
              الرئيسية
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('calculator')} className="hover:underline">
              حاسبة المواريث
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('book')} className="hover:underline">
              كتاب الفرائض (28 فصلاً)
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('dictionary')} className="hover:underline">
              قاموس المصطلحات
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('assistant')} className="hover:underline">
              المساعد الذكي
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('tests')} className="hover:underline">
              الاختبارات الحسابية
            </button>
          </div>

          {/* Sharia Reminder */}
          <div className="pt-4 border-t border-[#c5a059]/20 text-[11px] text-[#b3ae9f] max-w-xl mx-auto space-y-1">
            <p>
              ﴿ تِلْكَ حُدُودُ اللَّهِ وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ يُدْخِلْهُ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ﴾
            </p>
            <p className="text-[10px] text-[#8e8a7d]">
              الحاسبة مرجع شرعي وحسابي استرشادي وفق مذهب جمهور الفقهاء الأربعة. في حال النزاعات أو الإجراءات الرسمية، يرجى التوجه للمحاكم الشرعية المختصة.
            </p>
          </div>

          <div className="pt-2 text-[11px] text-[#7d7a6f]">
            المواريث © {new Date().getFullYear()} — تطبيق ويب تقدمي (PWA) قابل للتثبيت
          </div>
        </div>
      </footer>
    </div>
  );
}
