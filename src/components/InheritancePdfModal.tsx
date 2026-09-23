import React, { useState } from 'react';
import { CalculationResult, HeirsInput } from '../types/inheritance';
import { InheritancePdfDocument } from './InheritancePdfDocument';
import { generateInheritancePdf } from '../utils/pdfGenerator';
import { FileDown, Printer, X, Check, RefreshCw, Eye } from 'lucide-react';

interface InheritancePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: HeirsInput;
  result: CalculationResult;
}

export const InheritancePdfModal: React.FC<InheritancePdfModalProps> = ({
  isOpen,
  onClose,
  input,
  result,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    const docElement = document.getElementById('inheritance-pdf-report-content');
    if (!docElement) return;

    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `وثيقة_توزيع_الميراث_الشرعي_${timestamp}.pdf`;

      await generateInheritancePdf(docElement, {
        fileName,
        onProgress: (stage) => setProgressMsg(stage),
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('حدث خطأ أثناء إنشاء ملف PDF، يرجى المحاولة مرة أخرى أو استخدام خيار الطباعة المباشرة.');
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#fbf9f4] rounded-3xl border border-[#c5a059]/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-right">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#0e382c] to-[#155443] text-white border-b border-[#c5a059]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059]/20 rounded-xl border border-[#c5a059]/40 text-[#f3e5ab]">
              <FileDown className="w-5 h-5 text-[#f3e5ab]" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-amiri text-[#fdfbf7]">
                وثيقة توزيع الميراث — ملف PDF منسق للطباعة
              </h2>
              <p className="text-xs text-[#e8e4da]/80">
                وثيقة رسمية منسقة بدقة تتضمن كامل الأنصبة والأدلة الشرعية وتفاصيل السهام
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm ${
                downloadSuccess
                  ? 'bg-green-700 text-white'
                  : 'bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] active:scale-98'
              } disabled:opacity-60`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0e382c]" />
                  <span>{progressMsg || 'جاري تجهيز PDF...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>تم تحميل الملف بنجاح!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-[#0e382c]" />
                  <span>تحميل ملف PDF الآن</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition active:scale-98"
            >
              <Printer className="w-4 h-4 text-[#c5a059]" />
              <span>طباعة فورية / حفظ كـ PDF</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 hidden sm:flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#c5a059]" />
            <span>معاينة حية للمستند قبل الحفظ والطباعة</span>
          </div>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#e9e4d6]/60">
          <InheritancePdfDocument input={input} result={result} />
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>
            الملف جاهز للطباعة على ورق قياس A4 بحجم مثالي وهوامش متناسقة.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
