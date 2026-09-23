import React from 'react';
import { Calculator, BookOpen, Download, Sparkles, BookMarked, CheckCircle, ShieldCheck } from 'lucide-react';
import { ActiveTab } from './Navbar';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroHomeProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e382c] via-[#104335] to-[#0a2c22] text-[#fbf9f4] p-6 sm:p-10 lg:p-14 shadow-xl border border-[#c5a059]/40">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-emerald-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#f3e5ab] text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>تطبيق إسلامي تخصصي مؤصل في علم الفرائض وقسمة التركات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-amiri tracking-tight leading-tight text-[#fdfbf7]">
            المواريث
          </h1>

          <p className="text-base sm:text-lg text-[#e8e4da] leading-relaxed max-w-2xl mx-auto font-sans">
            منصة متخصصة وشاملة لتعلم علم الفرائض وحساب الأنصبة الشرعية بدقة رياضية قطعية، مع كتاب تعليمي كامل من 28 فصلاً، وبيان علل الحجب وسهام أصحاب الفروض والعصبات.
          </p>

          {/* Primary 3 Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('calculator')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
            >
              <Calculator className="w-5 h-5 text-[#0e382c]" />
              <span>حاسبة المواريث المتقدمة</span>
            </button>

            <button
              onClick={() => onNavigate('book')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c5a059]/50 text-white font-semibold text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2 active:scale-98"
            >
              <BookOpen className="w-5 h-5 text-[#f3e5ab]" />
              <span>تعلم الفرائض (28 فصلاً)</span>
            </button>

            <div className="w-full sm:w-auto">
              <PWAInstallButton
                variant="outline"
                className="w-full py-3.5 px-6 text-base font-semibold bg-white/5 border-[#c5a059]/60 text-[#f3e5ab] hover:bg-white/10"
                label="تثبيت التطبيق على الهاتف"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quranic Verse Box */}
      <section className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#c5a059]/30 shadow-sm relative overflow-hidden text-center space-y-3">
        <div className="w-12 h-1 bg-[#c5a059] mx-auto rounded-full mb-3" />
        <p className="quran-verse text-lg sm:text-2xl text-[#0e382c] font-bold">
          ﴿ يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ﴾
        </p>
        <p className="text-xs text-gray-500 font-medium">سورة النساء — الآية 11</p>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto pt-1">
          "تولى الله تبارك وتعالى بنفسه تقدير الفرائض وتفصيلها في كتابه، رحمةً بعباده وقطعاً لمنابت الخلاف والخصومات."
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            أركان منصة المواريث
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            صُمم التطبيق ليكون مرجعاً موثوقاً لطالب العلم والباحث والوارث
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Calculator */}
          <div
            onClick={() => onNavigate('calculator')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 text-right"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
              <Calculator className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-lg text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
              حاسبة فرائض قطعية
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              محرك حسابي منطقي مستقل لا يعتمد على التخمين، يحسب أصول المسائل، والعول، والرد، وتصحيح الانكسار، وحالات الحجب بالأدلة الشرعية.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0e382c]">
              <span>فتح الحاسبة</span>
              <span className="text-sm">←</span>
            </div>
          </div>

          {/* Card 2: Book */}
          <div
            onClick={() => onNavigate('book')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 text-right"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-lg text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
              كتاب الفرائض (28 فصلاً)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              منهج تعليمي شامل ومفصل يشرح جميع أبواب الميراث: أصحاب الفروض، العصبات، الحجب، الكلالة، الأخطاء الشائعة، والوصية.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0e382c]">
              <span>تصفح الكتاب</span>
              <span className="text-sm">←</span>
            </div>
          </div>

          {/* Card 3: Dictionary & Assistant */}
          <div
            onClick={() => onNavigate('dictionary')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 text-right"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
              <BookMarked className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-lg text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
              قاموس مصطلحات المواريث
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              معجم فرائضي مبسط لشرح مصطلحات التركة، الكلالة، العول، الرد، أصل المسألة، التخارج، والمناسخات مع الأمثلة التوضيحية.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0e382c]">
              <span>فتح القاموس</span>
              <span className="text-sm">←</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offline & PWA Banner */}
      <section className="max-w-5xl mx-auto bg-gradient-to-r from-[#f7f4ec] to-[#f2ede0] rounded-2xl p-6 border border-[#c5a059]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#0e382c] text-[#c5a059] flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0e382c]">تطبيق ويب تقدمي (PWA) قابل للتثبيت</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              ثبّت التطبيق على شاشة هاتفك الرئيسية، واستخدم الحاسبة والكتاب كاملاً في أي وقت حتى بدون اتصال بالإنترنت.
            </p>
          </div>
        </div>
        <PWAInstallButton variant="primary" className="py-2.5 px-5 text-sm shrink-0" />
      </section>
    </div>
  );
};
