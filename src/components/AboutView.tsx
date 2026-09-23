import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Calculator,
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  CreditCard,
  Copy,
  Check,
  HeartHandshake,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const AboutView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = '2813955';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 text-right" dir="rtl">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#0e382c] via-[#124637] to-[#0a271f] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-[#c5a059]/40 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center shadow-inner">
          <span className="font-amiri text-[#f3e5ab] text-3xl font-bold">م</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
            عن تطبيق المواريث
          </h1>
          <p className="text-sm sm:text-base text-[#e8e4da] max-w-2xl mx-auto leading-relaxed font-sans">
            المواريث منصة تعليمية تهدف إلى تسهيل فهم علم الفرائض والمواريث، مع تقديم أدوات حسابية تعليمية، وإضافة قسم متخصص في الوقف وأحكامه، خدمةً لطلاب العلم والباحثين وحفظاً لأموال المسلمين وأوقافهم ومواريثهم.
          </p>
        </div>
      </section>

      {/* Developer and Contact Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c5a059]/30 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-6 text-center sm:text-right">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              فريق الإعداد والتنفيذ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#0e382c]">
              تصميم وتطوير: كمال جعفر زكريا
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              تطوير برمجي وإسلامي متخصص يجمع بين التأصيل الشرعي والتقنية الحديثة وتجربة المستخدم الراقية.
            </p>
          </div>

          {/* Direct WhatsApp Button */}
          <a
            href="https://wa.me/249919980435"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 shrink-0"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>تواصل عبر واتساب: 00249919980435</span>
            <ExternalLink className="w-4 h-4 text-emerald-200" />
          </a>
        </div>

        {/* Pillars of the Application */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-[#0e382c] font-amiri">
            أبرز مميزات منصة المواريث والوقف:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
            <div className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#0e382c]">
                <Calculator className="w-4 h-4 text-[#c5a059]" />
                <span>حاسبة المواريث القطعية</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                محرك حسابي منطقي مؤصل يحسب أنصبة الورثة، وأصول المسائل، والعول والرد وتصحيح الانكسار وتوليد وثيقة PDF معتمدة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#0e382c]">
                <Layers className="w-4 h-4 text-[#c5a059]" />
                <span>قسم الوقف وأحكامه الشامل</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                18 بطاقة تغطي شروط وأركان ومصارف وإدارة الوقف، مع قاموس المصطلحات، ودليل إنشاء وقف، ونموذج التوثيق القابل للطباعة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#0e382c]">
                <BookOpen className="w-4 h-4 text-[#c5a059]" />
                <span>كتاب الفرائض (28 فصلاً)</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                منهج علمي متكامل ومبسط لشرح جميع أبواب الفرائض من أحكام التركة وحتى المناسخات والحساب.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#0e382c]">
                <Download className="w-4 h-4 text-[#c5a059]" />
                <span>تطبيق ويب تقدمي (PWA) وعمل بدون إنترنت</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                قابل للتثبيت على الهاتف كأنه تطبيق أصيل، ويعمل بكفاءة وسرعة حتى بدون اتصال بالإنترنت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="bg-gradient-to-br from-[#0e382c] to-[#07241c] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#c5a059] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#c5a059]/30 pb-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-[#f3e5ab]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-amiri text-[#fdfbf7]">
                دعم ومساهمات تطوير التطبيق
              </h3>
              <p className="text-xs text-[#e8e4da]/80">
                صدقة جارية تسهم في استمرارية المنصة وتحديث خوارزميات الفرائض والذكاء الاصطناعي
              </p>
            </div>
          </div>
          <span className="text-xs bg-[#c5a059] text-[#0e382c] font-bold px-3 py-1 rounded-full">
            مساهمة وقفية
          </span>
        </div>

        <div className="bg-white/10 p-5 rounded-2xl border border-[#c5a059]/40 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 pb-2 text-xs">
            <span className="text-[#f3e5ab] font-bold">
              حساب بنك الخرطوم (Bank of Khartoum)
            </span>
            <span className="text-[#e8e4da]">
              باسم المصمم: <strong className="text-white font-amiri text-sm">كمال جعفر</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs text-[#c5a059] font-semibold block">
                رقم الحساب المصرفي (تطبيق بنكك):
              </span>
              <div className="font-mono text-3xl font-extrabold tracking-widest text-[#f3e5ab] select-all">
                {accountNumber}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>تم نسخ رقم الحساب بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ رقم الحساب {accountNumber}</span>
                  </>
                )}
              </button>

              <a
                href="https://wa.me/249919980435"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-[#fdfbf7] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب: 00249919980435</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#e8e4da]/90 leading-relaxed space-y-1">
          <p className="font-semibold text-[#f3e5ab]">
            قال رسول الله ﷺ: «إذا مات الإنسان انقطع عنه عمله إلا من ثلاثة: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له».
          </p>
          <p className="text-[11px] text-[#e8e4da]/70">
            تُصرف المساهمات في تشغيل خوادم الاستضافة، وتطوير محرّك حاسبة المواريث، وتحسين سرعة واستجابة المساعد الذكي، وإتاحة المراجع الفقهية مجاناً لجميع المسلمين.
          </p>
        </div>
      </section>

      {/* PWA Promotion Card */}
      <section className="bg-gradient-to-r from-[#fbf9f4] to-[#f4ede0] rounded-3xl p-6 sm:p-8 border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <h3 className="font-bold text-base text-[#0e382c] font-amiri">
            تثبيت التطبيق على الشاشة الرئيسية
          </h3>
          <p className="text-xs text-gray-600">
            احصل على تجربة سريعة وخفيفة وتصفح كامل الأحكام والحاسبة دون الحاجة لمتصفح الإنترنت.
          </p>
        </div>
        <PWAInstallButton variant="primary" className="py-2.5 px-6 text-sm shrink-0" />
      </section>
    </div>
  );
};
