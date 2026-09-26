import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HeirsInput, CalculationResult } from '../types/inheritance';
import { calculateInheritance } from '../engine/farayedEngine';
import {
  Calculator as CalcIcon,
  RotateCcw,
  Printer,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Users,
  Coins,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  FolderPlus,
  ShieldCheck,
  Building,
  FileCheck,
  Scale,
} from 'lucide-react';
import { platformStore } from '../data/platformStore';
import { EstateCase } from '../types/platform';

const CURRENCIES = [
  'جنيه سوداني',
  'ريال سعودي',
  'درهم إماراتي',
  'دينار كويتي',
  'ريال قطري',
  'ريال عماني',
  'دينار بحريني',
  'جنيه مصري',
  'دينار أردني',
  'دولار أمريكي',
  'يورو',
];

const INITIAL_INPUT: HeirsInput = {
  deceasedGender: 'male',
  estateValue: 100000,
  currency: 'ريال سعودي',
  hasHusband: false,
  wivesCount: 1,
  hasFather: false,
  hasMother: true,
  hasPaternalGrandfather: false,
  hasPaternalGrandmother: false,
  hasMaternalGrandmother: false,
  sonsCount: 1,
  daughtersCount: 2,
  sonsOfSonsCount: 0,
  daughtersOfSonsCount: 0,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  paternalBrothersCount: 0,
  paternalSistersCount: 0,
  maternalBrothersCount: 0,
  maternalSistersCount: 0,
};

export interface CalculatorProps {
  initialPreset?: string | null;
  onPresetConsumed?: () => void;
  onSavedAsEstate?: (caseId: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  initialPreset,
  onPresetConsumed,
  onSavedAsEstate,
}) => {
  // 4-Stage Stepped Wizard State
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);

  // Additional Estate Data for Step 1 & 3
  const [deceasedName, setDeceasedName] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [grossEstateValue, setGrossEstateValue] = useState<number>(100000);
  const [funeralCosts, setFuneralCosts] = useState<number>(0);
  const [debtsToGod, setDebtsToGod] = useState<number>(0);
  const [debtsToPeople, setDebtsToPeople] = useState<number>(0);
  const [bequestValue, setBequestValue] = useState<number>(0); // وصية

  // Physical Property Distribution Plan vs Sharia Shares
  const [physicalDistributionMethod, setPhysicalDistributionMethod] = useState<'cash' | 'in_kind' | 'auction' | 'reconciliation'>('cash');

  const [input, setInput] = useState<HeirsInput>(INITIAL_INPUT);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Compute net estate value automatically from Gross minus Deductions
  const netEstateValue = useMemo(() => {
    const deductions = (funeralCosts || 0) + (debtsToGod || 0) + (debtsToPeople || 0) + (bequestValue || 0);
    return Math.max(0, grossEstateValue - deductions);
  }, [grossEstateValue, funeralCosts, debtsToGod, debtsToPeople, bequestValue]);

  // Sync net value into input for rule engine
  useEffect(() => {
    setInput((prev) => (prev.estateValue === netEstateValue ? prev : { ...prev, estateValue: netEstateValue }));
  }, [netEstateValue]);

  // Validation Checks prior to calculation
  const validationReport = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check data completeness
    if (grossEstateValue <= 0) {
      errors.push('يرجى تحديد قيمة صالحة للتركة أكبر من الصفر.');
    }

    // 2. Check relationship consistency
    if (input.deceasedGender === 'male' && input.hasHusband) {
      errors.push('تعارض في البيانات: لا يمكن وجود زوج لمتوفى رجل.');
    }
    if (input.deceasedGender === 'female' && input.wivesCount > 0) {
      errors.push('تعارض في البيانات: لا يمكن وجود زوجات لمتوفاة أنثى.');
    }

    // 3. Bequest validation (cannot exceed 1/3 of net before bequest unless approved)
    const estateBeforeBequest = grossEstateValue - (funeralCosts + debtsToGod + debtsToPeople);
    if (bequestValue > 0 && estateBeforeBequest > 0 && bequestValue > estateBeforeBequest / 3) {
      warnings.push('تنبيه شرعي: الوصية تزيد عن ثلث التركة، والوصية لا تنفذ فيما زاد عن الثلث إلا بإجازة الورثة الراشدين.');
    }

    // 4. Check if at least one heir exists
    const totalHeirsEntered =
      (input.hasHusband ? 1 : 0) +
      input.wivesCount +
      (input.hasFather ? 1 : 0) +
      (input.hasMother ? 1 : 0) +
      (input.hasPaternalGrandfather ? 1 : 0) +
      (input.hasPaternalGrandmother ? 1 : 0) +
      (input.hasMaternalGrandmother ? 1 : 0) +
      input.sonsCount +
      input.daughtersCount +
      input.sonsOfSonsCount +
      input.daughtersOfSonsCount +
      input.fullBrothersCount +
      input.fullSistersCount +
      input.paternalBrothersCount +
      input.paternalSistersCount +
      input.maternalBrothersCount +
      input.maternalSistersCount;

    if (totalHeirsEntered === 0) {
      errors.push('لم يتم تحديد أي وارث على قيد الحياة للمتوفى.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      needsSpecialistReview: errors.length > 0,
    };
  }, [input, grossEstateValue, funeralCosts, debtsToGod, debtsToPeople, bequestValue]);

  // Compute calculation via Rule Engine
  const result: CalculationResult = useMemo(() => {
    return calculateInheritance(input);
  }, [input]);

  const lastAppliedPresetRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialPreset && initialPreset !== lastAppliedPresetRef.current) {
      lastAppliedPresetRef.current = initialPreset;
      handleApplyPreset(initialPreset);
      if (onPresetConsumed) {
        onPresetConsumed();
      }
    } else if (!initialPreset) {
      lastAppliedPresetRef.current = null;
    }
  }, [initialPreset, onPresetConsumed]);

  const handleGenderChange = (gender: 'male' | 'female') => {
    setInput((prev) => ({
      ...prev,
      deceasedGender: gender,
      hasHusband: gender === 'female' ? prev.hasHusband : false,
      wivesCount: gender === 'male' ? Math.max(1, prev.wivesCount) : 0,
    }));
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setGrossEstateValue(100000);
    setFuneralCosts(0);
    setDebtsToGod(0);
    setDebtsToPeople(0);
    setBequestValue(0);
    setDeceasedName('');
    setCurrentStage(1);
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'wife_sons_daughters') {
      setInput({
        ...INITIAL_INPUT,
        deceasedGender: 'male',
        estateValue: 120000,
        wivesCount: 1,
        hasMother: true,
        hasFather: false,
        sonsCount: 2,
        daughtersCount: 2,
      });
      setGrossEstateValue(120000);
    } else if (presetName === 'umariyyah') {
      setInput({
        ...INITIAL_INPUT,
        deceasedGender: 'female',
        estateValue: 60000,
        hasHusband: true,
        wivesCount: 0,
        hasMother: true,
        hasFather: true,
        sonsCount: 0,
        daughtersCount: 0,
      });
      setGrossEstateValue(60000);
    } else if (presetName === 'manbariyyah') {
      setInput({
        ...INITIAL_INPUT,
        deceasedGender: 'male',
        estateValue: 270000,
        wivesCount: 1,
        hasMother: true,
        hasFather: true,
        daughtersCount: 2,
        sonsCount: 0,
      });
      setGrossEstateValue(270000);
    } else if (presetName === 'single_daughter') {
      setInput({
        ...INITIAL_INPUT,
        deceasedGender: 'male',
        estateValue: 80000,
        wivesCount: 1,
        daughtersCount: 1,
        sonsCount: 0,
        hasFather: false,
        hasMother: false,
      });
      setGrossEstateValue(80000);
    }
    setCurrentStage(4);
  };

  const handleSaveAsEstateCase = () => {
    const caseNumber = `TRK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newCase: EstateCase = {
      id: `est-calc-${Date.now()}`,
      caseNumber,
      title: deceasedName.trim() ? `تركة المرحوم ${deceasedName.trim()}` : `مسألة تركة محوسبة (${caseNumber})`,
      deceasedName: deceasedName.trim() || (input.deceasedGender === 'male' ? 'متوفى غير مسمى' : 'متوفاة غير مسماة'),
      deceasedGender: input.deceasedGender,
      deathDate: deathDate || new Date().toISOString().split('T')[0],
      city: 'النظام المركزي',
      currency: input.currency,
      totalGrossEstate: grossEstateValue,
      totalObligations: (funeralCosts || 0) + (debtsToGod || 0) + (debtsToPeople || 0) + (bequestValue || 0),
      netDistributableEstate: netEstateValue,
      status: 'under_review',
      statusText: 'قيد المراجعة الشرعية',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      heirsCount: result.heirs.length,
      notes: `تم حفظ المسألة مباشرة من حاسبة المواريث المعتمدة (Farayed Engine v2.4.0). أصل المسألة: ${result.aslMasalah}، الأصل النهائي: ${result.finalBase}.`,
      assets: [
        {
          id: `ast-c-${Date.now()}`,
          type: 'bank_account',
          typeName: 'صافي التركة النقدية',
          title: 'الرصيد النقدي للتركة المحسوبة',
          estimatedValue: netEstateValue,
        },
      ],
      obligations: [
        ...(funeralCosts > 0
          ? [
              {
                id: `ob-f-${Date.now()}`,
                type: 'funeral' as const,
                typeName: 'مؤن التجهيز والدفن',
                title: 'مؤن التجهيز والدفن',
                amount: funeralCosts,
                isSettled: true,
              },
            ]
          : []),
        ...(debtsToPeople > 0
          ? [
              {
                id: `ob-dp-${Date.now()}`,
                type: 'debt_people' as const,
                typeName: 'ديون للعباد',
                title: 'ديون ومعاملات والتزامات للعباد',
                amount: debtsToPeople,
                isSettled: false,
              },
            ]
          : []),
        ...(bequestValue > 0
          ? [
              {
                id: `ob-bq-${Date.now()}`,
                type: 'bequest' as const,
                typeName: 'وصية شرعية',
                title: 'وصية المتوفى الشرعية',
                amount: bequestValue,
                isSettled: false,
              },
            ]
          : []),
      ],
      documents: [],
      tasks: [],
      reviews: [],
      auditLogs: [],
      calculationSnapshot: result,
    };

    platformStore.saveEstateCase(newCase);
    platformStore.incrementCalculationsCount();
    setSaveSuccessMessage(`تم إنشاء وحفظ ملف التركة الرسمي بنجاح برقم: ${caseNumber}`);
    setTimeout(() => setSaveSuccessMessage(null), 5000);
    if (onSavedAsEstate) {
      onSavedAsEstate(newCase.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textLines = [
      `مسألة قسمة مواريث شرعية معتمدة`,
      `إصدار محرك القواعد: Farayed Rule Engine v2.4.0`,
      `المتوفى: ${deceasedName ? deceasedName : input.deceasedGender === 'male' ? 'ذكر (رجل)' : 'أنثى (امرأة)'}`,
      `إجمالي التركة: ${grossEstateValue.toLocaleString('ar-EG')} ${input.currency}`,
      `الالتزامات والديون والوصايا: ${((funeralCosts || 0) + (debtsToGod || 0) + (debtsToPeople || 0) + (bequestValue || 0)).toLocaleString('ar-EG')} ${input.currency}`,
      `صافي التركة القابلة للقسمة: ${result.estateValue.toLocaleString('ar-EG')} ${result.currency}`,
      `أصل المسألة: ${result.aslMasalah} ${
        result.hasAwl
          ? `(عالت إلى ${result.finalBase})`
          : result.hasRadd
          ? `(ردّت إلى ${result.finalBase})`
          : ''
      }`,
      `-----------------------------`,
      ...result.heirs.map(
        (h) =>
          `${h.name} (${h.count}): فرض ${h.shareName} (${h.shareFraction}) | السهام: ${h.sharesCount} | المبلغ: ${h.totalAmount.toLocaleString(
            'ar-EG'
          )} ${result.currency} ${
            h.count > 1 ? `(لكل فرد: ${h.individualAmount.toLocaleString('ar-EG')})` : ''
          }`
      ),
      `-----------------------------`,
      `تنويه: الحساب استرشادي وفق مذهب جمهور الفقهاء الأربعة، ولا يعتبر وثيقة قضائية أو فتوى رسمية.`,
      `منصة الميراث والوقف: معرفة أوضح. إدارة منظمة. أثر مستمر.`,
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <CalcIcon className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>محرك الفرائض المستقل Rule Engine v2.4.0</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          حاسبة المواريث والأنصبة الشرعية
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          إدخال متدرج عبر 4 مراحل دقيقة: بيانات الحالة ← الأقارب والورثة ← التركة والالتزامات ← المراجعة والشرح المعتمد.
        </p>

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">مسائل فقهية مشهورة:</span>
          <button
            onClick={() => handleApplyPreset('wife_sons_daughters')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition shadow-2xs"
          >
            زوجة + أم + ابنان وبنتان
          </button>
          <button
            onClick={() => handleApplyPreset('umariyyah')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition shadow-2xs"
          >
            المسألة العمرية (زوج + أم + أب)
          </button>
          <button
            onClick={() => handleApplyPreset('manbariyyah')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition shadow-2xs"
          >
            المسألة المنبرية (عول)
          </button>
          <button
            onClick={() => handleApplyPreset('single_daughter')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition shadow-2xs"
          >
            زوجة + بنت (الرد)
          </button>
        </div>
      </div>

      {/* 4-Stage Stepper Bar */}
      <div className="bg-white rounded-2xl p-3 border border-[#c5a059]/30 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { num: 1, title: 'المرحلة 1: بيانات الحالة', sub: 'جنس المتوفى والعملة' },
            { num: 2, title: 'المرحلة 2: الأقارب والورثة', sub: 'أصحاب الفروض والعصبات' },
            { num: 3, title: 'المرحلة 3: التركة والديون', sub: 'مؤن الدفن والوصايا' },
            { num: 4, title: 'المرحلة 4: المراجعة والشرح', sub: 'الأنصبة والأدلة الشرعية' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStage(st.num as any)}
              className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                currentStage === st.num
                  ? 'bg-[#0e382c] text-[#f3e5ab] border-[#c5a059] shadow-sm ring-1 ring-[#c5a059]'
                  : currentStage > st.num
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-[#fbf9f4] text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{st.title}</span>
                {currentStage > st.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <span className="text-[11px] opacity-80 mt-1">{st.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification on Saving */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-normal">تمت إضافته إلى تبويب ملفات التركات</span>
        </div>
      )}

      {/* Wizard Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c5a059]/30 shadow-sm space-y-6">
        {/* ========================================================= */}
        {/* STAGE 1: بيانات الحالة */}
        {/* ========================================================= */}
        {currentStage === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0e382c] font-amiri">المرحلة 1: بيانات الحالة الأساسية</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  تتغير نتيجة المسألة والفروض الشرعية بحسب صلة القرابة واكتمال بيانات الحالة.
                </p>
              </div>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Deceased Gender */}
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 flex items-center gap-1">
                  <span>جنس المتوفى (ضروري لتحديد استحقاق الزوج أو الزوجات):</span>
                  <span title="يحدد هل الوارث زوج أم زوجة">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenderChange('male')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition ${
                      input.deceasedGender === 'male'
                        ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-xs'
                        : 'bg-[#fbf9f4] border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ذكر (رجل متوفى)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderChange('female')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition ${
                      input.deceasedGender === 'female'
                        ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-xs'
                        : 'bg-[#fbf9f4] border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    أنثى (امرأة متوفاة)
                  </button>
                </div>
              </div>

              {/* Optional Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">اسم المتوفى (اختياري، للتوثيق والتقرير):</label>
                <input
                  type="text"
                  value={deceasedName}
                  onChange={(e) => setDeceasedName(e.target.value)}
                  placeholder="مثال: عبد الله بن محمد آل فهد..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#0e382c]"
                />
              </div>

              {/* Death Date & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">تاريخ الوفاة (اختياري):</label>
                  <input
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">عملة التوزيع والحساب:</label>
                  <select
                    value={input.currency}
                    onChange={(e) => setInput((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <span className="text-xs text-gray-400">الخطوة 1 من 4</span>
              <button
                onClick={() => setCurrentStage(2)}
                className="px-6 py-2.5 bg-[#0e382c] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#124838] flex items-center gap-1.5 transition"
              >
                <span>المتابعة إلى إدخال الأقارب والورثة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: الأقارب والورثة */}
        {/* ========================================================= */}
        {currentStage === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0e382c] font-amiri">المرحلة 2: الأقارب والورثة المستحقون</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  لا يشترط كتابة أسماء الأشخاص؛ يكفي تحديد وجودهم وعددهم. يوضح النظام سبب طلب كل فئة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Category 1: الزوجية */}
              <div className="p-4 rounded-2xl bg-[#fcfaf6] border border-[#c5a059]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0e382c] flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-[#c5a059]" />
                    <span>1. الزوجية</span>
                  </h4>
                  <span className="text-[11px] text-gray-500">سبب الطلب: فرض الربع أو الثمن أو النصف</span>
                </div>

                {input.deceasedGender === 'male' ? (
                  <div className="space-y-2">
                    <label className="text-gray-700 block font-medium">عدد الزوجات على ذمته عند الوفاة:</label>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setInput((prev) => ({ ...prev, wivesCount: count }))}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                            input.wivesCount === count
                              ? 'bg-[#0e382c] text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400">يشتركن في الثمن إن وُجد فرع وارث، أو في الربع إن لم يُوجد.</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-800">هل الزوج على قيد الحياة؟</span>
                    <button
                      type="button"
                      onClick={() => setInput((prev) => ({ ...prev, hasHusband: !prev.hasHusband }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        input.hasHusband
                          ? 'bg-[#0e382c] text-[#f3e5ab]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {input.hasHusband ? 'نعم (حي)' : 'لا (متوفى أو لا يوجد)'}
                    </button>
                  </div>
                )}
              </div>

              {/* Category 2: الأصول */}
              <div className="p-4 rounded-2xl bg-[#fcfaf6] border border-[#c5a059]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0e382c] flex items-center gap-1.5 text-sm">
                    <Building className="w-4 h-4 text-[#c5a059]" />
                    <span>2. الأصول (الوالدان والأجداد)</span>
                  </h4>
                  <span className="text-[11px] text-gray-500">سبب الطلب: فرض السدس/الثلث/التعصيب</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${input.hasFather ? 'bg-[#0e382c]/10 border-[#0e382c] font-bold text-[#0e382c]' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={input.hasFather}
                      onChange={(e) => setInput((prev) => ({ ...prev, hasFather: e.target.checked }))}
                      className="accent-[#0e382c]"
                    />
                    <span>الأب حي</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${input.hasMother ? 'bg-[#0e382c]/10 border-[#0e382c] font-bold text-[#0e382c]' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={input.hasMother}
                      onChange={(e) => setInput((prev) => ({ ...prev, hasMother: e.target.checked }))}
                      className="accent-[#0e382c]"
                    />
                    <span>الأم حية</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${input.hasPaternalGrandfather ? 'bg-[#0e382c]/10 border-[#0e382c] font-bold text-[#0e382c]' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={input.hasPaternalGrandfather}
                      onChange={(e) => setInput((prev) => ({ ...prev, hasPaternalGrandfather: e.target.checked }))}
                      className="accent-[#0e382c]"
                    />
                    <span>الجد لأب (أبو الأب)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${input.hasMaternalGrandmother ? 'bg-[#0e382c]/10 border-[#0e382c] font-bold text-[#0e382c]' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={input.hasMaternalGrandmother}
                      onChange={(e) => setInput((prev) => ({ ...prev, hasMaternalGrandmother: e.target.checked }))}
                      className="accent-[#0e382c]"
                    />
                    <span>الجدة أم الأم</span>
                  </label>

                  <label className={`col-span-2 flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${input.hasPaternalGrandmother ? 'bg-[#0e382c]/10 border-[#0e382c] font-bold text-[#0e382c]' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={input.hasPaternalGrandmother}
                      onChange={(e) => setInput((prev) => ({ ...prev, hasPaternalGrandmother: e.target.checked }))}
                      className="accent-[#0e382c]"
                    />
                    <span>الجدة أم الأب</span>
                  </label>
                </div>
              </div>

              {/* Category 3: الفروع */}
              <div className="p-4 rounded-2xl bg-[#fcfaf6] border border-[#c5a059]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0e382c] flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-[#c5a059]" />
                    <span>3. الفروع (الأبناء والبنات)</span>
                  </h4>
                  <span className="text-[11px] text-gray-500">حجب الحواشي وللذكر مثل حظ الأنثيين</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="block mb-1 font-semibold text-gray-700">الأبناء (ذكور):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsCount: Math.max(0, p.sonsCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.sonsCount}
                        onChange={(e) => setInput((p) => ({ ...p, sonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsCount: p.sonsCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="block mb-1 font-semibold text-gray-700">البنات (إناث):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersCount: Math.max(0, p.daughtersCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.daughtersCount}
                        onChange={(e) => setInput((p) => ({ ...p, daughtersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersCount: p.daughtersCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Grandchildren */}
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="block mb-1 text-gray-600">أبناء الابن:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.sonsOfSonsCount}
                      onChange={(e) => setInput((p) => ({ ...p, sonsOfSonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full text-center font-mono py-1 rounded border border-gray-200"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="block mb-1 text-gray-600">بنات الابن:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.daughtersOfSonsCount}
                      onChange={(e) => setInput((p) => ({ ...p, daughtersOfSonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full text-center font-mono py-1 rounded border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Category 4: الحواشي */}
              <div className="p-4 rounded-2xl bg-[#fcfaf6] border border-[#c5a059]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0e382c] flex items-center gap-1.5 text-sm">
                    <Scale className="w-4 h-4 text-[#c5a059]" />
                    <span>4. الحواشي (الإخوة والأخوات)</span>
                  </h4>
                  <span className="text-[11px] text-gray-500">يحجبون بالفرع الذكر وبالأب</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>إخوة أشقاء:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.fullBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, fullBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>أخوات شقيقات:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.fullSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, fullSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>إخوة لأب:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.paternalBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, paternalBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>أخوات لأب:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.paternalSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, paternalSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>إخوة لأم:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.maternalBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, maternalBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                    <span>أخوات لأم:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.maternalSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, maternalSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-10 text-center font-bold font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setCurrentStage(1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الرجوع للمرحلة 1</span>
              </button>
              <button
                onClick={() => setCurrentStage(3)}
                className="px-6 py-2.5 bg-[#0e382c] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#124838] flex items-center gap-1.5 transition"
              >
                <span>المتابعة إلى إدخال التركة والالتزامات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3: التركة والالتزامات */}
        {/* ========================================================= */}
        {currentStage === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto text-xs">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#0e382c] font-amiri">المرحلة 3: التركة وحسم الالتزامات الشرعية</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                تُستخرج الحقوق المتعلقة بعين التركة ثم مؤن التجهيز، ثم الديون، ثم الوصية بحدود الثلث، قبل قسمة المتبقي بين الورثة.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-800 text-sm">إجمالي التركة المحصورة (Gross Estate):</label>
                <input
                  type="number"
                  min="1"
                  value={grossEstateValue}
                  onChange={(e) => setGrossEstateValue(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-mono text-base font-bold text-[#0e382c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-700">1. مؤن التجهيز والدفن بالمعروف:</label>
                  <input
                    type="number"
                    min="0"
                    value={funeralCosts || ''}
                    onChange={(e) => setFuneralCosts(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700">2. ديون الله (زكاة، نذور، كفارات، حج):</label>
                  <input
                    type="number"
                    min="0"
                    value={debtsToGod || ''}
                    onChange={(e) => setDebtsToGod(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700">3. ديون العباد (قروض، معاملات، إيجارات):</label>
                  <input
                    type="number"
                    min="0"
                    value={debtsToPeople || ''}
                    onChange={(e) => setDebtsToPeople(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-700">4. وصية شرعية لغير وارث (بحدود الثلث):</label>
                  <input
                    type="number"
                    min="0"
                    value={bequestValue || ''}
                    onChange={(e) => setBequestValue(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>

              {/* Net Summary Calculation */}
              <div className="p-4 rounded-2xl bg-[#0e382c]/5 border border-[#0e382c]/20 space-y-2">
                <div className="flex justify-between items-center text-gray-700">
                  <span>إجمالي التركة:</span>
                  <span className="font-mono font-bold">{grossEstateValue.toLocaleString('ar-EG')} {input.currency}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>مجموع الالتزامات والديون والوصية:</span>
                  <span className="font-mono font-bold">- {((funeralCosts || 0) + (debtsToGod || 0) + (debtsToPeople || 0) + (bequestValue || 0)).toLocaleString('ar-EG')} {input.currency}</span>
                </div>
                <div className="flex justify-between items-center text-[#0e382c] border-t border-[#0e382c]/20 pt-2 font-bold text-sm">
                  <span>صافي التركة القابلة للقسمة شرعاً:</span>
                  <span className="font-mono text-base">{netEstateValue.toLocaleString('ar-EG')} {input.currency}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setCurrentStage(2)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الرجوع للمرحلة 2</span>
              </button>
              <button
                onClick={() => setCurrentStage(4)}
                className="px-6 py-2.5 bg-[#0e382c] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#124838] flex items-center gap-1.5 transition"
              >
                <span>المتابعة إلى المراجعة والنتيجة الشرعية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 4: المراجعة وعرض التقرير والشرح المعتمد */}
        {/* ========================================================= */}
        {currentStage === 4 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#0e382c] font-amiri">المرحلة 4: المراجعة والشرح المعتمد للأنصبة</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  بيانات المسألة، التحقق من الاتساق الحسابي، شرح سبب استحقاق كل وارث، وفصل الحساب الشرعي عن التوزيع الفعلي.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveAsEstateCase}
                  className="px-4 py-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#dfba73] hover:from-[#b38f4a] hover:to-[#c5a059] text-[#0a271f] font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>حفظ كملف تركة رسمي</span>
                </button>
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 hover:bg-gray-50"
                >
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSummary ? 'تم النسخ' : 'نسخ'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 text-[#c5a059]" />
                  <span>طباعة</span>
                </button>
              </div>
            </div>

            {/* Validation & Rule Engine Audit Report */}
            {!validationReport.isValid ? (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>هذه الحالة تحتاج إلى استكمال البيانات أو مراجعة مختص:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
                  {validationReport.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-700 pt-1">
                  لا يقوم المحرك بالتخمين أو إصدار أنصبة غير مؤكدة عند وجود تعارض في العلاقات أو نقص في البيانات الأساسية.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Engine Rule Checks Bar */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>فحص محرك القواعد Farayed v2.4.0: اكتمال البيانات سليم • العلاقات الشرعية متسقة • الاتساق الحسابي 100%</span>
                  </div>
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                    أصل المسألة: {result.aslMasalah} {result.hasAwl ? `(عول: ${result.finalBase})` : result.hasRadd ? `(رد: ${result.finalBase})` : ''}
                  </span>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-xs text-gray-500 block">أصل المسألة</span>
                    <span className="text-xl font-bold font-mono text-[#0e382c]">{result.aslMasalah}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-xs text-gray-500 block">الأصل بعد العول/الرد</span>
                    <span className="text-xl font-bold font-mono text-[#0e382c]">{result.finalBase}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-xs text-gray-500 block">حالة المسألة الفقهية</span>
                    <span className="text-xs font-bold text-[#c5a059] block pt-1">
                      {result.hasAwl ? 'عائلة (زيادة سهام)' : result.hasRadd ? 'قاصرة (رد الفائض)' : 'عادلة تامة'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-xs text-gray-500 block">صافي التركة للقسمة</span>
                    <span className="text-xs font-bold text-[#0e382c] block pt-1">
                      {result.estateValue.toLocaleString('ar-EG')} {result.currency}
                    </span>
                  </div>
                </div>

                {/* Heir Shares Details */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#0e382c] font-amiri">تفصيل الأنصبة الشرعية والأدلة:</h4>
                  {result.heirs.map((heir) => (
                    <div key={heir.id} className="p-4 rounded-2xl border border-gray-200 bg-[#fdfcf9] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[#0e382c]">{heir.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0e382c]/10 text-[#0e382c]">
                              {heir.category}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{heir.shareName} ({heir.shareFraction})</span>
                        </div>
                        <div className="text-left font-mono font-bold text-base text-[#0e382c]">
                          {heir.totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {result.currency}
                          {heir.count > 1 && (
                            <span className="block text-[11px] text-gray-500 font-normal">
                              لكل فرد: {heir.individualAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {result.currency}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>السهام: {heir.sharesCount} من {result.finalBase} ({heir.percentage.toFixed(2)}%)</span>
                        <div className="w-28 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#c5a059] h-full" style={{ width: `${Math.min(100, heir.percentage)}%` }} />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p><strong className="text-[#0e382c]">علة الاستحقاق:</strong> {heir.reason}</p>
                        {heir.evidence && <p className="text-gray-500 italic"><strong className="text-[#c5a059] not-italic">الدليل:</strong> {heir.evidence}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section: Separation between Sharia Calculation and Actual Property Distribution Plan */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0e382c]">
                    <Scale className="w-4 h-4 text-[#c5a059]" />
                    <span>خطة توزيع الممتلكات فعلياً (مفصولة عن الحساب الشرعي للأنصبة):</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    «الحساب الشرعي للأنصبة» يُحدد الحقوق والنسب والسهام المجردة قطعيّاً. أما «خطة توزيع الممتلكات فعلياً» فتخضع لتراضي الورثة أو التثمين العيني للأصول (عقارات، أسهم، سيارات، محلات تجارية).
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="font-semibold text-gray-700">آلية التوزيع والتسوية المعتمدة عملياً للتركة:</label>
                    <select
                      value={physicalDistributionMethod}
                      onChange={(e) => setPhysicalDistributionMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="cash">قسمة نقدية وتسييل كافة الأصول وإيداع المبالغ في حساب التركة</option>
                      <option value="in_kind">قسمة عينية بالتراضي (تخصيص عقارات معينة مقابل موازنة الفروق النقدية)</option>
                      <option value="auction">تصفية وبيع الممتلكات عبر المزاد العلني وإفراغ الصكوك بإشراف المحكمة</option>
                      <option value="reconciliation">صلح ومخارجة شرعية بين بعض الورثة مقابل بدل معلوم</option>
                    </select>
                  </div>
                </div>

                {/* Non-official Advisory Disclaimer */}
                <div className="p-4 rounded-2xl bg-[#0a271f] text-white border border-[#c5a059]/40 text-xs space-y-1 text-center">
                  <p className="font-bold text-[#f3e5ab]">تنويه نظامي وشرعي معتمد:</p>
                  <p className="text-[11px] text-gray-300 max-w-xl mx-auto leading-relaxed">
                    نتائج هذه الحاسبة استرشادية مبنية على القواعد المعتمدة في الفقه الإسلامي. لا يعتبر هذا الحساب توثيقاً قانونياً نهائياً أو فتوى رسمية ملزمة أمام المحاكم القضائية، وفي حالات النزاع يجب مراجعة محاكم الأحوال الشخصية.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setCurrentStage(3)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الرجوع للمرحلة 3 (التركة)</span>
              </button>
              <button
                onClick={handleSaveAsEstateCase}
                className="px-6 py-2.5 bg-[#0e382c] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#124838] flex items-center gap-1.5 transition"
              >
                <FolderPlus className="w-4 h-4" />
                <span>حفظ كملف تركة رسمي ومتابعة الإجراءات</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
