import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Building,
  Users,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { platformStore } from '../../data/platformStore';

export const ReportsHub: React.FC = () => {
  const [reportType, setReportType] = useState<'estates' | 'waqf' | 'disbursements'>('estates');
  const estates = platformStore.getEstateCases();
  const waqfs = platformStore.getWaqfRecords();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
              <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>مركز التقارير والإحصاءات المعتمدة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
              التقارير الرسمية والبيانات الإحصائية
            </h1>
            <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
              تصدير وطباعة كشوفات التركات الشرعية، القوائم المالية للأوقاف، وحسابات الصرف والتوزيعات المعتمدة بصيغة رسمية موثقة.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#dfba73] hover:from-[#b38f4a] hover:to-[#c5a059] text-[#0a271f] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition active:scale-95 self-start"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير الحالي</span>
          </button>
        </div>
      </div>

      {/* Select Report View */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 text-xs font-bold w-fit">
        {[
          { id: 'estates', label: 'تقرير كشف التركات وحصر الأنصبة' },
          { id: 'waqf', label: 'تقرير الموقف المالي للأوقاف والأصول' },
          { id: 'disbursements', label: 'كشف دورة الصرف والمستفيدين' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition ${
              reportType === tab.id
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Canvas / Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#c5a059]/30 shadow-md space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Official Header */}
        <div className="border-b-2 border-[#0e382c] pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <span className="font-amiri text-2xl font-bold text-[#0e382c]">منصة الميراث والوقف</span>
            <p className="text-xs text-gray-500 mt-1">«معرفة أوضح. إدارة منظمة. أثر مستمر.»</p>
          </div>
          <div className="text-left text-xs font-mono text-gray-500">
            <div>التاريخ: {new Date().toISOString().split('T')[0]}</div>
            <div>رقم التقرير: REP-{Math.floor(Math.random() * 89999) + 10000}</div>
            <div>جهة الإصدار: النظام المركزي الموحد</div>
          </div>
        </div>

        {/* 1. Estates Report */}
        {reportType === 'estates' && (
          <div className="space-y-6 text-xs">
            <h3 className="text-base font-bold text-[#0e382c]">كشف ملفات التركات المسجلة والمعتمدة:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-700">
                    <th className="p-3">رقم الملف</th>
                    <th className="p-3">المتوفى</th>
                    <th className="p-3">تاريخ الوفاة</th>
                    <th className="p-3">إجمالي التركة</th>
                    <th className="p-3">الالتزامات</th>
                    <th className="p-3">الصافي الموزع</th>
                    <th className="p-3">الحالة الشرعية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {estates.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-mono font-bold">{c.caseNumber}</td>
                      <td className="p-3 font-bold text-gray-900">{c.deceasedName}</td>
                      <td className="p-3 font-mono text-gray-600">{c.deathDate}</td>
                      <td className="p-3 font-mono">{c.totalGrossEstate.toLocaleString('ar-EG')} {c.currency}</td>
                      <td className="p-3 font-mono text-red-600">{c.totalObligations.toLocaleString('ar-EG')} {c.currency}</td>
                      <td className="p-3 font-mono font-bold text-[#0e382c]">{c.netDistributableEstate.toLocaleString('ar-EG')} {c.currency}</td>
                      <td className="p-3 font-semibold">{c.statusText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Waqf Report */}
        {reportType === 'waqf' && (
          <div className="space-y-6 text-xs">
            <h3 className="text-base font-bold text-[#0e382c]">القائمة المالية للأوقاف والأصول:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-700">
                    <th className="p-3">اسم الوقف</th>
                    <th className="p-3">رقم الصك</th>
                    <th className="p-3">الناظر</th>
                    <th className="p-3">قيمة الأصول</th>
                    <th className="p-3">الرصيد النقدي</th>
                    <th className="p-3">الإيراد السنوي</th>
                    <th className="p-3">المصروف السنوي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {waqfs.map((w) => (
                    <tr key={w.id}>
                      <td className="p-3 font-bold text-gray-900">{w.name}</td>
                      <td className="p-3 font-mono text-gray-600">{w.deedNumber}</td>
                      <td className="p-3">{w.trusteeName}</td>
                      <td className="p-3 font-mono font-bold">{w.totalValue.toLocaleString('ar-EG')} ريال</td>
                      <td className="p-3 font-mono text-[#0e382c] font-bold">{w.currentCashBalance.toLocaleString('ar-EG')} ريال</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">+{w.totalAnnualRevenue.toLocaleString('ar-EG')} ريال</td>
                      <td className="p-3 font-mono text-red-600 font-bold">-{w.totalAnnualExpenses.toLocaleString('ar-EG')} ريال</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Disbursements Report */}
        {reportType === 'disbursements' && (
          <div className="space-y-6 text-xs">
            <h3 className="text-base font-bold text-[#0e382c]">كشف دورة الصرف ومصارف الأوقاف:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-700">
                    <th className="p-3">رقم المعاملة</th>
                    <th className="p-3">عنوان الصرف</th>
                    <th className="p-3">المستفيد</th>
                    <th className="p-3">التصنيف</th>
                    <th className="p-3">المبلغ</th>
                    <th className="p-3">المرحلة الحالية</th>
                    <th className="p-3">تاريخ المقترح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {waqfs.flatMap((w) => w.disbursements || []).map((d) => (
                    <tr key={d.id}>
                      <td className="p-3 font-mono font-bold">{d.referenceNumber}</td>
                      <td className="p-3 font-bold text-gray-900">{d.title}</td>
                      <td className="p-3">{d.beneficiaryOrVendor}</td>
                      <td className="p-3">{d.category}</td>
                      <td className="p-3 font-mono font-bold text-[#0e382c]">{d.amount.toLocaleString('ar-EG')} {d.currency}</td>
                      <td className="p-3 font-semibold">{d.currentStageName}</td>
                      <td className="p-3 font-mono text-gray-500">{d.proposalDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official Footer Disclaimer */}
        <div className="pt-6 border-t border-gray-200 text-center text-gray-400 text-[11px] space-y-1">
          <p>هذا التقرير صادر إلكترونياً من منصة الميراث والوقف المعتمدة، ويعتبر وثيقة مراجعة داخلية واستعراضاً تنظيمياً.</p>
          <p>في حالات النزاع القضائي أو الإفراغ العقاري الرسمي، يرجع للدوائر القضائية والمحاكم الشرعية المختصة.</p>
        </div>
      </div>
    </div>
  );
};
