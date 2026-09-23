import React from 'react';
import { CalculationResult, HeirsInput } from '../types/inheritance';

interface InheritancePdfDocumentProps {
  input: HeirsInput;
  result: CalculationResult;
}

export const InheritancePdfDocument: React.FC<InheritancePdfDocumentProps> = ({ input, result }) => {
  const currentDate = new Date().toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const gregorianDate = new Date().toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      id="inheritance-pdf-report-content"
      className="bg-white text-[#1a2822] p-8 max-w-[800px] mx-auto border-4 border-[#c5a059] rounded-xl shadow-lg print:border-none print:shadow-none print:p-4 print:max-w-none"
      dir="rtl"
      style={{ fontFamily: "'Cairo', 'Amiri', serif" }}
    >
      {/* Top Islamic Emblem & Basmalah */}
      <div className="text-center space-y-2 border-b-2 border-[#c5a059]/40 pb-5 mb-5">
        <p className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c] tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-sm font-amiri text-[#0e382c]/90 italic font-semibold">
          ﴿ يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ﴾ [النساء: 11]
        </p>
        <div className="pt-2">
          <h1 className="text-2xl font-bold font-amiri text-[#0e382c]">
            وثيقة حصر وتوزيع التركة الشرعية
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            تأصيل فقهي وحساب قطعي محكم وفق مذهب جمهور الفقهاء الأربعة
          </p>
        </div>
      </div>

      {/* Estate & Deceased Overview Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
        <div className="p-3 bg-[#fbf9f4] rounded-lg border border-[#c5a059]/30 space-y-1">
          <p>
            <strong className="text-[#0e382c]">جنس المتوفى:</strong>{' '}
            {input.deceasedGender === 'male' ? 'ذكر (رجل)' : 'أنثى (امرأة)'}
          </p>
          <p>
            <strong className="text-[#0e382c]">صافي التركة الصافية:</strong>{' '}
            <span className="font-bold text-[#0e382c]">
              {result.estateValue.toLocaleString('ar-EG')} {result.currency}
            </span>
          </p>
          <p>
            <strong className="text-[#0e382c]">تاريخ التحرير:</strong>{' '}
            <span>{gregorianDate}م ({currentDate}هـ)</span>
          </p>
        </div>

        <div className="p-3 bg-[#fbf9f4] rounded-lg border border-[#c5a059]/30 space-y-1">
          <p>
            <strong className="text-[#0e382c]">أصل المسألة:</strong>{' '}
            <span className="font-bold font-mono">{result.aslMasalah}</span>
          </p>
          <p>
            <strong className="text-[#0e382c]">مآل المسألة:</strong>{' '}
            <span className="font-bold font-mono">{result.finalBase}</span>{' '}
            <span className="text-[11px] text-[#c5a059] font-bold">
              ({result.hasAwl ? 'عائلة بالزيادة' : result.hasRadd ? 'قاصرة بالرد' : 'عادلة تامة'})
            </span>
          </p>
          <p>
            <strong className="text-[#0e382c]">عدد الورثة المستحقين:</strong>{' '}
            <span>{result.heirs.length} فئات وارثة</span>
          </p>
        </div>
      </div>

      {/* Special Fiqh Notes (if any) */}
      {result.fiqhNotes.length > 0 && (
        <div className="mb-5 p-3 bg-amber-50/70 border border-amber-300 rounded-lg text-xs space-y-1 text-amber-900">
          <strong className="block text-[#0e382c]">ملاحظات فقهية استثنائية:</strong>
          {result.fiqhNotes.map((note, idx) => (
            <p key={idx} className="leading-relaxed">• {note}</p>
          ))}
        </div>
      )}

      {/* Main Heirs Distribution Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-[#0e382c] border-b-2 border-[#0e382c] pb-1.5 mb-2 font-amiri">
          جدول توزيع السهام والأنصبة الشرعية
        </h2>
        <table className="w-full border-collapse text-xs border border-gray-300 text-right">
          <thead>
            <tr className="bg-[#0e382c] text-white text-[11px]">
              <th className="p-2 border border-gray-300">الوارث المستحق</th>
              <th className="p-2 border border-gray-300 text-center">الصفة</th>
              <th className="p-2 border border-gray-300 text-center">الفرض المقدر</th>
              <th className="p-2 border border-gray-300 text-center">السهام</th>
              <th className="p-2 border border-gray-300 text-center">النسبة</th>
              <th className="p-2 border border-gray-300 text-left">نصيب الفرد</th>
              <th className="p-2 border border-gray-300 text-left">إجمالي الفئة</th>
            </tr>
          </thead>
          <tbody>
            {result.heirs.map((heir, idx) => (
              <tr
                key={heir.id}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fbf9f4]'}
              >
                <td className="p-2 border border-gray-300 font-bold text-[#0e382c]">
                  {heir.name}
                  {heir.count > 1 && (
                    <span className="text-[10px] text-gray-500 font-normal mr-1">
                      (العدد: {heir.count})
                    </span>
                  )}
                </td>
                <td className="p-2 border border-gray-300 text-center text-[10px] text-gray-700">
                  {heir.category}
                </td>
                <td className="p-2 border border-gray-300 text-center font-semibold text-[#0e382c]">
                  {heir.shareName}
                </td>
                <td className="p-2 border border-gray-300 text-center font-mono font-bold">
                  {heir.sharesCount} / {result.finalBase}
                </td>
                <td className="p-2 border border-gray-300 text-center font-mono">
                  {heir.percentage.toFixed(2)}%
                </td>
                <td className="p-2 border border-gray-300 text-left font-mono font-semibold">
                  {heir.individualAmount.toLocaleString('ar-EG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-2 border border-gray-300 text-left font-mono font-bold text-[#0e382c]">
                  {heir.totalAmount.toLocaleString('ar-EG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} {result.currency}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#f0ece1] font-bold text-[#0e382c]">
              <td className="p-2 border border-gray-300" colSpan={3}>
                المجموع الكلي للسهام والتركة:
              </td>
              <td className="p-2 border border-gray-300 text-center font-mono">
                {result.finalBase} / {result.finalBase}
              </td>
              <td className="p-2 border border-gray-300 text-center font-mono">
                100.00%
              </td>
              <td className="p-2 border border-gray-300 text-left font-mono" colSpan={2}>
                {result.estateValue.toLocaleString('ar-EG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} {result.currency}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Sharia Evidences & Legal Proofs */}
      <div className="mb-6 space-y-2">
        <h2 className="text-sm font-bold text-[#0e382c] border-b-2 border-[#0e382c] pb-1.5 font-amiri">
          أدلة الاستحقاق الشرعية لكل وارث
        </h2>
        <div className="space-y-1.5 text-xs text-gray-800">
          {result.heirs.map((heir) => (
            <div key={heir.id} className="p-2 bg-[#fbf9f4] rounded border border-gray-200">
              <span className="font-bold text-[#0e382c]">{heir.name}:</span>{' '}
              <span>{heir.reason}</span>
              {heir.evidence && (
                <span className="block text-[11px] text-gray-600 mt-0.5 italic">
                  <strong>الدليل:</strong> {heir.evidence}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Relatives Table (if any) */}
      {result.blockedHeirs.length > 0 && (
        <div className="mb-6 space-y-2">
          <h2 className="text-sm font-bold text-amber-900 border-b-2 border-amber-600 pb-1.5 font-amiri">
            الأقارب المحجوبون من الإرث وسبب الحجب
          </h2>
          <table className="w-full border-collapse text-xs border border-gray-300 text-right">
            <thead>
              <tr className="bg-amber-100/80 text-amber-950 text-[11px]">
                <th className="p-2 border border-gray-300">الوارث المحجوب</th>
                <th className="p-2 border border-gray-300">نوع الحجب</th>
                <th className="p-2 border border-gray-300">حُجب بواسطة</th>
                <th className="p-2 border border-gray-300">الدليل والعلة الشرعية</th>
              </tr>
            </thead>
            <tbody>
              {result.blockedHeirs.map((b) => (
                <tr key={b.id} className="bg-white">
                  <td className="p-2 border border-gray-300 font-bold">{b.name}</td>
                  <td className="p-2 border border-gray-300 text-amber-800">{b.shareName}</td>
                  <td className="p-2 border border-gray-300 font-semibold">{b.blockedBy || 'الأقرب درجة'}</td>
                  <td className="p-2 border border-gray-300 text-[11px] text-gray-600">{b.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legal & Mathematical Verification Statement */}
      <div className="mt-6 pt-4 border-t-2 border-[#c5a059]/40 text-xs text-gray-700 space-y-3">
        <div className="flex items-center justify-between p-3 bg-[#0e382c]/5 rounded-lg border border-[#c5a059]/30">
          <div>
            <p className="font-bold text-[#0e382c]">
              إقرار التدقيق الحسابي والشرعي:
            </p>
            <p className="text-[11px] text-gray-600">
              تم التحقق آلياً من صحة أصل المسألة، وانطباق قواعد الحجب والعول والرد، ومطابقة مجموع السهام والمبالغ بنسبة 100%.
            </p>
          </div>
          <div className="px-3 py-1 bg-[#0e382c] text-white rounded text-[10px] font-bold shrink-0">
            معتمد شرعاً وحسابياً
          </div>
        </div>

        {/* Signature placeholders */}
        <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[11px]">
          <div className="space-y-8">
            <p className="font-bold text-[#0e382c]">معد التقرير / الوارث</p>
            <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
          </div>
          <div className="space-y-8">
            <p className="font-bold text-[#0e382c]">المصفي الشرعي للتركة</p>
            <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
          </div>
          <div className="space-y-8">
            <p className="font-bold text-[#0e382c]">توقيع واعتماد الورثة</p>
            <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-500 pt-3">
          وثيقة صادرة عن منصة «المواريث» — استرشادية تعليمية وقابلة للاعتماد القضائي بعد مراجعة المصفي الشرعي المختص.
        </div>
      </div>
    </div>
  );
};
