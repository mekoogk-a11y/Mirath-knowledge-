import React, { useState, useEffect } from 'react';
import { runFarayedEngineTests, TestCaseResult } from '../engine/engineTests';
import { CheckCircle2, XCircle, RotateCw, ShieldCheck, Check, Info } from 'lucide-react';

export const EngineTestsView: React.FC = () => {
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState<number>(0);

  const runTests = () => {
    setIsRunning(true);
    const start = performance.now();
    const testRes = runFarayedEngineTests();
    const end = performance.now();
    setResults(testRes);
    setDuration(Math.round((end - start) * 100) / 100);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const totalPassed = results.filter((r) => r.passed).length;
  const allPassed = results.length > 0 && totalPassed === results.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>التدقيق والتحقق الحسابي والشرعي الآلي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          اختبارات محرك الفرائض الآلية
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          اختبارات برمجية قطعية تؤكد التزام المحرك بالحساب الدقيق لقواعد أصحاب الفروض والعصبات والحجب والعول والرد والتصحيح.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              allPassed
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {allPassed ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#0e382c]">
              حالة الاختبارات:{' '}
              {allPassed ? 'جميع الاختبارات ناجحة بنسبة 100%' : 'توجد إخفاقات'}
            </h2>
            <p className="text-xs text-gray-600">
              تم اجتياز {totalPassed} من أصل {results.length} مسألة فقهية وحسابية معقدة في {duration} مللي ثانية.
            </p>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2.5 rounded-xl bg-[#0e382c] text-white hover:bg-[#155443] transition text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#c5a059] ${isRunning ? 'animate-spin' : ''}`} />
          <span>إعادة تشغيل الاختبارات</span>
        </button>
      </div>

      {/* Test Cases List */}
      <div className="space-y-3">
        {results.map((test, index) => (
          <div
            key={test.id}
            className={`p-4 rounded-2xl border transition bg-white text-right space-y-2.5 ${
              test.passed ? 'border-gray-200 hover:border-green-300' : 'border-red-300 bg-red-50/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center text-xs font-bold font-mono">
                  {index + 1}
                </span>
                <h3 className="font-bold text-sm text-[#0e382c]">{test.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    test.passed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {test.passed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>ناجح ومطابق</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>فشل التحقق</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-700">
              <strong>وصف المسألة:</strong> {test.description}
            </p>

            <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 text-xs text-gray-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span>{test.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
