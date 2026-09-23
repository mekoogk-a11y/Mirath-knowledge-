import React, { useState } from 'react';
import {
  HeartHandshake,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  HelpCircle,
  X,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

export const ContributionTicker: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const bankName = 'بنك الخرطوم';
  const accountHolder = 'المصمم كمال جعفر';
  const accountNumber = '2813955';
  const whatsappNumber = '00249919980435';

  const handleCopyAccount = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tickerItems = [
    {
      type: 'highlight',
      text: '🌿 ساهم في دعم وتطوير تطبيق ومنصة المواريث والوقف لنشر العلم الشرعي صدقة جارية لك ولوالديك',
    },
    {
      type: 'account',
      text: '💳 حساب بنك الخرطوم باسم المصمم كمال جعفر:',
      number: accountNumber,
    },
    {
      type: 'contact',
      text: '📱 للتواصل عبر واتساب:',
      phone: whatsappNumber,
    },
    {
      type: 'hadith',
      text: '📖 قال رسول الله ﷺ: «إذا مات الإنسان انقطع عنه عمله إلا من ثلاثة: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له»',
    },
    {
      type: 'purpose',
      text: '⭐ مجالات الدعم: تكاليف الاستضافة، تطوير خوارزميات الفرائض، ونماذج الذكاء الاصطناعي',
    },
  ];

  const renderContent = (keyPrefix: string) => (
    <div className="flex items-center gap-8 px-4 shrink-0">
      {tickerItems.map((item, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-3 text-xs sm:text-sm">
          {item.type === 'account' ? (
            <div className="inline-flex items-center gap-2 bg-[#f3e5ab] text-[#0e382c] px-3 py-1 rounded-full font-bold shadow-xs border border-[#c5a059]">
              <CreditCard className="w-3.5 h-3.5 text-[#0e382c]" />
              <span>{item.text}</span>
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-[#c5a059]/50 select-all">
                {item.number}
              </span>
              <button
                onClick={handleCopyAccount}
                className="p-1 hover:bg-[#0e382c] hover:text-white rounded-md transition text-[#0e382c]"
                title="نسخ رقم الحساب"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : item.type === 'contact' ? (
            <div className="inline-flex items-center gap-1.5 text-[#fdfbf7]">
              <span>{item.text}</span>
              <a
                href={`https://wa.me/249919980435`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-[#f3e5ab] hover:underline inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                {item.phone}
              </a>
            </div>
          ) : (
            <span className="text-[#fdfbf7] font-medium whitespace-nowrap">
              {item.text}
            </span>
          )}
          <span className="text-[#c5a059] opacity-70 select-none">❖</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Ticker Bar */}
      <div className="relative bg-gradient-to-r from-[#07211a] via-[#0e382c] to-[#07211a] border-y border-[#c5a059]/40 shadow-sm text-white overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center h-10 sm:h-11">
          {/* Static Title Badge (Fixed on the right in RTL) */}
          <div className="z-10 shrink-0 bg-[#07211a] pr-3 sm:pr-4 pl-2 h-full flex items-center border-l border-[#c5a059]/30 shadow-md">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#c5a059] text-[#0e382c] px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-[#d8b56d] transition active:scale-95 shadow-xs"
              title="اضغط لمعرفة تفاصيل المساهمة ورقم الحساب"
            >
              <HeartHandshake className="w-3.5 h-3.5 animate-pulse" />
              <span className="whitespace-nowrap">مساهمات التطوير</span>
            </button>
          </div>

          {/* Marquee Wrapper: moves Right to Left */}
          <div
            className="flex-1 overflow-hidden relative cursor-pointer group flex items-center h-full"
            onClick={() => setShowModal(true)}
            title="انقر لعرض تفاصيل الحساب البنكي والمساهمة (أو قف بالماوس للإيقاف المؤقت)"
          >
            {/* Soft gradient masks on sides */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#07211a] to-transparent z-1 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#07211a] to-transparent z-1 pointer-events-none" />

            {/* Seamless Double Loop */}
            <div className="animate-ticker-left flex items-center py-1">
              {renderContent('loop1')}
              {renderContent('loop2')}
            </div>
          </div>

          {/* Quick Action Buttons on Left */}
          <div className="z-10 shrink-0 bg-[#07211a] pl-3 pr-2 h-full flex items-center border-r border-[#c5a059]/30 shadow-md gap-1.5">
            <button
              onClick={handleCopyAccount}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-[#f3e5ab] border border-[#c5a059]/40'
              }`}
              title="نسخ رقم الحساب 2813955"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span className="hidden sm:inline">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#f3e5ab]" />
                  <span className="hidden sm:inline font-mono">2813955</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="p-1 rounded-lg text-[#f3e5ab] hover:bg-white/10 transition"
              title="تفاصيل الحساب"
              aria-label="تفاصيل الحساب"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contribution Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#c5a059] shadow-2xl space-y-6 text-right relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0e382c] text-[#f3e5ab] flex items-center justify-center shadow-md shrink-0">
                <HeartHandshake className="w-6 h-6 text-[#c5a059]" />
              </div>
              <div>
                <h3 className="font-bold text-xl font-amiri text-[#0e382c]">
                  المساهمة في تطوير تطبيق المواريث والوقف
                </h3>
                <p className="text-xs text-gray-500">
                  صدقة جارية لنشر علم الفرائض وفقه الوقف وأحكامه
                </p>
              </div>
            </div>

            {/* Hadith */}
            <div className="bg-[#fbf9f4] p-4 rounded-2xl border border-[#c5a059]/30 text-xs sm:text-sm text-gray-700 leading-relaxed font-amiri text-center">
              «إِذَا مَاتَ الإنْسَانُ انْقَطَعَ عنْه عَمَلُهُ إِلَّا مِن ثَلَاثَةٍ: إِلَّا مِن صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو له»
            </div>

            {/* Account Box */}
            <div className="bg-gradient-to-br from-[#0e382c] to-[#07241c] text-white p-5 sm:p-6 rounded-2xl border-2 border-[#c5a059] shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#c5a059]" />
                  <span className="font-bold text-sm text-[#f3e5ab] font-amiri text-base">
                    {bankName} (Bank of Khartoum)
                  </span>
                </div>
                <span className="text-[11px] bg-[#c5a059] text-[#0e382c] font-bold px-2.5 py-0.5 rounded-full">
                  دعم وتطوير
                </span>
              </div>

              {/* Account Holder */}
              <div className="flex items-center justify-between text-xs sm:text-sm bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <span className="text-[#e8e4da]/80">اسم صاحب الحساب:</span>
                <span className="font-bold text-[#fdfbf7] font-amiri text-base">
                  {accountHolder}
                </span>
              </div>

              {/* Account Number Box */}
              <div className="flex items-center justify-between bg-white/10 p-3.5 rounded-xl border border-[#c5a059]/50">
                <div>
                  <span className="text-[11px] text-[#c5a059] block font-medium">رقم الحساب البنكي:</span>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-[#f3e5ab] select-all">
                    {accountNumber}
                  </div>
                </div>
                <button
                  onClick={() => handleCopyAccount()}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#e0ded8]/80 text-center">
                يمكنك التحويل المباشر عبر تطبيق بنكك (Bankak) أو فروع بنك الخرطوم.
              </p>
            </div>

            {/* Development Purposes */}
            <div className="space-y-2 text-xs text-gray-700">
              <h4 className="font-bold text-[#0e382c] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                أوجه صرف المساهمات:
              </h4>
              <ul className="space-y-1.5 pr-5 list-disc text-gray-600">
                <li>تغطية تكاليف الخوادم السحابية واستضافة التطبيق ليبقى مجانياً ومتاحاً للجميع.</li>
                <li>تطوير محرك حاسبة المواريث ومضاعفة المسائل وحالات الرد والعول والوصية الواجبة.</li>
                <li>دعم استهلاك نماذج الذكاء الاصطناعي في الرد على الاستفسارات الفقهية.</li>
                <li>تطوير ميزات التطبيق دون إنترنت (PWA) وتوسيع أبواب كتاب الفرائض والوقف.</li>
              </ul>
            </div>

            {/* Developer Contact */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-600 font-medium">لتأكيد التحويل أو التواصل المباشر:</span>
              <a
                href={`https://wa.me/249919980435`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0e382c] hover:bg-[#155342] text-white px-4 py-2.5 rounded-xl font-bold transition shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب المصمم: 00249919980435</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
