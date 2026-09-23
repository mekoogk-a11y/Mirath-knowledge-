import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';

const CURRENCIES = [
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
}

export const Calculator: React.FC<CalculatorProps> = ({
  initialPreset,
  onPresetConsumed,
}) => {
  const [input, setInput] = useState<HeirsInput>(INITIAL_INPUT);
  const [hasCalculated, setHasCalculated] = useState(true);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Compute calculation
  const result: CalculationResult = useMemo(() => {
    return calculateInheritance(input);
  }, [input]);

  useEffect(() => {
    if (initialPreset) {
      handleApplyPreset(initialPreset);
      if (onPresetConsumed) {
        onPresetConsumed();
      }
    }
  }, [initialPreset]);

  const handleGenderChange = (gender: 'male' | 'female') => {
    setInput((prev) => ({
      ...prev,
      deceasedGender: gender,
      hasHusband: gender === 'female' ? prev.hasHusband : false,
      wivesCount: gender === 'male' ? Math.max(1, prev.wivesCount) : 0,
    }));
  };

  const handleReset = () => {
    setInput({
      ...INITIAL_INPUT,
      estateValue: 100000,
    });
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
        sonsOfSonsCount: 0,
        daughtersOfSonsCount: 0,
        fullBrothersCount: 0,
        fullSistersCount: 0,
      });
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
        sonsOfSonsCount: 0,
        daughtersOfSonsCount: 0,
        fullBrothersCount: 0,
        fullSistersCount: 0,
      });
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
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textLines = [
      `مسألة قسمة مواريث شرعية`,
      `المتوفى: ${input.deceasedGender === 'male' ? 'ذكر (رجل)' : 'أنثى (امرأة)'}`,
      `قيمة التركة: ${result.estateValue.toLocaleString('ar-EG')} ${result.currency}`,
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
      `تم الحساب عبر: تطبيق ومنصة المواريث والوقف`,
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <CalcIcon className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>محرك الفرائض الشرعي الحسابي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          حاسبة المواريث والتركات
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          أدخل بيانات المتوفى والورثة وقيمة التركة، وسيقوم المحرك بحساب أصل المسألة والسهام، وتحديد الحجب مع ذكر العلة الفقهية والدليل من الكتاب والسنة.
        </p>

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">أمثلة سريعة:</span>
          <button
            onClick={() => handleApplyPreset('wife_sons_daughters')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition"
          >
            زوجة + أم + ابنان وبنتان
          </button>
          <button
            onClick={() => handleApplyPreset('umariyyah')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition"
          >
            المسألة العمرية (زوج + أم + أب)
          </button>
          <button
            onClick={() => handleApplyPreset('manbariyyah')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition"
          >
            المسألة المنبرية (عول)
          </button>
          <button
            onClick={() => handleApplyPreset('single_daughter')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition"
          >
            زوجة + بنت (الرد)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Column: Input Controls (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#c5a059]/30 shadow-sm space-y-5 text-right">
            <h2 className="font-bold text-lg text-[#0e382c] border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>بيانات المتوفى والتركة</span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 font-normal transition"
                title="إعادة ضبط"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </h2>

            {/* Deceased Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">جنس المتوفى:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition ${
                    input.deceasedGender === 'male'
                      ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-xs'
                      : 'bg-[#fbf9f4] border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ذكر (رجل)
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition ${
                    input.deceasedGender === 'female'
                      ? 'bg-[#0e382c] text-white border-[#0e382c] shadow-xs'
                      : 'bg-[#fbf9f4] border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  أنثى (امرأة)
                </button>
              </div>
            </div>

            {/* Estate Value and Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">قيمة التركة الصافية:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={input.estateValue || ''}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        estateValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full py-2 px-3 rounded-xl border border-gray-200 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] text-sm text-left font-mono font-medium outline-hidden"
                    placeholder="100000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">العملة:</label>
                <select
                  value={input.currency}
                  onChange={(e) => setInput((prev) => ({ ...prev, currency: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white focus:border-[#0e382c] text-sm outline-hidden font-medium"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Relatives: Spouse */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">1. الزوجية</h3>
              {input.deceasedGender === 'male' ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f4] border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">عدد الزوجات على ذمته:</span>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setInput((prev) => ({ ...prev, wivesCount: count }))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          input.wivesCount === count
                            ? 'bg-[#0e382c] text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f4] border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">هل الزوج على قيد الحياة؟</span>
                  <button
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, hasHusband: !prev.hasHusband }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      input.hasHusband
                        ? 'bg-[#0e382c] text-white'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    {input.hasHusband ? 'نعم (حي)' : 'لا'}
                  </button>
                </div>
              )}
            </div>

            {/* Relatives: Parents & Grandparents */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">2. الأصول (الوالدان والأجداد)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${input.hasFather ? 'bg-[#0e382c]/10 border-[#0e382c] text-[#0e382c] font-bold' : 'bg-[#fbf9f4] border-gray-200 text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={input.hasFather}
                    onChange={(e) => setInput((prev) => ({ ...prev, hasFather: e.target.checked }))}
                    className="accent-[#0e382c]"
                  />
                  <span>الأب على قيد الحياة</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${input.hasMother ? 'bg-[#0e382c]/10 border-[#0e382c] text-[#0e382c] font-bold' : 'bg-[#fbf9f4] border-gray-200 text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={input.hasMother}
                    onChange={(e) => setInput((prev) => ({ ...prev, hasMother: e.target.checked }))}
                    className="accent-[#0e382c]"
                  />
                  <span>الأم على قيد الحياة</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${input.hasPaternalGrandfather ? 'bg-[#0e382c]/10 border-[#0e382c] text-[#0e382c] font-bold' : 'bg-[#fbf9f4] border-gray-200 text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={input.hasPaternalGrandfather}
                    onChange={(e) => setInput((prev) => ({ ...prev, hasPaternalGrandfather: e.target.checked }))}
                    className="accent-[#0e382c]"
                  />
                  <span>الجد لأب (أبو الأب)</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${input.hasMaternalGrandmother ? 'bg-[#0e382c]/10 border-[#0e382c] text-[#0e382c] font-bold' : 'bg-[#fbf9f4] border-gray-200 text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={input.hasMaternalGrandmother}
                    onChange={(e) => setInput((prev) => ({ ...prev, hasMaternalGrandmother: e.target.checked }))}
                    className="accent-[#0e382c]"
                  />
                  <span>الجدة أم الأم</span>
                </label>

                <label className={`col-span-2 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${input.hasPaternalGrandmother ? 'bg-[#0e382c]/10 border-[#0e382c] text-[#0e382c] font-bold' : 'bg-[#fbf9f4] border-gray-200 text-gray-700'}`}>
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

            {/* Relatives: Children & Grandchildren */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">3. الفروع (الأولاد وأولاد الابن)</h3>
              <div className="space-y-2">
                {/* Sons and Daughters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-medium text-gray-700 block mb-1.5">عدد الأبناء (ذكور):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsCount: Math.max(0, p.sonsCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.sonsCount}
                        onChange={(e) => setInput((p) => ({ ...p, sonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center py-1 text-sm font-bold bg-white rounded-lg border border-gray-200 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsCount: p.sonsCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-medium text-gray-700 block mb-1.5">عدد البنات (إناث):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersCount: Math.max(0, p.daughtersCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.daughtersCount}
                        onChange={(e) => setInput((p) => ({ ...p, daughtersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center py-1 text-sm font-bold bg-white rounded-lg border border-gray-200 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersCount: p.daughtersCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sons of sons & Daughters of sons */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-medium text-gray-700 block mb-1.5">أبناء الابن:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsOfSonsCount: Math.max(0, p.sonsOfSonsCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.sonsOfSonsCount}
                        onChange={(e) => setInput((p) => ({ ...p, sonsOfSonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center py-1 text-sm font-bold bg-white rounded-lg border border-gray-200 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, sonsOfSonsCount: p.sonsOfSonsCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-medium text-gray-700 block mb-1.5">بنات الابن:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersOfSonsCount: Math.max(0, p.daughtersOfSonsCount - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={input.daughtersOfSonsCount}
                        onChange={(e) => setInput((p) => ({ ...p, daughtersOfSonsCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-12 text-center py-1 text-sm font-bold bg-white rounded-lg border border-gray-200 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setInput((p) => ({ ...p, daughtersOfSonsCount: p.daughtersOfSonsCount + 1 }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold hover:bg-gray-100 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Relatives: Siblings */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">4. الحواشي (الإخوة والأخوات)</h3>
              <div className="space-y-2 text-xs">
                {/* Full siblings */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">إخوة أشقاء:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.fullBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, fullBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">أخوات شقيقات:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.fullSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, fullSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>

                {/* Paternal siblings */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">إخوة لأب:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.paternalBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, paternalBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">أخوات لأب:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.paternalSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, paternalSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>

                {/* Maternal siblings */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">إخوة لأم:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.maternalBrothersCount}
                      onChange={(e) => setInput((p) => ({ ...p, maternalBrothersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fbf9f4] border border-gray-100">
                    <span className="text-gray-700">أخوات لأم:</span>
                    <input
                      type="number"
                      min="0"
                      value={input.maternalSistersCount}
                      onChange={(e) => setInput((p) => ({ ...p, maternalSistersCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-12 text-center py-1 font-bold bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculation Results (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-6">
          {!result.isValid ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-600" />
              <h3 className="font-bold text-lg">تنبيه في المدخلات</h3>
              <p className="text-sm">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="font-bold text-lg text-[#0e382c] font-amiri">
                      نتيجة قسمة التركة وتوزيع السهام
                    </h2>
                    <p className="text-xs text-gray-500">
                      محسوبة وفق إجماع وقواعد أئمة الفقه الإسلامي المعتمدة
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="p-2 rounded-xl bg-[#c5a059]/15 hover:bg-[#c5a059]/25 text-[#0e382c] text-xs font-semibold flex items-center gap-1.5 transition border border-[#c5a059]/30"
                      title="نسخ ملخص المسألة"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span className="text-emerald-800 font-bold">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#c5a059]" />
                          <span className="hidden sm:inline">نسخ الملخص</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-xl bg-[#0e382c]/5 hover:bg-[#0e382c]/10 text-[#0e382c] text-xs font-semibold flex items-center gap-1.5 transition border border-gray-200"
                      title="طباعة التقرير"
                    >
                      <Printer className="w-4 h-4 text-[#c5a059]" />
                      <span className="hidden sm:inline">طباعة المسألة</span>
                    </button>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-[11px] text-gray-500 block">أصل المسألة</span>
                    <span className="text-xl font-bold font-mono text-[#0e382c]">
                      {result.aslMasalah}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-[11px] text-gray-500 block">
                      {result.hasAwl ? 'عالت المسألة إلى' : result.hasRadd ? 'رُدَّت المسألة إلى' : 'الأصل المصحح'}
                    </span>
                    <span className="text-xl font-bold font-mono text-[#0e382c]">
                      {result.finalBase}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-[11px] text-gray-500 block">حالة المسألة</span>
                    <span className="text-xs sm:text-sm font-bold text-[#c5a059] block pt-1">
                      {result.hasAwl
                        ? 'عائلة (زيادة سهام)'
                        : result.hasRadd
                        ? 'قاصرة (رد الفائض)'
                        : 'عادلة تامة'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20">
                    <span className="text-[11px] text-gray-500 block">صافي التركة</span>
                    <span className="text-xs sm:text-sm font-bold text-[#0e382c] block pt-1">
                      {result.estateValue.toLocaleString('ar-EG')} {result.currency}
                    </span>
                  </div>
                </div>

                {/* Visual Distribution Bar */}
                {result.heirs.length > 0 && result.finalBase > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                      <span className="font-bold text-[#0e382c] font-amiri text-sm">
                        المخطط البياني لتوزيع التركة الشرعية:
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">100% توزيع كامل</span>
                    </div>

                    <div className="h-7 w-full rounded-xl overflow-hidden flex bg-gray-100 border border-[#c5a059]/30 shadow-inner">
                      {result.heirs.map((heir, idx) => {
                        const pct = Math.max(1, (heir.sharesCount / result.finalBase) * 100);
                        const palette = [
                          'bg-[#0e382c]',
                          'bg-[#c5a059]',
                          'bg-[#1a5b48]',
                          'bg-[#d8b56d]',
                          'bg-[#2d7a64]',
                          'bg-[#a8823c]',
                          'bg-[#3d9179]',
                        ];
                        const barBg = palette[idx % palette.length];
                        return (
                          <div
                            key={heir.id}
                            style={{ width: `${pct}%` }}
                            className={`${barBg} h-full transition-all relative group flex items-center justify-center text-white text-[11px] font-bold overflow-hidden select-none hover:brightness-110 cursor-pointer`}
                            title={`${heir.name}: ${heir.shareName} (${heir.shareFraction}) (${pct.toFixed(1)}%) — ${heir.totalAmount.toLocaleString('ar-EG')} ${result.currency}`}
                          >
                            {pct > 10 && <span className="truncate px-1.5">{heir.name}</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px]">
                      {result.heirs.map((heir, idx) => {
                        const pct = ((heir.sharesCount / result.finalBase) * 100).toFixed(1);
                        const palette = [
                          'bg-[#0e382c]',
                          'bg-[#c5a059]',
                          'bg-[#1a5b48]',
                          'bg-[#d8b56d]',
                          'bg-[#2d7a64]',
                          'bg-[#a8823c]',
                          'bg-[#3d9179]',
                        ];
                        const dotBg = palette[idx % palette.length];
                        return (
                          <div key={heir.id} className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${dotBg} shrink-0`} />
                            <span className="font-semibold text-[#0e382c]">{heir.name}:</span>
                            <span className="text-gray-500 font-mono">
                              {heir.shareFraction} ({pct}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Fiqh special notes (e.g. Umariyyah, Manbariyyah) */}
                {result.fiqhNotes.length > 0 && (
                  <div className="space-y-2">
                    {result.fiqhNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-3 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs text-[#0e382c]"
                      >
                        <Info className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Table / Cards of Heirs */}
              <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/40 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#0e382c] font-amiri flex items-center justify-between">
                  <span>جدول أنصبة الورثة المستحقين ({result.heirs.length})</span>
                  <span className="text-xs text-green-700 font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تدقيق السهام والمبالغ: 100% مطابق</span>
                  </span>
                </h3>

                <div className="space-y-3">
                  {result.heirs.map((heir) => (
                    <div
                      key={heir.id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#c5a059]/50 transition bg-[#fdfcf9] space-y-3 text-right"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[#0e382c]">
                              {heir.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0e382c]/10 text-[#0e382c] font-medium">
                              {heir.category}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {heir.shareName}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="text-left sm:text-left">
                          <span className="text-lg font-bold font-mono text-[#0e382c]">
                            {heir.totalAmount.toLocaleString('ar-EG', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{' '}
                            <span className="text-xs font-sans text-gray-600">
                              {result.currency}
                            </span>
                          </span>
                          {heir.count > 1 && (
                            <span className="block text-[11px] text-gray-500 font-mono">
                              نصيب الفرد الواحد:{' '}
                              {heir.individualAmount.toLocaleString('ar-EG', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{' '}
                              {result.currency}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shares & Percentage Bar */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0e382c]">
                            السهام: {heir.sharesCount} من {result.finalBase}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span>النسبة: {heir.percentage.toFixed(2)}%</span>
                        </div>
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#c5a059] h-full rounded-full"
                            style={{ width: `${Math.min(100, heir.percentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Reason & Evidence (Why) */}
                      <div className="pt-1 space-y-1.5 text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                        <p>
                          <strong className="text-[#0e382c]">علة الاستحقاق:</strong> {heir.reason}
                        </p>
                        {heir.evidence && (
                          <p className="text-gray-600 italic">
                            <strong className="text-[#c5a059] not-italic">الدليل الشرعي:</strong> {heir.evidence}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocked Heirs Section */}
              {result.blockedHeirs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-gray-800 font-amiri flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>المحجوبون من الإرث وعلة الحجب ({result.blockedHeirs.length})</span>
                  </h3>

                  <div className="space-y-2.5">
                    {result.blockedHeirs.map((blocked) => (
                      <div
                        key={blocked.id}
                        className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5 text-right"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 text-sm">
                            {blocked.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-[10px] font-semibold">
                            {blocked.shareName}
                          </span>
                        </div>
                        <p className="text-amber-800">
                          <strong>سبب الحجب:</strong> {blocked.reason}
                        </p>
                        {blocked.blockedBy && (
                          <p className="text-amber-700">
                            <strong>حُجب بواسطة:</strong> {blocked.blockedBy}
                          </p>
                        )}
                        {blocked.evidence && (
                          <p className="text-gray-600 italic">
                            <strong>الدليل:</strong> {blocked.evidence}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step by Step Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-bold text-base text-[#0e382c] font-amiri">
                  خطوات الحساب والتأصيل الفقهي
                </h3>
                <div className="space-y-2.5">
                  {result.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#fbf9f4] border border-gray-100 text-xs text-right space-y-1"
                    >
                      <h4 className="font-bold text-[#0e382c]">{st.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{st.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
