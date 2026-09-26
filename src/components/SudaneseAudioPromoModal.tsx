import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  X,
  MessageCircle,
  CreditCard,
  Sparkles,
  Share2,
  Radio,
  FileText,
  Clock,
  UserCheck,
  Layers,
} from 'lucide-react';

interface SudaneseAudioPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SudaneseAudioPromoModal: React.FC<SudaneseAudioPromoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'60s' | '30s' | '15s' | 'directors'>('60s');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState(0);

  const bankAccount = '2813955';
  const designerName = 'المصمم كمال جعفر';
  const whatsappNumber = '+249919980435';

  const scripts = {
    '60s': {
      title: 'النسخة الإعلانية الكاملة (60 ثانية)',
      duration: 'دقيقة واحدة (حماسي، درامي، مُقنع ومؤثر)',
      tone: 'صوت رجالي جهوري، دافئ، ينبض بالثقة والمصداقية، باللهجة السودانية العذبة والفصيحة',
      sfx: 'إيقاع شرقي سوداني هادئ يتصاعد تدريجياً، مع مؤثرات صوتية لنقر زر الحاسبة ورنين ورقة المصحف الشريف',
      text: `يا جماعة الخير.. السلام عليكم ورحمة الله.

كم مرة شفتوا قسمة ورثة وميراث وقفت في حلق الناس، وكل زول يقول كلام، والأهل يزعلوا من بعض عشان الحسابات ما واضحة؟

(وقفة ثانية.. بنبرة ثقة وحماس متصاعد)
الليلة الحل وصل لحدي عندكم وفي جيبكم!
بنقدّم ليكم تطبيق ومنصة: «معرفة المواريث — Mirath Knowledge»!
أضخم وأدق منصة إسلامية متخصصة في علم الفرائض والمواريث والوقف الشرعي.

(صوت نقرة حاسبة ورنين دقيق)
بس تدخل قيمة التركة ومنو هم الورثة.. وبكبسة زر واحدة:
تفرز ليك الفروض، والعصبات، وحالات الحجب، والعَول، والرَّد!
وبالأدلة القاطعة من القرآن والسنة وأقوال المذاهب الأربعة.. بالقرش والمليم وبدون أي لبس ولا شك!

(نبرة فخر وبهجة)
موش كده وبس! شجرة عائلية تفاعلية بتبين ليك الورثة والمحجوبين، وتقارير PDF فخمة ورسمية تطبعها وتشاركها طوالي مع الأهل في الواتساب!
والأجمل من ده كلو: التطبيق خفيف، سريع جداً، شغال بدون إنترنت PWA، وخالٍ تماماً من أي إعلانات مزعجة!

(نبرة وفاء ومحبة ودعوة للدعم)
التطبيق ده عمل لوجه الله وصدقة جارية، صممه وبرمجه ليكم أخونا «المصمم كمال جعفر».
وعشان يستمر ويتطور ويفيد ملايين المسلمين، ساهموا معاه في الأجر والصدقة الجارية عبر:
حساب بنك الخرطوم: 2813955
(اتنين - تمانية - واحد - تلاتة - تسعة - خمسة - خمسة)
أو تواصلوا معاهو مباشرة عبر الواتساب: +249919980435.

(خاتمة قوية وابتسامة واضحة في الصوت)
«منصة معرفة المواريث».. احسب، وتعلّم، وافهم، واحفظ حقوق أهلك بشرع الله!`,
      speechText: `يا جماعة الخير، السلام عليكم ورحمة الله. كم مرة شفتو قسمة ورثة وميراث وقفت في حلق الناس، وكل زول يقول كلام، والأهل يزعلو من بعض عشان الحسابات ما واضحة؟
الليلة الحل وصل لحد عندكم وفي جيبكم! بنقدم ليكم تطبيق ومنصة معرفة المواريث! أضخم وأدق منصة إسلامية متخصصة في علم الفرائض والمواريث والوقف الشرعي.
بس دخل قيمة التركة ومنو هم الورثة، وبكبسة زر واحدة تفرز ليك الفروض والعصبات وحالات الحجب والعول والرد، بالأدلة القاطعة من القرآن والسنة، بالقرش والمليم وبدون أي لبس!
وشجرة عائلية تفاعلية وتقارير بي دي إف رسمية تشاركها طوالي في الواتساب!
التطبيق شغال بدون نت ومجاني، صممه وبرمجه أخونا المصمم كمال جعفر. وللدعم والمساهمة صدقة جارية عبر بنك الخرطوم حساب رقم 2813955 أو واتساب +249919980435. معرفة المواريث، احسب وتعلّم واحفظ حقوق أهلك بشرع الله!`,
    },
    '30s': {
      title: 'نسخة السوشيال ميديا والريلز (30 ثانية)',
      duration: '30 ثانية (إيقاع سريع، شبابي، حاسم وديناميكي)',
      tone: 'صوت رجالي سوداني نشيط وحازم وواثق',
      sfx: 'إيقاع إلكتروني هادئ وسريع مع بوب آب صوتي عند ذكر الميزات',
      text: `عايز تعرف حقك في الميراث بشرع الله وبدون لف ودوران؟
بلاش ورقة وقلم ولخبطة! 
تطبيق «معرفة المواريث» بيحسب ليك التركة بالمليم في ثواني!

حاسبة الفرائض الذكية بتوريك منو البيرث ومنو المحجوب، مع الأدلة الشرعية، وشجرة عيلة تفاعلية بتشرح ليك كل سهم بالتفصيل!
وفوق ده كلو، بتنزّل تقرير PDF فخم وموثق وتشاركه مع أهلك في الواتساب طوالي!

شغال في تلفونك أوفلاين، مجاني، وسريع كالسهم.
صممه أخونا «المصمم كمال جعفر». 
ولدعم استمرار المشروع صدقة جارية: 
حساب بنك الخرطوم: 2813955 
أو واتساب: +249919980435.

«معرفة المواريث».. ميزان الحق والعدل في يدك!`,
      speechText: `عايز تعرف حقك في الميراث بشرع الله وبدون لف ودوران؟ بلاش ورقة وقلم ولخبطة! تطبيق معرفة المواريث بيحسب ليك التركة بالمليم في ثواني!
حاسبة الفرائض الذكية بتوريك منو البيرث ومنو المحجوب مع الأدلة الشرعية وشجرة عيلة تفاعلية وتقارير بي دي إف تشاركها في الواتساب!
شغال في تلفونك بدون نت وسريع جداً. صممه المصمم كمال جعفر. وللدعم صدقة جارية بنك الخرطوم حساب 2813955 أو واتساب +249919980435. معرفة المواريث، ميزان الحق في يدك!`,
    },
    '15s': {
      title: 'الكبسولة السريعة لحالات الواتساب والإعلانات الممولة (15 ثانية)',
      duration: '15 ثانية (خاطفة، مباشرة ومحفزة)',
      tone: 'نبرة رجالية حاسمة وملهمة',
      sfx: 'نقرة قوية وإيقاع تصاعدي',
      text: `قسمة المواريث بقت أسهل وأدق من أي وقت!
تطبيق «معرفة المواريث».. حاسبة فرائض ذكية، شجرة عيلة تفاعلية، وتقارير PDF فورية بشرع الله الحنيف!
تطبيق مجاني وفخم وشغال بدون إنترنت.

للمساهمة ودعم المشروع صدقة جارية:
بنك الخرطوم: 2813955 — المصمم كمال جعفر
واتساب: +249919980435.`,
      speechText: `قسمة المواريث بقت أسهل وأدق من أي وقت! تطبيق معرفة المواريث، حاسبة فرائض ذكية وشجرة عيلة وتقارير بي دي إف بشرع الله الحنيف! مجاني وشغال بدون نت. للدعم صدقة جارية بنك الخرطوم 2813955 المصمم كمال جعفر، واتساب +249919980435!`,
    },
  };

  // Handle SpeechSynthesis preview
  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح لا يدعم قارئ الصوت التلقائي، يمكنك قراءة وتطبيق النص مباشرة.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setSpeakingProgress(0);
      return;
    }

    window.speechSynthesis.cancel();

    const selectedSpeechText =
      activeTab === 'directors'
        ? scripts['60s'].speechText
        : scripts[activeTab].speechText;

    const utterance = new SpeechSynthesisUtterance(selectedSpeechText);
    utterance.lang = 'ar-SA';
    utterance.rate = activeTab === '15s' ? 1.05 : 0.95; // Steady, confident pace
    utterance.pitch = 0.9; // Masculine lower pitch

    // Try finding Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setSpeakingProgress(5);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setSpeakingProgress(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setSpeakingProgress(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-[#fbf9f4] border-2 border-[#c5a059] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-right font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#09261e] via-[#0e382c] to-[#09261e] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#c5a059]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center text-[#f3e5ab] shadow-inner">
              <Mic className="w-6 h-6 animate-pulse text-[#c5a059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#c5a059] text-[#0e382c] font-bold px-2 py-0.5 rounded-full">
                  استوديو الترويج
                </span>
                <span className="text-xs text-[#c5a059]">بالعامية السودانية الفخمة</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-amiri text-[#fdfbf7] mt-0.5">
                النص الإعلاني الحماسي (صوت رجل سوداني)
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              onClose();
            }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#f4eee1] px-4 py-2.5 border-b border-[#c5a059]/30 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab('60s');
              if (isPlaying) window.speechSynthesis.cancel();
              setIsPlaying(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === '60s'
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 text-[#c5a059]" />
            <span>النسخة الكاملة (60 ثانية)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('30s');
              if (isPlaying) window.speechSynthesis.cancel();
              setIsPlaying(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === '30s'
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <Radio className="w-4 h-4 text-[#c5a059]" />
            <span>ريلز وتيك توك (30 ثانية)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('15s');
              if (isPlaying) window.speechSynthesis.cancel();
              setIsPlaying(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === '15s'
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>خاطف وسريع (15 ثانية)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('directors');
              if (isPlaying) window.speechSynthesis.cancel();
              setIsPlaying(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'directors'
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'bg-white/70 hover:bg-white text-gray-700'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#c5a059]" />
            <span>توجيهات المخرج والأداء الصوتي</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab !== 'directors' ? (
            <>
              {/* Meta specifications */}
              <div className="bg-white rounded-2xl p-4 border border-[#c5a059]/30 shadow-xs space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <span className="font-bold text-[#0e382c] text-sm">
                    {scripts[activeTab].title}
                  </span>
                  <span className="text-[#c5a059] font-medium bg-[#f4eee1] px-2 py-0.5 rounded-md">
                    {scripts[activeTab].duration}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <strong className="text-[#0e382c]">نبرة الصوت:</strong> {scripts[activeTab].tone}
                  </div>
                  <div>
                    <strong className="text-[#0e382c]">المؤثرات (SFX):</strong> {scripts[activeTab].sfx}
                  </div>
                </div>
              </div>

              {/* Audio Playback Simulator Bar */}
              <div className="bg-gradient-to-r from-[#0e382c] to-[#124637] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-[#c5a059]/40">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayVoice}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white transition active:scale-95 shadow-md ${
                      isPlaying
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c]'
                    }`}
                    title={isPlaying ? 'إيقاف الصوت' : 'استمع لأداء تجريبي عبر متصفحك'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
                      <span>{isPlaying ? 'جاري قراءة النص الصوتي...' : 'استمع لتجربة الأداء الصوتي'}</span>
                      {isPlaying && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#e8e4da]/80">
                      محاكاة صوتية رجالية تلقائية بمخارج عربية
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy(activeTab, scripts[activeTab].text)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-[#fdfbf7] text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20 active:scale-95"
                  >
                    {copiedScript === activeTab ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>تم النسخ بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#f3e5ab]" />
                        <span>نسخ النص كاملاً</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Script Box */}
              <div className="bg-white rounded-2xl p-5 border border-[#c5a059]/40 shadow-xs relative">
                <div className="absolute top-3 left-3">
                  <button
                    onClick={() => handleCopy(activeTab, scripts[activeTab].text)}
                    className="p-1.5 text-gray-400 hover:text-[#0e382c] hover:bg-gray-100 rounded-lg transition"
                    title="نسخ النص"
                  >
                    {copiedScript === activeTab ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="font-amiri text-base sm:text-lg text-gray-800 leading-loose whitespace-pre-line pl-8">
                  {scripts[activeTab].text}
                </div>
              </div>
            </>
          ) : (
            /* Director's Guide & Audio Engineering Notes */
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-[#c5a059]/30 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-[#0e382c] font-amiri flex items-center gap-2 border-b border-gray-100 pb-2">
                  <UserCheck className="w-5 h-5 text-[#c5a059]" />
                  <span>دليل الأداء الصوتي للمذيع (Voice Over Director's Notes)</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
                    <strong className="text-[#0e382c] block">1. مواصفات المعلق الصوتي:</strong>
                    <p className="text-gray-600 text-xs">
                      صوت رجالي عميق (Baritone / Bass)، يتميز بالدفء السوداني والوقار، مع القدرة على رفع وتيرة الحماس والطاقة عند ذكر ميزات التطبيق.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
                    <strong className="text-[#0e382c] block">2. اللهجة ومخارج الحروف:</strong>
                    <p className="text-gray-600 text-xs">
                      عامية سودانية مهذبة، فصيحة ومفهومة في كل السودان والعالم العربي. يتم نطق الكلمات السودانية بنكهتها الطبيعية مثل: (يا جماعة الخير - وقفت في حلق الناس - كل زول - لحدي عندكم - موش كده وبس - بالقرش والمليم).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
                    <strong className="text-[#0e382c] block">3. التلوين الصوتي والوقفات (Dynamics & Pacing):</strong>
                    <p className="text-gray-600 text-xs">
                      • <strong>البداية:</strong> تساؤلية وتلامس معاناة واقعية (تعاطف ودفء).<br />
                      • <strong>الوسط:</strong> انفجار في الحماس والثقة عند تقديم الحل (معرفة المواريث - كبسة زر واحدة).<br />
                      • <strong>قسم الميزات:</strong> نبرة فخر واستعراض قوي (شجرة تفاعلية - تقرير PDF - بدون نت).<br />
                      • <strong>الخاتمة:</strong> وقار، صدق ودعوة محبة للأجر والصدقة الجارية.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 space-y-1">
                    <strong className="text-[#0e382c] block">4. المؤثرات الصوتية والموسيقى التصويرية المقترحة:</strong>
                    <p className="text-gray-600 text-xs">
                      آلة العود أو القانون مع إيقاع شرقي عصري هادئ في الخلفية بدون طبل صاخب، إضافة مؤثرات خفيفة: (Chime) صوت حساب دقيق عند جملة «بكبسة زر واحدة»، وصوت فتح مستند ورقي عند «تقرير PDF».
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer & Bank Details in Director Notes */}
              <div className="bg-[#0e382c] text-[#fdfbf7] rounded-2xl p-4 border border-[#c5a059] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <span className="text-xs text-[#c5a059] font-bold block">
                    بيانات التحويل والتواصل المعتمدة في الإعلان:
                  </span>
                  <div className="text-xs">
                    بنك الخرطوم (تطبيق بنكك): <span className="font-mono font-bold text-[#f3e5ab] text-sm">{bankAccount}</span> — باسم: <strong className="text-[#f3e5ab]">{designerName}</strong>
                  </div>
                </div>
                <a
                  href="https://wa.me/249919980435"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>تأكيد الإعلان عبر واتساب {whatsappNumber}</span>
                </a>
              </div>
            </div>
          )}

          {/* Quick Bank & WhatsApp Box */}
          <div className="bg-[#f4eee1] rounded-2xl p-4 border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center text-[#0e382c] shrink-0">
                <CreditCard className="w-5 h-5 text-[#0e382c]" />
              </div>
              <div>
                <span className="font-bold text-[#0e382c] block">
                  بنك الخرطوم: <span className="font-mono text-sm font-extrabold text-[#0e382c]">{bankAccount}</span>
                </span>
                <span className="text-gray-600 text-[11px]">
                  باسم: {designerName} · صدقة جارية لدعم المنصة
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleCopy('bank', bankAccount)}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                {copiedScript === 'bank' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الحساب</span>
                  </>
                )}
              </button>
              <a
                href="https://wa.me/249919980435"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            النص الإعلاني متاح مجاناً للنشر والترويج في المنصات والإذاعات ومجموعات الواتساب
          </span>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlaying(false);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
