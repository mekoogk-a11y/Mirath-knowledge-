import React from 'react';
import {
  Calculator,
  BookOpen,
  Download,
  Sparkles,
  BookMarked,
  ShieldCheck,
  Layers,
  ArrowLeft,
  HeartHandshake,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroHomeProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16 text-right" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e382c] via-[#104335] to-[#0a2c22] text-[#fbf9f4] p-6 sm:p-10 lg:p-14 shadow-xl border border-[#c5a059]/40">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-emerald-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#f3e5ab] text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>منصة متخصصة في الفرائض والتركات والوقف وأحكامه</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-amiri tracking-tight leading-tight text-[#fdfbf7]">
            المواريث
          </h1>

          <p className="text-base sm:text-lg text-[#e8e4da] leading-relaxed max-w-2xl mx-auto font-sans">
            المنصة الإسلامية الشاملة لعلم الفرائض وحساب الأنصبة الشرعية بدقة قطعية، مع قسم متكامل في فقه الوقف وأحكامه ونظارته وقاموسه التخصصي.
          </p>

          {/* Primary Quick Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('calculator')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98"
            >
              <Calculator className="w-5 h-5 text-[#0e382c]" />
              <span>حاسبة المواريث المتقدمة</span>
            </button>

            <button
              onClick={() => onNavigate('endowment')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c5a059]/60 text-white font-semibold text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2 active:scale-98"
            >
              <Layers className="w-5 h-5 text-[#f3e5ab]" />
              <span>الوقف وأحكامه (18 باباً)</span>
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

      {/* Prominent Gateway Cards: "علم المواريث" & "الوقف وأحكامه" */}
      <section className="max-w-5xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">
            بوابات المنصة الرئيسية
          </h2>
          <p className="text-xs text-gray-500">اختر الوجهة التي تريد دراستها وحسابها</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gateway Card 1: علم المواريث */}
          <div className="bg-gradient-to-br from-white to-[#fbf9f4] rounded-3xl p-6 sm:p-8 border-2 border-[#0e382c]/20 hover:border-[#0e382c] transition-all shadow-md hover:shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0e382c] text-[#f3e5ab] flex items-center justify-center shadow-md">
                <Calculator className="w-6 h-6 text-[#c5a059]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-amiri text-[#0e382c]">
                  علم المواريث
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  تعلم أحكام الفرائض واحسب أنصبة الورثة بدقة قطعية مع أدلة الحجب والعول والرد وتوليد وثائق التوزيع الرسمية.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="w-full py-3 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
            >
              <span>دخول إلى المواريث</span>
              <ArrowLeft className="w-4 h-4 text-[#c5a059]" />
            </button>
          </div>

          {/* Gateway Card 2: الوقف وأحكامه */}
          <div className="bg-gradient-to-br from-white to-[#fbf9f4] rounded-3xl p-6 sm:p-8 border-2 border-[#c5a059]/40 hover:border-[#c5a059] transition-all shadow-md hover:shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059] text-[#0e382c] flex items-center justify-center shadow-md">
                <Layers className="w-6 h-6 text-[#0e382c]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-amiri text-[#0e382c]">
                  الوقف وأحكامه
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  تعلم أحكام الوقف وأنواعه ومصارفه، مع قاموس المصطلحات، ودليل إنشاء وقف بالخطوات، ونموذج التوثيق التعليمي القابل للطباعة.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('endowment')}
              className="w-full py-3 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
            >
              <span>دخول إلى الوقف</span>
              <ArrowLeft className="w-4 h-4 text-[#0e382c]" />
            </button>
          </div>
        </div>
      </section>

      {/* Quranic Verse Box */}
      <section className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#c5a059]/30 shadow-xs relative overflow-hidden text-center space-y-3">
        <div className="w-12 h-1 bg-[#c5a059] mx-auto rounded-full mb-3" />
        <p className="quran-verse text-lg sm:text-2xl text-[#0e382c] font-bold">
          ﴿ يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ﴾
        </p>
        <p className="text-xs text-gray-500 font-medium">سورة النساء — الآية 11</p>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto pt-1">
          "تولى الله تبارك وتعالى بنفسه تقدير الفرائض وتفصيلها في كتابه، رحمةً بعباده وقطعاً لمنابت الخلاف والخصومات."
        </p>
      </section>

      {/* 4 Platform Pillars Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            أركان منصة المواريث والوقف
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            صُمم التطبيق ليكون مرجعاً موثوقاً لطالب العلم والباحث والوارث والواقف
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Calculator */}
          <div
            onClick={() => onNavigate('calculator')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
                <Calculator className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="font-bold text-base text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
                حاسبة فرائض قطعية
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                محرك حسابي قطعي لا يخمن، يحسب أصول المسائل، والعول والرد وتصحيح الانكسار مع بيان علل الحجب.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#0e382c]">
              <span>فتح الحاسبة</span>
              <span>←</span>
            </div>
          </div>

          {/* Card 2: Book */}
          <div
            onClick={() => onNavigate('book')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="font-bold text-base text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
                كتاب الفرائض (28 فصلاً)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                منهج علمي مؤصل يشرح جميع أبواب الميراث: الفروض، العصبات، الحجب، الكلالة، والمناسخات بالأمثلة.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#0e382c]">
              <span>تصفح الكتاب</span>
              <span>←</span>
            </div>
          </div>

          {/* Card 3: Endowment */}
          <div
            onClick={() => onNavigate('endowment')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
                <Layers className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="font-bold text-base text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
                الوقف وأحكامه
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                18 باباً في فقه الوقف ومصارفه، مع قاموس المصطلحات ودليل إنشاء وقف ونموذج التوثيق وطباعة PDF.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#0e382c]">
              <span>دخول قسم الوقف</span>
              <span>←</span>
            </div>
          </div>

          {/* Card 4: Dictionary & Assistant */}
          <div
            onClick={() => onNavigate('dictionary')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#c5a059]/25 hover:border-[#c5a059] transition-all hover:shadow-md space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
                <BookMarked className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="font-bold text-base text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors">
                قاموس المصطلحات
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                معجم فرائضي ووقفي مبسط يشرح مصطلحات التركة، الكلالة، العول، الرد، ريع الوقف وعين الوقف.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#0e382c]">
              <span>فتح القاموس</span>
              <span>←</span>
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
              ثبّت التطبيق على شاشة هاتفك الرئيسية، واستخدم الحاسبة والكتاب وقسم الوقف كاملاً حتى بدون اتصال بالإنترنت.
            </p>
          </div>
        </div>
        <PWAInstallButton variant="primary" className="py-2.5 px-5 text-sm shrink-0" />
      </section>
    </div>
  );
};
