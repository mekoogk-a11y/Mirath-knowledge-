import React, { useState, useMemo } from 'react';
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
  FolderKanban,
  FileCheck,
  FileCheck2,
  FileText,
  Bell,
  Settings,
  Building,
  Users,
  Clock,
  ExternalLink,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { PWAInstallButton } from './PWAInstallButton';
import { calculateInheritance } from '../engine/farayedEngine';
import { platformStore } from '../data/platformStore';

interface HeroHomeProps {
  onNavigate: (
    tab: ActiveTab,
    payload?: { chapterId?: number; endowmentId?: string; presetKey?: string }
  ) => void;
  onOpenSearch?: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onNavigate, onOpenSearch }) => {
  // Live Store Data
  const estateCases = useMemo(() => platformStore.getEstateCases(), []);
  const waqfRecords = useMemo(() => platformStore.getWaqfRecords(), []);
  const alerts = useMemo(() => platformStore.getAlerts(), []);
  const auditLogs = useMemo(() => platformStore.getAuditLogs().slice(0, 5), []);
  const calculationsCount = platformStore.getCalculationsCount();

  const pendingTasksCount = useMemo(() => {
    return estateCases.reduce((acc, c) => acc + (c.tasks?.filter((t) => t.status !== 'completed').length || 0), 0);
  }, [estateCases]);

  // Quick interactive simulation state on the hero home
  const [quickGender, setQuickGender] = useState<'male' | 'female'>('male');
  const [quickEstate, setQuickEstate] = useState<number>(120000);
  const [quickWives, setQuickWives] = useState<number>(1);
  const [quickHusband, setQuickHusband] = useState<boolean>(false);
  const [quickSons, setQuickSons] = useState<number>(1);
  const [quickDaughters, setQuickDaughters] = useState<number>(2);
  const [quickMother, setQuickMother] = useState<boolean>(true);
  const [quickFather, setQuickFather] = useState<boolean>(false);
  const [quickCurrency, setQuickCurrency] = useState<string>('جنيه سوداني');

  // Compute live preview
  const liveResult = useMemo(() => {
    return calculateInheritance({
      deceasedGender: quickGender,
      estateValue: quickEstate,
      currency: quickCurrency,
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
  }, [quickGender, quickEstate, quickCurrency, quickWives, quickHusband, quickSons, quickDaughters, quickMother, quickFather]);

  return (
    <div className="space-y-14 pb-20 text-right font-sans" dir="rtl">
      {/* 1. Grand Archival Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#09261e] via-[#0e382c] to-[#082019] text-[#fbf9f4] p-6 sm:p-12 lg:p-16 shadow-2xl border-2 border-[#c5a059]/40">
        <div className="absolute inset-0 bg-emerald-pattern opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Top Label */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/50 text-[#f3e5ab] text-xs sm:text-sm font-medium shadow-inner">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>المنصة الرقمية المتخصصة في حساب المواريث وإدارة التركات والأوقاف</span>
          </div>

          {/* Majestic Title & Slogan */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-amiri tracking-tight leading-tight text-[#fdfbf7]">
              منصة الميراث والوقف
            </h1>
            <p className="text-sm sm:text-lg text-[#c5a059] font-bold tracking-wide font-amiri">
              «معرفة أوضح. إدارة منظمة. أثر مستمر.»
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#e8e4da]/90 leading-relaxed max-w-3xl mx-auto font-sans">
            منظومة رقمية شاملة تجمع بين دقة الحساب الشرعي للفرائض، وتنظيم ملفات التركات، وإدارة الأصول والعقود الوقفية، والمتابعة المالية وحوكمة دورة الصرف المعتمدة.
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
                  ابحث في خدمات المنصة، ملفات التركات، الأوقاف، الفصول الشرعية (Ctrl+K)...
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
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-98"
            >
              <CalcIcon className="w-5 h-5 text-[#0e382c]" />
              <span>دخول حاسبة الميراث المعتمدة</span>
            </button>

            <button
              onClick={() => onNavigate('estates')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c5a059]/70 text-[#fdfbf7] font-semibold text-sm sm:text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2.5 active:scale-98"
            >
              <FolderKanban className="w-5 h-5 text-[#f3e5ab]" />
              <span>ملفات التركات</span>
            </button>

            <button
              onClick={() => onNavigate('waqf')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#c5a059]/70 text-[#fdfbf7] font-semibold text-sm sm:text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Layers className="w-5 h-5 text-[#f3e5ab]" />
              <span>إدارة الأوقاف</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Platform Dashboard Overview (لوحة تحكم المنصة) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">
              لوحة تحكم المنصة والمؤشرات الحية
            </h2>
            <p className="text-xs text-gray-500">
              متابعة فورية للمسائل المحسوبة، ملفات التركات، الأوقاف المسجلة، والمهام العاجلة
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">تحديث فوري تلقائي</span>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('calculator')}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">مسائل المواريث المحسوبة</span>
              <CalcIcon className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0e382c]">
              {calculationsCount.toLocaleString('ar-EG')}
            </div>
            <span className="text-[11px] text-emerald-700 block font-medium">محرك Rule Engine v2.4.0</span>
          </div>

          <div
            onClick={() => onNavigate('estates')}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">ملفات التركات النشطة</span>
              <FolderKanban className="w-4 h-4 text-[#0e382c] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0e382c]">
              {estateCases.length}
            </div>
            <span className="text-[11px] text-blue-700 block font-medium">
              {estateCases.filter((c) => c.status === 'under_review').length} قيد المراجعة الشرعية
            </span>
          </div>

          <div
            onClick={() => onNavigate('waqf')}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">الأوقاف المسجلة</span>
              <Layers className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0e382c]">
              {waqfRecords.length}
            </div>
            <span className="text-[11px] text-[#c5a059] block font-medium">
              أصول بقيمة {(waqfRecords.reduce((s, w) => s + w.totalValue, 0) / 1000000).toFixed(1)} مليون ريال
            </span>
          </div>

          <div
            onClick={() => onNavigate('alerts')}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">مهام وتنبيهات المتابعة</span>
              <Bell className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
              {alerts.filter((a) => !a.isRead).length + pendingTasksCount}
            </div>
            <span className="text-[11px] text-amber-800 block font-medium">تتطلب إجراءات واعتمادات</span>
          </div>
        </div>

        {/* Dashboard 2-Column Section: Recent Estates & Live Alerts/Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Estate Files (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#c5a059]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#0e382c] flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#c5a059]" />
                <span>آخر ملفات التركات المسجلة:</span>
              </h3>
              <button
                onClick={() => onNavigate('estates')}
                className="text-xs font-bold text-[#c5a059] hover:underline flex items-center gap-0.5"
              >
                <span>عرض كافة الملفات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {estateCases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate('estates')}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-[#fcfaf6] hover:bg-white hover:border-[#c5a059]/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500 font-semibold">
                        {c.caseNumber}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">{c.title}</h4>
                    </div>
                    <p className="text-gray-500 mt-1">المتوفى: {c.deceasedName} • تاريخ الوفاة: {c.deathDate}</p>
                  </div>
                  <div className="text-left font-mono">
                    <span className="font-bold text-sm text-[#0e382c] block">
                      {c.netDistributableEstate.toLocaleString('ar-EG')} {c.currency}
                    </span>
                    <span className="text-[11px] text-gray-500 font-sans">{c.statusText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Audit Feed (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#c5a059]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#0e382c] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c5a059]" />
                <span>آخر التعديلات والعمليات (Audit Log):</span>
              </h3>
              <button
                onClick={() => onNavigate('settings')}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                السجل الكامل
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0e382c] text-[11px]">{log.action}</span>
                    <span className="font-mono text-[10px] text-gray-400">{log.timestamp.slice(5, 16)}</span>
                  </div>
                  <p className="text-gray-600 text-[11px] truncate">{log.details}</p>
                  <span className="text-[10px] text-gray-400 block font-medium">بواسطة: {log.userName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 10 Primary Services of the Platform (الخدمات الرئيسية العشر) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>بوابة الخدمات الرقمية الشاملة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
            خدمات منصة الميراث والوقف
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            تصفح الخدمات المتخصصة مباشرة لتنظيم وتوثيق كافة المسائل الشرعية والإدارية والمالية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            {
              id: 'calculator',
              title: 'حاسبة الميراث',
              desc: 'حساب الأنصبة والسهام عبر 4 مراحل شرعية دقيقة بمحرك قطعي.',
              icon: <CalcIcon className="w-6 h-6 text-[#c5a059]" />,
            },
            {
              id: 'estates',
              title: 'ملفات التركات',
              desc: 'تنظيم ملفات التركات، حصر الأصول والديون والورثة، وسجل العمليات.',
              icon: <FolderKanban className="w-6 h-6 text-[#0e382c]" />,
            },
            {
              id: 'waqf',
              title: 'إدارة الوقف',
              desc: 'توثيق شروط الواقف، مصارف الوقف، والمتابعة المالية ودورة الصرف.',
              icon: <Layers className="w-6 h-6 text-[#c5a059]" />,
            },
            {
              id: 'waqf',
              title: 'الأصول والعقود',
              desc: 'إدارة أصول الأوقاف وعقود التأجير وتنبيهات مواعيد التجديد.',
              icon: <Building className="w-6 h-6 text-[#0e382c]" />,
            },
            {
              id: 'documents',
              title: 'المستندات والصكوك',
              desc: 'رفع وإدارة صكوك حصر الورثة، حجج الوقف، وتدقيق المستندات.',
              icon: <FileCheck className="w-6 h-6 text-[#c5a059]" />,
            },
            {
              id: 'reviews',
              title: 'المراجعات الشرعية',
              desc: 'مساحة عمل المراجع الشرعي والقانوني لتدقيق الأنصبة والصرف.',
              icon: <FileCheck2 className="w-6 h-6 text-[#0e382c]" />,
            },
            {
              id: 'book',
              title: 'المعرفة الشرعية',
              desc: 'كتاب الفرائض (28 فصلاً) وقاموس المصطلحات الفقهية الموثقة.',
              icon: <BookOpen className="w-6 h-6 text-[#c5a059]" />,
            },
            {
              id: 'reports',
              title: 'التقارير الرسمية',
              desc: 'كشوفات التركات وحسابات الأوقاف المعتمدة جاهزة للطباعة والتصدير.',
              icon: <FileText className="w-6 h-6 text-[#0e382c]" />,
            },
            {
              id: 'alerts',
              title: 'التنبيهات والمواعيد',
              desc: 'إشعارات انتهاء العقود، مهام التركات، ومطالبات الصرف العاجلة.',
              icon: <Bell className="w-6 h-6 text-[#c5a059]" />,
            },
            {
              id: 'settings',
              title: 'الحساب والإعدادات',
              desc: 'إدارة الأدوار (ناظر، مراجع، مدخل بيانات، مستفيد) والصلاحيات.',
              icon: <Settings className="w-6 h-6 text-[#0e382c]" />,
            },
          ].map((srv, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(srv.id as ActiveTab)}
              className="p-5 rounded-2xl bg-white border border-[#c5a059]/25 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0e382c]/5 border border-[#c5a059]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {srv.icon}
                </div>
                <h3 className="font-bold text-base text-[#0e382c] group-hover:text-[#c5a059] transition">
                  {srv.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#0e382c] font-semibold">
                <span>دخول الخدمة</span>
                <ChevronLeft className="w-4 h-4 text-[#c5a059] group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Live Quick Simulation for Visitors */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#c5a059]/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider block">تجربة تفاعلية مباشرة</span>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">محاكاة فورية لقسمة تركة</h2>
          </div>
          <button
            onClick={() => onNavigate('calculator')}
            className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl hover:bg-[#124838] transition flex items-center gap-1.5 self-start"
          >
            <span>الانتقال للحاسبة المتقدمة كاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          {/* Left: Quick Inputs */}
          <div className="lg:col-span-5 space-y-4 bg-[#fcfaf6] p-5 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuickGender('male')}
                className={`py-2 rounded-xl font-bold ${quickGender === 'male' ? 'bg-[#0e382c] text-white' : 'bg-white border text-gray-700'}`}
              >
                المتوفى ذكر
              </button>
              <button
                type="button"
                onClick={() => setQuickGender('female')}
                className={`py-2 rounded-xl font-bold ${quickGender === 'female' ? 'bg-[#0e382c] text-white' : 'bg-white border text-gray-700'}`}
              >
                المتوفاة أنثى
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">قيمة التركة الصافية:</label>
              <input
                type="number"
                value={quickEstate}
                onChange={(e) => setQuickEstate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-sm font-bold bg-white"
              />
            </div>

            {/* Quick Heirs Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {quickGender === 'male' ? (
                <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                  <span>الزوجات:</span>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={quickWives}
                    onChange={(e) => setQuickWives(Number(e.target.value))}
                    className="w-10 text-center font-mono font-bold"
                  />
                </div>
              ) : (
                <label className="p-2 bg-white rounded-xl border border-gray-200 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quickHusband}
                    onChange={(e) => setQuickHusband(e.target.checked)}
                    className="accent-[#0e382c]"
                  />
                  <span>الزوج حي</span>
                </label>
              )}

              <label className="p-2 bg-white rounded-xl border border-gray-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quickMother}
                  onChange={(e) => setQuickMother(e.target.checked)}
                  className="accent-[#0e382c]"
                />
                <span>الأم حية</span>
              </label>

              <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                <span>الأبناء:</span>
                <input
                  type="number"
                  min="0"
                  value={quickSons}
                  onChange={(e) => setQuickSons(Number(e.target.value))}
                  className="w-10 text-center font-mono font-bold"
                />
              </div>

              <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                <span>البنات:</span>
                <input
                  type="number"
                  min="0"
                  value={quickDaughters}
                  onChange={(e) => setQuickDaughters(Number(e.target.value))}
                  className="w-10 text-center font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Result Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">أصل المسألة</span>
                <span className="text-xl font-bold font-mono text-[#0e382c]">{liveResult.aslMasalah}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">الأصل بعد العول/الرد</span>
                <span className="text-xl font-bold font-mono text-[#0e382c]">{liveResult.finalBase}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">عدد الورثة</span>
                <span className="text-xl font-bold font-mono text-[#c5a059]">{liveResult.heirs.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              {liveResult.heirs.map((h) => (
                <div key={h.id} className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-900">{h.name}</span>
                    <span className="text-gray-500 text-[11px] block">{h.shareName} ({h.shareFraction})</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="font-bold text-[#0e382c]">{h.totalAmount.toLocaleString('ar-EG')} {quickCurrency}</span>
                    <span className="text-[10px] text-gray-400 block">{h.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Landmark Historical Cases */}
      <section className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          <div
            onClick={() => onNavigate('calculator', { presetKey: 'umariyyah' })}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="px-2 py-0.5 rounded bg-[#0e382c]/10 text-[#0e382c] font-bold text-[10px]">قضاء عمر بن الخطاب</span>
            <h3 className="font-bold text-base text-[#0e382c] font-amiri">المسألتان العمريتان (الغراوان)</h3>
            <p className="text-gray-600 leading-relaxed">
              توفي عن: زوج + أم + أب. قُضي للأم بثلث الباقي حتى لا يزيد نصيب الأنثى عن الذكر في نفس الدرجة.
            </p>
            <span className="text-xs font-bold text-[#c5a059] block pt-1">حساب المسألة الآن ←</span>
          </div>

          <div
            onClick={() => onNavigate('calculator', { presetKey: 'manbariyyah' })}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="px-2 py-0.5 rounded bg-[#0e382c]/10 text-[#0e382c] font-bold text-[10px]">قضاء علي بن أبي طالب</span>
            <h3 className="font-bold text-base text-[#0e382c] font-amiri">المسألة المنبرية (العول)</h3>
            <p className="text-gray-600 leading-relaxed">
              توفي عن: زوجة وبنتين وأب وأم. أصلها من 24 وعالت إلى 27، وسئل عنها علي وهو على المنبر فأجاب فوراً: «صار ثمنها تسعاً».
            </p>
            <span className="text-xs font-bold text-[#c5a059] block pt-1">حساب المسألة الآن ←</span>
          </div>

          <div
            onClick={() => onNavigate('calculator', { presetKey: 'single_daughter' })}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="px-2 py-0.5 rounded bg-[#0e382c]/10 text-[#0e382c] font-bold text-[10px]">فقه جمهور الفقهاء</span>
            <h3 className="font-bold text-base text-[#0e382c] font-amiri">مسألة الرد على أصحاب الفروض</h3>
            <p className="text-gray-600 leading-relaxed">
              توفي عن: زوجة وبنت فقط. تأخذ الزوجة الثمن فرضاً، والبنت النصف فرضاً والباقي رداً عليها بالقرابة.
            </p>
            <span className="text-xs font-bold text-[#c5a059] block pt-1">حساب المسألة الآن ←</span>
          </div>

          <div
            onClick={() => onNavigate('book')}
            className="p-5 rounded-2xl bg-white border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
          >
            <span className="px-2 py-0.5 rounded bg-[#0e382c]/10 text-[#0e382c] font-bold text-[10px]">الموسوعة الكاملة</span>
            <h3 className="font-bold text-base text-[#0e382c] font-amiri">كتاب الفرائض والمواريث</h3>
            <p className="text-gray-600 leading-relaxed">
              28 فصلاً علمياً مؤصلاً يغطي شروط الإرث، موانعه، أصحاب الفروض، العصبات، الحجب، والحساب والتصحيح.
            </p>
            <span className="text-xs font-bold text-[#c5a059] block pt-1">قراءة الكتاب الآن ←</span>
          </div>
        </div>
      </section>
    </div>
  );
};
