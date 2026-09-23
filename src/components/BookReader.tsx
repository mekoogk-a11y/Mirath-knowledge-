import React, { useState, useMemo } from 'react';
import { BOOK_CHAPTERS, Chapter } from '../data/bookChapters';
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Share2,
  Check,
  ZoomIn,
  ZoomOut,
  List,
} from 'lucide-react';

interface BookReaderProps {
  onChapterSelect?: (title: string) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ onChapterSelect }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fontSize, setFontSize] = useState<number>(16); // base font size in px
  const [copied, setCopied] = useState(false);

  const handleSelectChapter = (id: number) => {
    setSelectedChapterId(id);
    const chap = BOOK_CHAPTERS.find((c) => c.id === id);
    if (chap && onChapterSelect) {
      onChapterSelect(chap.title);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'all', label: 'جميع الفصول (28)' },
    { id: 'مقدمات وتأصيل', label: 'مقدمات وتأصيل' },
    { id: 'أصحاب الفروض والعصبات', label: 'أصحاب الفروض والعصبات' },
    { id: 'الحجب والقواعد', label: 'الحجب والقواعد' },
    { id: 'الحساب والتطبيق العملي', label: 'الحساب والتطبيق العملي' },
  ];

  // Filtered chapters list
  const filteredChapters = useMemo(() => {
    return BOOK_CHAPTERS.filter((chap) => {
      const matchesCategory = selectedCategory === 'all' || chap.category === selectedCategory;
      const matchesSearch =
        chap.title.includes(searchQuery) ||
        chap.summary.includes(searchQuery) ||
        chap.content.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentChapter = useMemo(() => {
    return BOOK_CHAPTERS.find((c) => c.id === selectedChapterId) || BOOK_CHAPTERS[0];
  }, [selectedChapterId]);

  const handlePrevChapter = () => {
    if (selectedChapterId > 1) {
      setSelectedChapterId(selectedChapterId - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextChapter = () => {
    if (selectedChapterId < BOOK_CHAPTERS.length) {
      setSelectedChapterId(selectedChapterId + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyChapter = () => {
    const textToCopy = `${currentChapter.title}\n\n${currentChapter.summary}\n\n${currentChapter.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Book Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>المنهج الفقهي الكامل — 28 فصلاً</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          كتاب علم المواريث والفرائض
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          تأصيل شرعي شامل لجميع أبواب الفرائض من القرآن الكريم وصحيح السنة النبوية وقواعد أئمة الفقه الإسلامي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chapters Navigation Sidebar (4 Cols on LG) */}
        <aside className="lg:col-span-4 space-y-4 text-right">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c5a059]/30 shadow-sm space-y-4">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في فصول الكتاب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#0e382c] outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#0e382c] text-white'
                      : 'bg-[#fbf9f4] border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Chapters List */}
            <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
              {filteredChapters.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-6">
                  لم يتم العثور على فصول مطابقة لبحثك.
                </p>
              ) : (
                filteredChapters.map((chap) => {
                  const isSelected = chap.id === selectedChapterId;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleSelectChapter(chap.id)}
                      className={`w-full text-right p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#0e382c] text-white font-bold shadow-xs'
                          : 'bg-[#fbf9f4] hover:bg-gray-100 text-gray-800 border border-gray-100'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                          isSelected ? 'bg-[#c5a059] text-[#0e382c]' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {chap.id}
                      </span>
                      <div className="truncate">
                        <span className="block truncate">{chap.title}</span>
                        <span
                          className={`text-[10px] block truncate font-normal ${
                            isSelected ? 'text-[#f3e5ab]' : 'text-gray-500'
                          }`}
                        >
                          {chap.summary}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Main Reading View (8 Cols on LG) */}
        <main className="lg:col-span-8 space-y-6">
          <article className="bg-white rounded-2xl p-6 sm:p-10 border border-[#c5a059]/40 shadow-sm space-y-6 text-right">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] font-medium">
                {currentChapter.category}
              </span>

              <div className="flex items-center gap-2">
                {/* Font Size controls */}
                <div className="flex items-center gap-1 bg-[#fbf9f4] border border-gray-200 rounded-lg p-0.5 text-xs text-gray-700">
                  <button
                    onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="تصغير الخط"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 font-mono text-[11px]">{fontSize}</span>
                  <button
                    onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="تكبير الخط"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopyChapter}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs flex items-center gap-1"
                  title="نسخ نص الفصل"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Chapter Title & Summary */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-[#0e382c] leading-snug">
                {currentChapter.title}
              </h2>
              <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 text-xs sm:text-sm text-gray-700">
                <strong>خلاصة الفصل:</strong> {currentChapter.summary}
              </div>
            </div>

            {/* Quran Verses Highlights */}
            {currentChapter.verses && currentChapter.verses.length > 0 && (
              <div className="space-y-3">
                {currentChapter.verses.map((v, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#0e382c]/5 border-r-4 border-[#c5a059] space-y-2"
                  >
                    <p className="quran-verse text-base sm:text-xl text-[#0e382c] font-bold text-center">
                      ﴿ {v.text} ﴾
                    </p>
                    <p className="text-[11px] text-[#c5a059] font-bold text-left font-sans">
                      [سورة {v.surah} : الآية {v.verseNumber}]
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Hadiths Highlights */}
            {currentChapter.hadiths && currentChapter.hadiths.length > 0 && (
              <div className="space-y-3">
                {currentChapter.hadiths.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-1.5 text-xs text-amber-900"
                  >
                    <p className="font-semibold text-sm">
                      قال رسول الله ﷺ: «{h.text}»
                    </p>
                    <p className="text-[11px] text-gray-500 font-sans">
                      رواه: {h.narrator} — المصدر: {h.source}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Main Content Body */}
            <div
              className="text-gray-800 leading-loose whitespace-pre-line font-sans"
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content}
            </div>

            {/* Navigation Footer (Prev / Next) */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapterId === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الفصل السابق</span>
              </button>

              <span className="text-xs text-gray-400 font-medium">
                فصل {currentChapter.id} من {BOOK_CHAPTERS.length}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={selectedChapterId === BOOK_CHAPTERS.length}
                className="px-4 py-2 rounded-xl bg-[#0e382c] text-white text-xs font-semibold hover:bg-[#155443] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <span>الفصل التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};
