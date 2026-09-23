import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  BookMarked,
  Sparkles,
  HelpCircle,
  FileText,
  Scale,
  Award,
  Layers,
  Columns3,
  CheckSquare,
  UserCheck,
  Building2,
  Users,
  ClipboardList,
  ShieldAlert,
  Compass,
  HeartHandshake,
  Users2,
  Combine,
  BookmarkCheck,
  BookCheck,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  CheckCircle2,
  Send,
  RefreshCw,
  AlertTriangle,
  Printer,
  Download,
  Info,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import {
  endowmentCardsData,
  endowmentDictionary,
  waqfCreationSteps,
  EndowmentCard,
  EndowmentTerm,
} from '../data/endowmentData';
import { WaqfTemplateView } from './WaqfTemplateView';
import { queryWaqfAssistant, WaqfMessage } from '../engine/waqfAssistantEngine';

type EndowmentSubTab = 'cards' | 'dictionary' | 'create-waqf' | 'template' | 'assistant';

interface EndowmentSectionProps {
  onNavigateHome?: () => void;
  onSubStateChange?: (title?: string, onBack?: () => void) => void;
}

export const EndowmentSection: React.FC<EndowmentSectionProps> = ({ onNavigateHome, onSubStateChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<EndowmentSubTab>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Creation steps wizard state
  const [currentCreationStep, setCurrentCreationStep] = useState(1);

  // Dictionary modal or selected term
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  // Assistant state
  const [assistantMessages, setAssistantMessages] = useState<WaqfMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'مرحباً بك في «مساعد الوقف الذكي». أنا رفيقك المعرفي المتخصص في أحكام الوقف في الفقه الإسلامي، أركانه، شروطه، مصارفه، وقاموس مصطلحاته. يمكنك طرح أي سؤال حول الوقف، أو اختيار أحد الأسئلة الشائعة أدناه.',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      sources: ['قسم الوقف وأحكامه — منصة المواريث'],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Icon selector helper
  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-[#c5a059]" />;
      case 'BookCheck':
        return <BookCheck className="w-5 h-5 text-[#c5a059]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#c5a059]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#c5a059]" />;
      case 'Columns3':
        return <Columns3 className="w-5 h-5 text-[#c5a059]" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-[#c5a059]" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-[#c5a059]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#c5a059]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#c5a059]" />;
      case 'ClipboardList':
        return <ClipboardList className="w-5 h-5 text-[#c5a059]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-[#c5a059]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#c5a059]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#c5a059]" />;
      case 'Users2':
        return <Users2 className="w-5 h-5 text-[#c5a059]" />;
      case 'Combine':
        return <Combine className="w-5 h-5 text-[#c5a059]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#c5a059]" />;
      case 'BookmarkCheck':
        return <BookmarkCheck className="w-5 h-5 text-[#c5a059]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#c5a059]" />;
    }
  };

  // Filtered Cards based on search query and category
  const filteredCards = useMemo(() => {
    return endowmentCardsData.filter((card) => {
      const matchesCategory = selectedCategory === 'الكل' || card.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchDesc = card.shortDesc.toLowerCase().includes(q);
      const matchOverview = card.content.overview.toLowerCase().includes(q);
      const matchPoints = card.content.keyPoints.some((p) => p.toLowerCase().includes(q));
      const matchSections = card.content.detailedSections.some(
        (s) => s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q)
      );

      return matchTitle || matchDesc || matchOverview || matchPoints || matchSections;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered Dictionary terms based on search query
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return endowmentDictionary;
    const q = searchQuery.toLowerCase().trim();
    return endowmentDictionary.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.linguisticMeaning.toLowerCase().includes(q) ||
        item.idiomaticMeaning.toLowerCase().includes(q) ||
        item.practicalExample.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle assistant send message
  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: WaqfMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryWaqfAssistant(textToSend);
      const assistantMsg: WaqfMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        disclaimer: response.disclaimer,
      };
      setAssistantMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  // Find active card for modal/reader
  const currentCardIndex = endowmentCardsData.findIndex((c) => c.id === selectedCardId);
  const activeCard = currentCardIndex !== -1 ? endowmentCardsData[currentCardIndex] : null;

  // Synchronize state with top navigation controller (Breadcrumb & Back button)
  useEffect(() => {
    if (selectedCardId && activeCard) {
      onSubStateChange?.(`بطاقة #${activeCard.number}: ${activeCard.title}`, () => {
        setSelectedCardId(null);
      });
    } else if (activeSubTab !== 'cards') {
      const subTabTitles: Record<EndowmentSubTab, string> = {
        cards: 'الموسوعة',
        dictionary: 'قاموس مصطلحات الوقف',
        'create-waqf': 'كيف أنشئ وقفاً؟',
        template: 'نموذج معلومات وقف',
        assistant: 'مساعد الوقف الذكي',
      };
      onSubStateChange?.(subTabTitles[activeSubTab], () => {
        setActiveSubTab('cards');
        setSelectedCardId(null);
      });
    } else {
      onSubStateChange?.(undefined, undefined);
    }
  }, [selectedCardId, activeCard, activeSubTab, onSubStateChange]);

  const handleNextCard = () => {
    if (currentCardIndex < endowmentCardsData.length - 1) {
      setSelectedCardId(endowmentCardsData[currentCardIndex + 1].id);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setSelectedCardId(endowmentCardsData[currentCardIndex - 1].id);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const categories = ['الكل', 'أساسيات', 'أركان وشروط', 'أنواع ومصارف', 'إدارة وأحكام', 'مسائل ومراجع'];

  return (
    <div className="space-y-8 pb-16 text-right" dir="rtl">
      {/* Hero Banner Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e382c] via-[#124637] to-[#0a271f] text-[#fbf9f4] p-6 sm:p-10 shadow-xl border border-[#c5a059]/40">
        <div className="absolute inset-0 bg-emerald-pattern opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>موسوعة فقهية وتطبيقية متخصصة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-amiri text-[#fdfbf7] tracking-tight">
            الوقف وأحكامه
          </h1>

          <p className="text-sm sm:text-base text-[#e8e4da] max-w-2xl mx-auto leading-relaxed">
            دليل مبسط لفهم الوقف وأحكامه ومجالاته ومصارفه، مع القاموس المعتمد ومساعد الوقف الذكي ونموذج التوثيق التعليمي.
          </p>

          {/* Dedicated Search Engine Input */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في أحكام الوقف، الأركان، ناظر الوقف، الاستبدال..."
                className="w-full py-3.5 pr-12 pl-10 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-lg border-2 border-[#c5a059]/60 focus:outline-hidden focus:border-[#c5a059]"
              />
              <Search className="w-5 h-5 text-[#0e382c] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-lg transition"
                >
                  مسح
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-xs text-[#f3e5ab] mt-2">
                وجدت {filteredCards.length} بطاقة و{filteredTerms.length} مصطلح يطابق البحث
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-[#c5a059]/30 shadow-xs no-scrollbar">
        <button
          onClick={() => {
            setActiveSubTab('cards');
            setSelectedCardId(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
            activeSubTab === 'cards'
              ? 'bg-[#0e382c] text-white shadow-sm'
              : 'text-gray-700 hover:bg-[#0e382c]/5'
          }`}
        >
          <Layers className="w-4 h-4 text-[#c5a059]" />
          <span>الموسوعة الفقهية (18 بطاقة)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dictionary')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
            activeSubTab === 'dictionary'
              ? 'bg-[#0e382c] text-white shadow-sm'
              : 'text-gray-700 hover:bg-[#0e382c]/5'
          }`}
        >
          <BookMarked className="w-4 h-4 text-[#c5a059]" />
          <span>قاموس مصطلحات الوقف</span>
        </button>

        <button
          onClick={() => setActiveSubTab('create-waqf')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
            activeSubTab === 'create-waqf'
              ? 'bg-[#0e382c] text-white shadow-sm'
              : 'text-gray-700 hover:bg-[#0e382c]/5'
          }`}
        >
          <Compass className="w-4 h-4 text-[#c5a059]" />
          <span>كيف أنشئ وقفاً؟ (7 خطوات)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('template')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
            activeSubTab === 'template'
              ? 'bg-[#0e382c] text-white shadow-sm'
              : 'text-gray-700 hover:bg-[#0e382c]/5'
          }`}
        >
          <FileText className="w-4 h-4 text-[#c5a059]" />
          <span>نموذج معلومات وقف (PDF)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assistant')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
            activeSubTab === 'assistant'
              ? 'bg-[#0e382c] text-white shadow-sm'
              : 'text-gray-700 hover:bg-[#0e382c]/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <span>مساعد الوقف الذكي</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: 18 CARDS ENCYCLOPEDIA */}
      {/* ========================================================================= */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          {/* Card Reader Mode if a card is selected */}
          {activeCard ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#c5a059]/40 shadow-xl space-y-8 animate-in fade-in duration-300">
              {/* Reader Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <button
                  onClick={() => setSelectedCardId(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-98"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة لجميع البطاقات (18)</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono">
                    بطاقة {activeCard.number} من 18
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevCard}
                      disabled={currentCardIndex === 0}
                      className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition"
                      aria-label="البطاقة السابقة"
                    >
                      <ArrowRight className="w-4 h-4 text-[#0e382c]" />
                    </button>
                    <button
                      onClick={handleNextCard}
                      disabled={currentCardIndex === endowmentCardsData.length - 1}
                      className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition"
                      aria-label="البطاقة التالية"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#0e382c]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Category Header */}
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] text-xs font-bold">
                  {activeCard.category}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
                  {activeCard.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  {activeCard.shortDesc}
                </p>
              </div>

              {/* Quranic Verses if present */}
              {activeCard.content.quranVerses && activeCard.content.quranVerses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0e382c] font-amiri flex items-center gap-2 border-r-4 border-[#c5a059] pr-3">
                    الأدلة من القرآن الكريم
                  </h3>
                  <div className="space-y-3">
                    {activeCard.content.quranVerses.map((verse, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#fdfbf7] border border-[#c5a059]/40 space-y-2 text-center"
                      >
                        <p className="quran-verse text-lg sm:text-xl font-bold text-[#0e382c] leading-loose">
                          ﴿ {verse.text} ﴾
                        </p>
                        <p className="text-xs text-gray-500 font-semibold font-sans">
                          [{verse.surah}: الآية {verse.ayah}]
                        </p>
                        {verse.tafsir && (
                          <p className="text-xs text-gray-700 bg-white/80 p-2.5 rounded-xl border border-gray-100 font-sans text-right leading-relaxed">
                            <strong className="text-[#0e382c]">بيان المعنى والاستدلال:</strong> {verse.tafsir}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hadiths if present */}
              {activeCard.content.hadiths && activeCard.content.hadiths.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#0e382c] font-amiri flex items-center gap-2 border-r-4 border-[#c5a059] pr-3">
                    الأحاديث النبوية الصحيحة
                  </h3>
                  <div className="space-y-3">
                    {activeCard.content.hadiths.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#0e382c]/5 border border-[#c5a059]/30 space-y-2 text-right"
                      >
                        <p className="text-sm sm:text-base font-semibold text-[#0e382c] font-amiri leading-relaxed">
                          «{h.text}»
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-200">
                          <span>الراوي: <strong>{h.narrator}</strong></span>
                          <span>المصدر: <strong>{h.source}</strong></span>
                        </div>
                        {h.explanation && (
                          <p className="text-xs text-gray-700 pt-1 leading-relaxed">
                            <strong className="text-[#0e382c]">الشرح الفقهي:</strong> {h.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights */}
              <div className="p-5 rounded-2xl bg-[#fbf9f4] border border-[#c5a059]/30 space-y-3">
                <h4 className="font-bold text-[#0e382c] font-amiri text-base">
                  خلاصة الضوابط والأحكام:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-sans">
                  {activeCard.content.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-6">
                {activeCard.content.detailedSections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-bold text-[#0e382c] font-amiri text-lg border-b border-gray-200 pb-1.5">
                      {sec.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                      {sec.text}
                    </p>
                    {sec.bullets && (
                      <ul className="list-disc pr-5 text-xs sm:text-sm text-gray-700 space-y-1">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Practical Examples if any */}
              {activeCard.content.practicalExamples && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <strong className="block font-bold text-sm text-[#0e382c]">أمثلة وتطبيقات عملية:</strong>
                  {activeCard.content.practicalExamples.map((ex, idx) => (
                    <p key={idx}>• {ex}</p>
                  ))}
                </div>
              )}

              {/* Bottom Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 text-xs sm:text-sm">
                <button
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="px-4 py-2 rounded-xl border border-[#c5a059] hover:bg-[#c5a059]/10 text-[#0e382c] font-bold flex items-center gap-1.5 disabled:opacity-40"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>الباب السابق</span>
                </button>

                <button
                  onClick={() => setSelectedCardId(null)}
                  className="text-gray-500 hover:text-[#0e382c]"
                >
                  الرجوع لقائمة الأبواب
                </button>

                <button
                  onClick={handleNextCard}
                  disabled={currentCardIndex === endowmentCardsData.length - 1}
                  className="px-4 py-2 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white font-bold flex items-center gap-1.5 disabled:opacity-40"
                >
                  <span>الباب التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-[#c5a059] text-[#0e382c] shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* The 18 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCardId(card.id);
                      window.scrollTo({ top: 220, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-[#c5a059]/30 hover:border-[#c5a059] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#0e382c]/10 text-[#0e382c] flex items-center justify-center border border-[#c5a059]/30 group-hover:bg-[#0e382c] group-hover:text-white transition-colors">
                          {getCardIcon(card.iconName)}
                        </div>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#fbf9f4] border border-[#c5a059]/30 text-[#0e382c]">
                          #{card.number}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#c5a059] font-bold block mb-0.5">
                          {card.category}
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-[#0e382c] font-amiri group-hover:text-[#c5a059] transition-colors leading-snug">
                          {card.title}
                        </h3>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed font-sans line-clamp-3">
                        {card.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0e382c]">
                      <span>قراءة المحتوى والأدلة</span>
                      <ChevronLeft className="w-4 h-4 text-[#c5a059] group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-gray-200">
                  <Search className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="font-bold text-gray-700">لم يتم العثور على بطاقات تطابق بحثك</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('الكل');
                    }}
                    className="text-xs text-[#0e382c] font-bold underline"
                  >
                    إلغاء البحث وإظهار كل البطاقات
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: DICTIONARY VIEW */}
      {/* ========================================================================= */}
      {activeSubTab === 'dictionary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[#c5a059]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setActiveSubTab('cards')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0e382c] bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>العودة لبطاقات الوقف</span>
                </button>
              </div>
              <h3 className="font-bold text-lg font-amiri text-[#0e382c]">
                قاموس مصطلحات الوقف المعتمد
              </h3>
              <p className="text-xs text-gray-600">
                شرح تحريري دقيق لجميع مصطلحات الأوقاف الشرعية بالمعنى اللغوي والاصطلاحي مع التمثيل
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#0e382c]/10 text-[#0e382c] rounded-full shrink-0">
              {filteredTerms.length} مصطلح فقهي
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTermId(selectedTermId === t.id ? null : t.id)}
                className={`bg-white rounded-2xl p-5 border transition cursor-pointer shadow-xs ${
                  selectedTermId === t.id
                    ? 'border-2 border-[#0e382c] bg-[#fdfcf9]'
                    : 'border-gray-200 hover:border-[#c5a059]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-[#c5a059] font-bold block mb-1">
                      {t.category}
                    </span>
                    <h4 className="font-bold text-base text-[#0e382c] font-amiri">
                      {t.term}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {selectedTermId === t.id ? 'إخفاء ▲' : 'شرح ▼'}
                  </span>
                </div>

                <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                  <strong className="text-gray-900">المعنى الاصطلاحي:</strong> {t.idiomaticMeaning}
                </p>

                {selectedTermId === t.id && (
                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-700 animate-in fade-in duration-200">
                    <p>
                      <strong className="text-[#0e382c]">في لغة العرب:</strong> {t.linguisticMeaning}
                    </p>
                    <p className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                      <strong>تطبيق ومثال عملي:</strong> {t.practicalExample}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: HOW TO CREATE A WAQF (7 STEPS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'create-waqf' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#c5a059]/40 shadow-lg space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <button
              onClick={() => setActiveSubTab('cards')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e382c] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>العودة لبطاقات الوقف</span>
            </button>
            <span className="text-xs text-gray-500 font-mono">الخطوة {currentCreationStep} من 7</span>
          </div>

          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] text-xs font-bold">
              دليل عملي تفاعلي
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c]">
              كيف أنشئ وقفاً؟
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              خطوات متتابعة وميسرة ترشدك لبناء وتأسيس الوقف بطريقة محكمة شرعياً وإدارياً
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {waqfCreationSteps.map((step) => {
              const isActive = currentCreationStep === step.stepNumber;
              const isPassed = currentCreationStep > step.stepNumber;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setCurrentCreationStep(step.stepNumber)}
                  className={`p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-[#0e382c] text-white shadow-xs'
                      : isPassed
                      ? 'bg-[#c5a059]/20 text-[#0e382c] hover:bg-[#c5a059]/30'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
                    {step.stepNumber}
                  </span>
                  <span className="hidden md:inline text-[11px] truncate max-w-full">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Card */}
          {(() => {
            const step = waqfCreationSteps.find((s) => s.stepNumber === currentCreationStep)!;
            return (
              <div className="bg-[#fbf9f4] rounded-2xl p-6 sm:p-8 border border-[#c5a059]/30 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#c5a059]">الخطوة {step.stepNumber} من 7</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0e382c] font-amiri">
                      {step.title}
                    </h3>
                  </div>
                  <span className="p-3 bg-white rounded-2xl border border-gray-200 text-[#0e382c]">
                    <CheckCircle2 className="w-6 h-6 text-[#c5a059]" />
                  </span>
                </div>

                <p className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                  {step.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#0e382c]">إرشادات وتوجيهات عملية:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {step.guidelines.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {step.sampleText && (
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs space-y-1 text-gray-800">
                    <strong className="block text-[#0e382c]">نموذج صياغة استرشادي:</strong>
                    <p className="italic font-serif leading-relaxed text-gray-700">{step.sampleText}</p>
                  </div>
                )}

                {step.importantNotice && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{step.importantNotice}</span>
                  </div>
                )}

                {/* Step Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentCreationStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentCreationStep === 1}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold disabled:opacity-40"
                  >
                    السابق
                  </button>

                  {currentCreationStep < 7 ? (
                    <button
                      onClick={() => setCurrentCreationStep((prev) => Math.min(7, prev + 1))}
                      className="px-5 py-2.5 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>الخطوة التالية</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveSubTab('template')}
                      className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b56d] text-[#0e382c] text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span>تعبئة نموذج معلومات الوقف الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: WAQF TEMPLATE & PRINTABLE PDF */}
      {/* ========================================================================= */}
      {activeSubTab === 'template' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSubTab('cards')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e382c] bg-white hover:bg-gray-100 border border-[#c5a059]/30 px-3.5 py-1.5 rounded-xl transition shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>العودة لبطاقات الوقف</span>
            </button>
          </div>
          <WaqfTemplateView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: SMART WAQF ASSISTANT */}
      {/* ========================================================================= */}
      {activeSubTab === 'assistant' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c5a059]/40 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubTab('cards')}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0e382c] transition"
                title="العودة لبطاقات الوقف"
              >
                <ArrowRight className="w-4 h-4 text-[#c5a059]" />
              </button>
              <div className="p-2.5 rounded-2xl bg-[#0e382c] text-[#f3e5ab] shadow-sm">
                <Sparkles className="w-6 h-6 text-[#c5a059]" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-amiri text-[#0e382c]">
                  مساعد الوقف الذكي
                </h3>
                <p className="text-xs text-gray-500">
                  خبير معرفي متخصص في أحكام الوقف في الفقه الإسلامي ومسائله
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setAssistantMessages([
                  {
                    id: 'welcome',
                    sender: 'assistant',
                    text: 'أهلاً بك مجدداً في مساعد الوقف. أنا جاهز للإجابة على استفساراتك حول أحكام الوقف وشروطه.',
                    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          </div>

          {/* Quick Questions Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500">أسئلة شائعة مقترحة:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'ما هو الوقف؟',
                'ما الفرق بين الوقف والصدقة؟',
                'ما شروط الوقف؟',
                'ما أنواع الوقف؟',
                'ما المقصود بناظر الوقف؟',
                'أين تصرف غلة الوقف؟',
                'هل يجوز بيع الوقف واستبداله؟',
                'هل يجوز وقف النقود والأسهم؟',
                'حكم حرمان البنات من الوقف؟',
                'هل يمكن الرجوع في الوقف؟',
              ].map((qText) => (
                <button
                  key={qText}
                  onClick={() => handleSendMessage(qText)}
                  className="text-xs bg-[#fbf9f4] hover:bg-[#f3ebd7] text-[#0e382c] border border-[#c5a059]/40 px-3 py-1.5 rounded-full transition active:scale-98 font-medium"
                >
                  {qText}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="bg-[#fbf9f4] rounded-2xl p-4 sm:p-6 border border-gray-200 min-h-[360px] max-h-[520px] overflow-y-auto space-y-4">
            {assistantMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-1`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0e382c] text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Sources tag if available */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap items-center gap-1.5">
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>المراجع:</span>
                      {msg.sources.map((s, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Non-fatwa Disclaimer */}
                  {msg.disclaimer && (
                    <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-900 leading-normal flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
                <span>المساعد يراجع أحكام ومصادر الوقف...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="اكتب سؤالك عن الوقف وأحكامه ومصطلحاته..."
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 focus:border-[#0e382c] focus:ring-1 focus:ring-[#0e382c] outline-hidden text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-3 rounded-xl bg-[#0e382c] hover:bg-[#155443] text-white disabled:opacity-40 transition active:scale-98"
              aria-label="إرسال"
            >
              <Send className="w-5 h-5 -rotate-90 text-[#f3e5ab]" />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center">
            تنبيه: مساعد الوقف يقدم استرشاداً علمياً وفق الفقه الإسلامي المعتمد، وليس جهة لإصدار فتاوى قضائية خاصة.
          </p>
        </div>
      )}
    </div>
  );
};
