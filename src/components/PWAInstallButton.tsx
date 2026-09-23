import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Check, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'badge';
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  label = 'تثبيت التطبيق',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setIsSuccess(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#0e382c] to-[#155443] hover:from-[#09291f] hover:to-[#0e382c] text-[#fbf9f4] border border-[#c5a059]/40 shadow-sm shadow-[#0e382c]/20';
      case 'outline':
        return 'bg-white/80 backdrop-blur-sm border border-[#c5a059] text-[#0e382c] hover:bg-[#0e382c]/5';
      case 'badge':
        return 'bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/25 text-xs py-1.5 px-3';
      default:
        return 'bg-[#0e382c] text-white';
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] ${getButtonStyles()} ${className}`}
        title="تثبيت تطبيق المواريث على هاتفك"
      >
        {isSuccess ? (
          <>
            <Check className="w-4 h-4 text-[#c5a059]" />
            <span>تم التثبيت بنجاح</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-[#c5a059]" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Guide Modal for iOS or Browsers without automatic prompt */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-[#c5a059]/30 p-6 shadow-2xl text-right">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 left-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#0e382c]/10 text-[#0e382c] rounded-xl border border-[#c5a059]/30">
                <Smartphone className="w-6 h-6 text-[#0e382c]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0e382c]">تثبيت تطبيق المواريث</h3>
                <p className="text-xs text-gray-500">يعمل بدون إنترنت وبسرعة فائقة</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-gray-700 bg-[#fbf9f4] p-4 rounded-xl border border-[#c5a059]/20">
                <p className="font-semibold text-[#0e382c]">خطوات التثبيت على آيفون وآيباد:</p>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0e382c] text-white text-xs font-bold shrink-0">1</span>
                  <p>اضغط على زر <strong>المشاركة (Share)</strong> <Share2 className="inline w-4 h-4 text-[#0e382c] mx-1" /> أسفل متصفح سفاري.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0e382c] text-white text-xs font-bold shrink-0">2</span>
                  <p>مرر لأسفل ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0e382c] text-white text-xs font-bold shrink-0">3</span>
                  <p>اضغط على <strong>"إضافة" (Add)</strong> في أعلى الزاوية.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-700 bg-[#fbf9f4] p-4 rounded-xl border border-[#c5a059]/20">
                <p className="font-semibold text-[#0e382c]">خطوات التثبيت على أندرويد والمتصفح:</p>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0e382c] text-white text-xs font-bold shrink-0">1</span>
                  <p>اضغط على قائمة المتصفح <strong>(نقاط الخيارات الثلاث ⋮)</strong> بأعلى الشاشة.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0e382c] text-white text-xs font-bold shrink-0">2</span>
                  <p>اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 px-4 bg-[#0e382c] hover:bg-[#155443] text-white font-medium rounded-xl text-sm transition shadow-sm"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
