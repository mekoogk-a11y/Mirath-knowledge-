import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  BookOpen,
  Download,
  Sparkles,
  BookMarked,
  ShieldCheck,
  Layers,
  ArrowLeft,
  Search,
  CheckCircle2,
  Scale,
  Award,
  BookCheck,
  History,
  CornerDownLeft,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { PWAInstallButton } from './PWAInstallButton';
import { calculateInheritance } from '../engine/farayedEngine';

interface HeroHomeProps {
  onNavigate: (
    tab: ActiveTab,
    payload?: { chapterId?: number; endowmentId?: string; presetKey?: string }
  ) => void;
  onOpenSearch?: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onNavigate, onOpenSearch }) => {
  // Quick interactive simulation state on the hero home
  const [quickGender, setQuickGender] = useState<'male' | 'female'>('male');
  const [quickEstate, setQuickEstate] = useState<number>(120000);
  const [quickWives, setQuickWives] = useState<number>(1);
  const [quickHusband, setQuickHusband] = useState<boolean>(false);
  const [quickSons, setQuickSons] = useState<number>(1);
  const [quickDaughters, setQuickDaughters] = useState<number>(2);
  const [quickMother, setQuickMother] = useState<boolean>(true);
  const [quickFather, setQuickFather] = useState<boolean>(false);

  // Compute live preview
  const liveResult = React.useMemo(() => {
    return calculateInheritance({
      deceasedGender: quickGender,
      estateValue: quickEstate,
      currency: 'ريال',
      hasHusband: quickGender === 'female' ? quickHusband : false,
      wivesCount: quickGender === 'male' ? quickWives : 0,
      hasFather: quickFather,
      hasMother: quickMother,
      hasPaternalGrandfather: false,
      hasPaternalGrandmother: false,
      hasMaternalGrandmother: false,
      sonsCount: quickSons,
      daughtersCount: quickDaughters,
      sonsOfSonsCount: 0,
      daughtersOfSonsCount: 0,
      fullBrothersCount: 0,
      fullSistersCount: 0,
      paternalBrothersCount: 0,
      paternalSistersCount: 0,
      maternalBrothersCount: 0,
      maternalSistersCount: 0,
    });
  }, [quickGender, quickEstate, quickWives, quickHusband, quickSons, quickDaughters, quickMother, quickFather]);

  return (
    <div className="space-y-14 pb-20 text-right font-sans" dir="rtl">
      {/* 1. Grand Archival Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#09261e] via-[#0e382c] to-[#082019] text-[#fbf9f4] p-6 sm:p-12 lg:p-16 shadow-2xl border-2 border-[#c5a059]/40">
        {/* Islamic Subtle Background Pattern */}
        <div className="absolute inset-0 bg-emerald-pattern opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Top Label */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/50 text-[#f3e5ab] text-xs sm:text-sm font-medium shadow-inner">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>المنصة الإسلامية التخصصية الكبرى في علم الفرائض والمواريث والوقف الشرعي</span>
          </div>

          {/* Majestic Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-amiri tracking-tight leading-tight text-[#fdfbf7]">
              المواريث والوقف وأحكامهما
            </h1>
            <p className="text-xs sm:text-sm text-[#c5a059] font-medium tracking-wide">
              حساب الأنصبة الشرعية بدقة قطعية · 28 فصلاً فقهياً مؤصلاً · موسوعة الوقف ونظارته
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#e8e4da]/90 leading-relaxed max-w-3xl mx-auto font-sans">
            مرجع علمي وبحثي موثوق لقسمة التركات الشرعية، حساب أصول المسائل، أحكام العول والرد وتصحيح الانكسار، مع دراسة فقه الوقف وأركانه وشروطه وصيغه الرسمية.
          </p>

          {/* Quick Search Bar in Hero */}
          <div className="max-w-2xl mx-auto pt-1">
            <div
              onClick={onOpenSearch}
              className="bg-white/10 hover:bg-white/15 border border-[#c5a059]/60 hover:border-[#c5a059] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-md group backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#f3e5ab] group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-gray-200">
                  ابحث في الفصول، أو المسائل الشهيرة، أو أحكام الوقف، أو المصطلحات...
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-[#09261e]/80 border border-[#c5a059]/40 text-[#f3e5ab] text-[11px] px-2.5 py-1 rounded-lg font-mono">
                <span>Ctrl + K</span>
              </div>
            </div>
          </div>

          {/* Primary Quick Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('calculator')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-98"
            >
              <CalcIcon className="w-5 h-5 text-[#0e382c]" />
              <span>دخول حاسبة المواريث المتقدمة</span>
            </button>

            <button
              onClick={() => onNavigate('endowment')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c5a059]/70 text-[#fdfbf7] font-semibold text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Layers className="w-5 h-5 text-[#f3e5ab]" />
              <span>موسوعة الوقف وأحكامه (18 باباً)</span>
            </button>

            <div className="w-full sm:w-auto">
              <PWAInstallButton
                variant="outline"
                className="w-full py-3.5 px-6 text-base font-semibold bg-white/5 border-[#c5a059]/60 text-[#f3e5ab] hover:bg-white/10"
                label="تثبيت التطبيق"
              />
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto border-t border-[#c5a059]/20 text-center">
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold font-amiri text-[#f3e5ab]">28 باباً</span>
              <span className="text-[11px] text-gray-300">في كتاب الفرائض</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold font-amiri text-[#f3e5ab]">18 باباً</span>
              <span className="text-[11px] text-gray-300">في أحكام ونظارة الوقف</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold font-amiri text-[#f3e5ab]">100% قطعي</span>
              <span className="text-[11px] text-gray-300">حسابات شرعية بلا تخمين</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-xl sm:text-2xl font-bold font-amiri text-[#f3e5ab]">عمل دون إنترنت</span>
              <span className="text-[11px] text-gray-300">تطبيق PWA مستقل وسريع</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Landmark Historical Inheritance Cases (قضايا الصحابة والمسائل الفرائضية الكبرى) */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
            <History className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>تطبيقات إجماع الصحابة وأئمة الفقه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            أشهر المسائل الفرائضية الكبرى
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            مسائل تاريخية مشهورة أفتى فيها كبار الصحابة رضوان الله عليهم، يمكنك الاطلاع على تأصيلها وحسابها بضغطة زر واحدة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Landmark 1: Umariyyah */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#c5a059]/30 hover:border-[#c5a059] transition-all shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-[#c5a059]/15 text-[#0e382c] px-2.5 py-0.5 rounded-full border border-[#c5a059]/30">
                  إجماع الصحابة
                </span>
                <span className="text-xs text-gray-400 font-mono">01</span>
              </div>
              <h3 className="text-lg font-bold font-amiri text-[#0e382c]">
                المسألة الغرّاوية (العُمريتان)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>الورثة:</strong> زوج وأم وأب.<br />
                قضى فيها أمير المؤمنين عمر بن الخطاب وزيد بن ثابت بأن للأم <em>ثلث الباقي</em> بعد فرض الزوج، لئلا يفضل نصيب الأنثى على الذكر المساوي.
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator', { presetKey: 'umariyyah' })}
              className="w-full py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#165a46] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <span>احسب المسألة الغراوية الآن</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>

          {/* Landmark 2: Manbariyyah */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#c5a059]/30 hover:border-[#c5a059] transition-all shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  العول إلى 27
                </span>
                <span className="text-xs text-gray-400 font-mono">02</span>
              </div>
              <h3 className="text-lg font-bold font-amiri text-[#0e382c]">
                المسألة المنبرية
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>الورثة:</strong> زوجة وبنتان وأب وأم.<br />
                سُئل عنها أمير المؤمنين علي بن أبي طالب رضي الله عنه وهو يخطب على المنبر في الكوفة، فأجاب بديهة: "صار ثمنها تسعاً".
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator', { presetKey: 'manbariyyah' })}
              className="w-full py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#165a46] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <span>احسب المسألة المنبرية الآن</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>

          {/* Landmark 3: Sons and Daughters Asabah */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#c5a059]/30 hover:border-[#c5a059] transition-all shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  عصبة بالغير
                </span>
                <span className="text-xs text-gray-400 font-mono">03</span>
              </div>
              <h3 className="text-lg font-bold font-amiri text-[#0e382c]">
                مسألة الأبناء والبنات
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>الورثة:</strong> زوجة وأم وابنان وبنتان.<br />
                تطبيق مباشر لقوله تعالى: ﴿لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ﴾ بعد أخذ الزوجة الثمن والأم السدس لوجود الفرع الوارث.
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator', { presetKey: 'wife_sons_daughters' })}
              className="w-full py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#165a46] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <span>احسب مسألة الأبناء والبنات</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>

          {/* Landmark 4: Single daughter and Radd */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#c5a059]/30 hover:border-[#c5a059] transition-all shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-300">
                  باب الرد
                </span>
                <span className="text-xs text-gray-400 font-mono">04</span>
              </div>
              <h3 className="text-lg font-bold font-amiri text-[#0e382c]">
                مسألة البنت المنفردة والرد
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>الورثة:</strong> زوجة وبنت واحدة فقط.<br />
                تأخذ الزوجة الثمن فرضاً، وتأخذ البنت النصف فرضاً والباقي رداً عليها بالكامل لانعدام العاصب، وفق مذهب الجمهور.
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator', { presetKey: 'single_daughter' })}
              className="w-full py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#165a46] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <span>احسب مسألة الرد الآن</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Direct Live Interactive Simulation Card (محاكي التركات التفاعلي السريع) */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-white to-[#fbf9f4] rounded-3xl p-6 sm:p-8 border-2 border-[#0e382c]/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c5a059]" />
              <h3 className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">
                محاكي التركات التفاعلي الفوري
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              جرّب تغيير الورثة وقيمة التركة وشاهد السهام والأنصبة تُحسب فورياً في أجزاء من الثانية!
            </p>
          </div>

          <button
            onClick={() => onNavigate('calculator')}
            className="px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>الانتقال للحاسبة الكاملة مع الحجب والأدلة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick controls grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1: Estate & Deceased */}
          <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <span className="font-bold text-xs text-[#0e382c] block border-b pb-1.5">
              1. بيانات الميت والتركة
            </span>

            {/* Gender */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">جنس المتوفى:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickGender('male')}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    quickGender === 'male'
                      ? 'bg-[#0e382c] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ذكر (رجل)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickGender('female')}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    quickGender === 'female'
                      ? 'bg-[#0e382c] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  أنثى (امرأة)
                </button>
              </div>
            </div>

            {/* Estate Value */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">قيمة التركة (ريال):</label>
              <input
                type="number"
                step="1000"
                min="0"
                value={quickEstate}
                onChange={(e) => setQuickEstate(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-[#0e382c] bg-[#fbf9f4]"
              />
            </div>

            {/* Parents toggle */}
            <div className="space-y-2 pt-1">
              <label className="text-xs text-gray-500 block">الأبوان على قيد الحياة:</label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quickMother}
                    onChange={(e) => setQuickMother(e.target.checked)}
                    className="rounded text-[#0e382c]"
                  />
                  <span>الأم موجودة</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quickFather}
                    onChange={(e) => setQuickFather(e.target.checked)}
                    className="rounded text-[#0e382c]"
                  />
                  <span>الأب موجود</span>
                </label>
              </div>
            </div>
          </div>

          {/* Col 2: Spouses & Children */}
          <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <span className="font-bold text-xs text-[#0e382c] block border-b pb-1.5">
              2. الزوجية والأولاد
            </span>

            {quickGender === 'male' ? (
              <div>
                <label className="text-xs text-gray-500 block mb-1">عدد الزوجات:</label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuickWives(num)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                        quickWives === num
                          ? 'bg-[#c5a059] text-[#0e382c]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-gray-500 block mb-1">الزوج:</label>
                <button
                  type="button"
                  onClick={() => setQuickHusband(!quickHusband)}
                  className={`w-full py-2 text-xs font-bold rounded-xl transition ${
                    quickHusband
                      ? 'bg-[#c5a059] text-[#0e382c]'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {quickHusband ? 'الزوج حي (يستحق الميراث)' : 'الزوج غير موجود'}
                </button>
              </div>
            )}

            {/* Sons count */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>عدد الأبناء (ذكور):</span>
                <span className="font-bold text-[#0e382c]">{quickSons}</span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuickSons(n)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                      quickSons === n ? 'bg-[#0e382c] text-white' : 'bg-gray-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Daughters count */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>عدد البنات (إناث):</span>
                <span className="font-bold text-[#0e382c]">{quickDaughters}</span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuickDaughters(n)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                      quickDaughters === n ? 'bg-[#0e382c] text-white' : 'bg-gray-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Live Output Result Card */}
          <div className="bg-[#0e382c] text-[#fbf9f4] p-4 rounded-2xl border border-[#c5a059]/40 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs text-[#f3e5ab] font-bold">النتيجة الفورية</span>
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded">
                  أصل المسألة: {liveResult.finalBase}
                </span>
              </div>

              {liveResult.heirs.length === 0 ? (
                <p className="text-xs text-gray-300 py-4 text-center">
                  أدخل ورثة مستحقين لحساب التركة
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {liveResult.heirs.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/10 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{h.name}</span>
                        <span className="text-[10px] text-[#f3e5ab]">
                          {h.shareName} ({h.shareFraction}) — {h.sharesCount} سهم
                        </span>
                      </div>
                      <div className="text-left font-mono font-bold text-[#f3e5ab]">
                        {h.totalAmount.toLocaleString('ar-EG')} ر.س
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="w-full py-2.5 rounded-xl bg-[#c5a059] text-[#0e382c] font-bold text-xs hover:bg-[#d8b56d] transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
            >
              <span>فتح هذه المسألة في الحاسبة المتقدمة</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Two Main Gateways: علم المواريث vs الوقف وأحكامه */}
      <section className="max-w-5xl mx-auto space-y-5">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            بوابات المنصة الرئيسية
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            تكامل علم الفرائض وحساب التركات مع فقه الوقف الشرعي والصدقة الجارية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gateway Card 1: علم المواريث */}
          <div className="bg-gradient-to-br from-white to-[#fbf9f4] rounded-3xl p-6 sm:p-8 border-2 border-[#0e382c]/20 hover:border-[#0e382c] transition-all shadow-md hover:shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0e382c] text-[#f3e5ab] flex items-center justify-center shadow-md">
                <CalcIcon className="w-6 h-6 text-[#c5a059]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-amiri text-[#0e382c]">
                  علم المواريث والفرائض
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  تعلم أحكام الفرائض واحسب أنصبة الورثة بدقة قطعية مع أدلة الحجب والعول والرد وتوليد وثائق التوزيع الرسمية، وقراءة 28 فصلاً فقهياً مؤصلاً بالأدلة.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>28 فصلاً فقهياً</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>حاسبة السهام والعول</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>طباعة صك التوزيع</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>معجم المصطلحات</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="w-full py-3.5 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98"
            >
              <span>دخول بوابة المواريث والحاسبة</span>
              <ArrowLeft className="w-4 h-4 text-[#c5a059]" />
            </button>
          </div>

          {/* Gateway Card 2: الوقف وأحكامه */}
          <div className="bg-gradient-to-br from-white to-[#fbf9f4] rounded-3xl p-6 sm:p-8 border-2 border-[#c5a059]/40 hover:border-[#c5a059] transition-all shadow-md hover:shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059] text-[#0e382c] flex items-center justify-center shadow-md">
                <Layers className="w-6 h-6 text-[#0e382c]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-amiri text-[#0e382c]">
                  الوقف وأحكامه ونظارته
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  18 باباً فقهياً في أحكام الوقف، مع دليل إنشاء وقف بالخطوات، ونموذج التوثيق وحجة الوقف الرسمية القابلة للطباعة PDF، وقاموس مصطلحات الوقف المتخصص.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>18 باباً في أحكام الوقف</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>صك وحجة الوقف PDF</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>شروط الواقف والنظارة</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>قاموس مصطلحات الوقف</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('endowment')}
              className="w-full py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98"
            >
              <span>دخول بوابة الوقف وأحكامه</span>
              <ArrowLeft className="w-4 h-4 text-[#0e382c]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Quranic Verse & Scholarly Weight */}
      <section className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#c5a059]/30 shadow-xs relative overflow-hidden text-center space-y-3">
        <div className="w-12 h-1 bg-[#c5a059] mx-auto rounded-full mb-3" />
        <p className="quran-verse text-lg sm:text-2xl text-[#0e382c] font-bold">
          ﴿ يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ﴾
        </p>
        <p className="text-xs text-gray-500 font-medium">سورة النساء — الآية 11</p>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto pt-1 leading-relaxed">
          "تولى الله تبارك وتعالى بنفسه تقدير الفرائض وتفصيلها في كتابه، رحمةً بعباده وقطعاً لمنابت الخلاف والخصومات، وجعل الوقف صدقة جارية تثمر في الدنيا والأخرى."
        </p>
      </section>

      {/* 6. Four Platform Pillars */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            أركان منصة المواريث والوقف
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
                <CalcIcon className="w-5 h-5 text-[#c5a059]" />
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
                الوقف وأحكامه (18 باباً)
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
                معجم المصطلحات الشرعية
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

      {/* 7. Offline & PWA Banner */}
      <section className="max-w-5xl mx-auto bg-gradient-to-r from-[#f7f4ec] to-[#f2ede0] rounded-2xl p-6 border border-[#c5a059]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#0e382c] text-[#c5a059] flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0e382c]">تطبيق ويب تقدمي (PWA) قابل للتثبيت السريع</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              ثبّت التطبيق على شاشة هاتفك الرئيسية، واستخدم الحاسبة والكتاب وقسم الوقف كاملاً حتى في وضع عدم الاتصال بالإنترنت.
            </p>
          </div>
        </div>
        <PWAInstallButton variant="primary" className="py-2.5 px-5 text-sm shrink-0" />
      </section>
    </div>
  );
};
