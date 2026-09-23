import React, { useState } from 'react';
import { FileText, Printer, Download, AlertTriangle, CheckCircle, Sparkles, Building, User, Target, Shield } from 'lucide-react';
import { generateInheritancePdf } from '../utils/pdfGenerator';

export interface WaqfFormData {
  waqifName: string;
  waqfType: 'خيري' | 'ذري (أهلي)' | 'مشترك';
  waqfAsset: string;
  beneficiary: string;
  purpose: string;
  waqifConditions: string;
  nazirName: string;
  notes: string;
}

export const WaqfTemplateView: React.FC = () => {
  const [formData, setFormData] = useState<WaqfFormData>({
    waqifName: 'عبد الله بن عبد الرحمن',
    waqfType: 'مشترك',
    waqfAsset: 'عمارة سكنية مكونة من 4 طوابق و8 شقق بالحي الشرقي',
    beneficiary: 'أبناء الواقف وذريتهم المحتاجون، وطلاب العلم المكفولين',
    purpose: 'صرف 50% من الريع لدعم طلبة تحفيظ القرآن الكريم والفقراء، و50% لذريتي المحتاجين',
    waqifConditions: 'اقتطاع 15% من صافي الإيراد السنوي لصيانة المبنى، وتعيين الأرشد من أولادي ناظراً مع مكافأة 5%',
    nazirName: 'الابن الأكبر أو من تعينه المحكمة الشرعية حال تعذره',
    notes: 'إذا انقرضت الذرية بالكامل يُصرف كامل الريع لدار رعاية الأيتام بالمدينة',
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('waqf-printable-document');
    if (!element) return;
    try {
      setIsGeneratingPdf(true);
      await generateInheritancePdf(element, {
        fileName: `نموذج_معلومات_وقف_تعليمي_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تنزيل الملف، يمكنك استخدام زر الطباعة المباشرة.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Alert */}
      <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300/80 flex items-start gap-3 text-right">
        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-amber-900 font-amiri text-base">
            تنبيه شرعي وقانوني هام:
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed font-sans">
            هذا نموذج استرشادي تعليمي بحت لتنظيم الأفكار وصياغة البنود الأولية، وليس وثيقة قانونية أو صكاً رسمياً ملزماً. يلزم لإتمام الوقف وحمايته توثيقه وإفراغه لدى المحكمة الشرعية أو وزارة الأوقاف والجهات المختصة ببلدك.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#c5a059]/30 shadow-md space-y-4 text-right">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="p-2 bg-[#0e382c]/10 text-[#0e382c] rounded-xl">
              <FileText className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0e382c] font-amiri text-lg">
                إدخال بيانات الوقف
              </h3>
              <p className="text-[11px] text-gray-500">املأ الحقول لتوليد بطاقة الوقف المنظمة</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">اسم الواقف:</label>
              <input
                type="text"
                value={formData.waqifName}
                onChange={(e) => setFormData({ ...formData, waqifName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-sm"
                placeholder="الاسم الكامل للواقف..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">نوع الوقف:</label>
              <select
                value={formData.waqfType}
                onChange={(e) => setFormData({ ...formData, waqfType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-sm bg-white"
              >
                <option value="خيري">وقف خيري (لوجوه البر والمصالح العامة)</option>
                <option value="ذري (أهلي)">وقف ذري أهلي (للذرية والأقارب)</option>
                <option value="مشترك">وقف مشترك (يجمع بين الأهل والخير العام)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">أصل الوقف (العين الموقوفة):</label>
              <textarea
                rows={2}
                value={formData.waqfAsset}
                onChange={(e) => setFormData({ ...formData, waqfAsset: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-xs"
                placeholder="وصف العقار، الأرض، المزرعة، أو الأصول الموقوفة..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">الجهة أو الأشخاص المستفيدون:</label>
              <textarea
                rows={2}
                value={formData.beneficiary}
                onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-xs"
                placeholder="الجهات أو الفئات المستحقة..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">الغرض من الوقف ومصارفه:</label>
              <textarea
                rows={2}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-xs"
                placeholder="أوجه صرف الريع والأهداف المرجوة..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">شروط الواقف والنظارة:</label>
              <textarea
                rows={2}
                value={formData.waqifConditions}
                onChange={(e) => setFormData({ ...formData, waqifConditions: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-xs"
                placeholder="نسبة الصيانة، تحديد الناظر، شروط الاستحقاق..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">الناظر المقترح:</label>
              <input
                type="text"
                value={formData.nazirName}
                onChange={(e) => setFormData({ ...formData, nazirName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-sm"
                placeholder="اسم الناظر أو هيئة النظارة..."
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ملاحظات ومصرف بديل:</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-xs"
                placeholder="المصرف الاحتياطي، توجيهات إضافية..."
              />
            </div>
          </div>
        </div>

        {/* Live Document Preview & Actions (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              <span>معاينة حية لبطاقة الوقف</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-xs flex items-center gap-1.5 transition shadow-xs active:scale-98 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'جاري تجهيز PDF...' : pdfSuccess ? 'تم التحميل!' : 'حفظ كملف PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white font-medium text-xs flex items-center gap-1.5 transition active:scale-98"
              >
                <Printer className="w-4 h-4 text-[#c5a059]" />
                <span>طباعة النموذج</span>
              </button>
            </div>
          </div>

          {/* The Printable Element */}
          <div
            id="waqf-printable-document"
            className="bg-[#fdfcf9] text-[#1c2925] p-6 sm:p-8 rounded-3xl border-2 border-[#c5a059] shadow-lg text-right space-y-6 print:border-none print:shadow-none print:p-2"
            dir="rtl"
            style={{ fontFamily: "'Cairo', 'Amiri', serif" }}
          >
            {/* Header */}
            <div className="text-center border-b-2 border-[#c5a059]/40 pb-5 space-y-2">
              <p className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h2 className="text-2xl font-bold font-amiri text-[#0e382c]">
                نموذج معلومات وقف استرشادي
              </h2>
              <p className="text-xs text-gray-500 font-sans">
                صادر كمسودة تعليمية لتنظيم الأفكار وصياغة صك الوقفية الشرعية
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">نوع الوقف:</span>
                <span className="font-bold text-[#0e382c] text-sm">{formData.waqfType}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">تاريخ الإنشاء:</span>
                <span className="font-bold text-[#0e382c]">
                  {new Date().toLocaleDateString('ar-SA')}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 col-span-2 sm:col-span-1">
                <span className="text-gray-500 block text-[10px]">حالة الوثيقة:</span>
                <span className="font-bold text-amber-700">مسودة تعليمية غير مصدقة</span>
              </div>
            </div>

            {/* Structured Table/Cards */}
            <div className="space-y-3 text-xs font-sans">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-[#0e382c] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#c5a059]" />
                  <span>اسم الواقف:</span>
                </span>
                <p className="text-gray-800 pr-5 text-sm font-semibold">{formData.waqifName || '—'}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-[#0e382c] flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#c5a059]" />
                  <span>أصل الوقف (العين الموقوفة):</span>
                </span>
                <p className="text-gray-800 pr-5 leading-relaxed">{formData.waqfAsset || '—'}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-[#0e382c] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#c5a059]" />
                  <span>الجهات المستفيدة:</span>
                </span>
                <p className="text-gray-800 pr-5 leading-relaxed">{formData.beneficiary || '—'}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-[#0e382c]">الغرض من الوقف ومصارف الريع:</span>
                <p className="text-gray-800 pr-2 leading-relaxed">{formData.purpose || '—'}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-[#0e382c]">شروط الواقف المعتبرة:</span>
                <p className="text-gray-800 pr-2 leading-relaxed">{formData.waqifConditions || '—'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-[#0e382c] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#c5a059]" />
                    <span>ناظر الوقف المقترح:</span>
                  </span>
                  <p className="text-gray-800 pr-5">{formData.nazirName || '—'}</p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-[#0e382c]">المصرف البديل عند الانقطاع:</span>
                  <p className="text-gray-800 pr-2">{formData.notes || '—'}</p>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-300 text-[11px] text-amber-900 leading-relaxed font-sans">
              <strong>إقرار وإشعار:</strong> هذا نموذج تعليمي لتلخيص نية الواقف وشروطه، ولا يعتبر وثيقة شرعية ملزمة أو صكاً نافذاً ما لم يتم توثيقه وتصديقه رسمياً لدى المحكمة الشرعية أو وزارة الأوقاف المختصة وفق الأنظمة المرعية.
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 text-center text-[11px] font-sans">
              <div className="space-y-6">
                <p className="font-bold text-[#0e382c]">توقيع الواقف</p>
                <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
              </div>
              <div className="space-y-6">
                <p className="font-bold text-[#0e382c]">توقيع الناظر المقترح</p>
                <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
              </div>
              <div className="space-y-6">
                <p className="font-bold text-[#0e382c]">ختم واعتماد جهة التوثيق</p>
                <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
