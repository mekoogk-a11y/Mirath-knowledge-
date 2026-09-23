import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Calculator as CalcIcon,
  Layers,
  BookMarked,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { BOOK_CHAPTERS } from '../data/bookChapters';
import { endowmentCardsData as ENDOWMENT_CARDS, endowmentDictionary as ENDOWMENT_TERMS } from '../data/endowmentData';
import { INHERITANCE_TERMS } from '../data/dictionary';
import { ActiveTab } from './Navbar';

export interface SearchResultItem {
  id: string;
  type: 'chapter' | 'endowment' | 'term' | 'preset' | 'navigation';
  title: string;
  subtitle: string;
  badge: string;
  tab: ActiveTab;
  chapterId?: number;
  endowmentId?: string;
  termId?: string;
  presetKey?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, payload?: { chapterId?: number; endowmentId?: string; presetKey?: string }) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'calculator' | 'book' | 'endowment' | 'dictionary'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input upon open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Landmark cases presets for instant access
  const presetItems: SearchResultItem[] = useMemo(
    () => [
      {
        id: 'preset-umariyyah',
        type: 'preset',
        title: 'المسألة الغراوية (العُمريتان)',
        subtitle: 'زوج + أم + أب — قضى فيها عمر بن الخطاب بثلث الباقي للأم',
        badge: 'مسألة فرائضية شهيرة',
        tab: 'calculator',
        presetKey: 'umariyyah',
      },
      {
        id: 'preset-manbariyyah',
        type: 'preset',
        title: 'المسألة المنبرية (العول إلى 27)',
        subtitle: 'زوجة + بنتان + أب + أم — سُئل عنها علي رضي الله عنه على المنبر وقال: صار ثمنها تسعاً',
        badge: 'مسألة فرائضية شهيرة',
        tab: 'calculator',
        presetKey: 'manbariyyah',
      },
      {
        id: 'preset-wife-sons',
        type: 'preset',
        title: 'مسألة الأبناء والبنات مع الزوجة والأم',
        subtitle: 'زوجة + أم + ابنان + بنتان — تطبيق العصبة بالغير مع حجب النقصان',
        badge: 'حاسبة المواريث',
        tab: 'calculator',
        presetKey: 'wife_sons_daughters',
      },
      {
        id: 'preset-single-daughter',
        type: 'preset',
        title: 'مسألة البنت المنفردة والزوجة (الرد)',
        subtitle: 'زوجة + بنت واحدة — فرض النصف للبنت والثمن للزوجة مع الرد',
        badge: 'حاسبة المواريث',
        tab: 'calculator',
        presetKey: 'single_daughter',
      },
    ],
    []
  );

  // Index all data
  const allIndexedItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];

    // Presets
    list.push(...presetItems);

    // Book chapters
    BOOK_CHAPTERS.forEach((ch) => {
      list.push({
        id: `ch-${ch.id}`,
        type: 'chapter',
        title: ch.title,
        subtitle: ch.summary,
        badge: `كتاب الفرائض · ${ch.category}`,
        tab: 'book',
        chapterId: ch.id,
      });
    });

    // Endowment cards
    ENDOWMENT_CARDS.forEach((card) => {
      list.push({
        id: `endow-${card.id}`,
        type: 'endowment',
        title: card.title,
        subtitle: card.shortDesc,
        badge: `الوقف وأحكامه · ${card.category}`,
        tab: 'endowment',
        endowmentId: card.id,
      });
    });

    // Terms (Inheritance)
    INHERITANCE_TERMS.forEach((term) => {
      list.push({
        id: `term-inh-${term.id}`,
        type: 'term',
        title: term.term,
        subtitle: term.shortDef,
        badge: `معجم الفرائض · ${term.category}`,
        tab: 'dictionary',
        termId: term.id,
      });
    });

    // Terms (Endowment)
    ENDOWMENT_TERMS.forEach((term) => {
      list.push({
        id: `term-end-${term.id}`,
        type: 'term',
        title: term.term,
        subtitle: term.idiomaticMeaning,
        badge: `معجم الوقف · ${term.category}`,
        tab: 'endowment',
        termId: term.id,
      });
    });

    return list;
  }, [presetItems]);

  // Filtered Results
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return allIndexedItems.filter((item) => {
      // Tab filter
      if (activeFilter !== 'all') {
        if (activeFilter === 'calculator' && item.tab !== 'calculator') return false;
        if (activeFilter === 'book' && item.tab !== 'book') return false;
        if (activeFilter === 'endowment' && item.tab !== 'endowment') return false;
        if (activeFilter === 'dictionary' && item.tab !== 'dictionary') return false;
      }

      if (!trimmed) return true;

      // Search matching
      const titleMatch = item.title.toLowerCase().includes(trimmed);
      const subtitleMatch = item.subtitle.toLowerCase().includes(trimmed);
      const badgeMatch = item.badge.toLowerCase().includes(trimmed);

      return titleMatch || subtitleMatch || badgeMatch;
    }).slice(0, 30);
  }, [allIndexedItems, query, activeFilter]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectItem(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onClose();
    onNavigate(item.tab, {
      chapterId: item.chapterId,
      endowmentId: item.endowmentId,
      presetKey: item.presetKey,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      dir="rtl"
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full border-2 border-[#c5a059] shadow-2xl overflow-hidden mt-2 sm:mt-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-[#fbf9f4]">
          <Search className="w-5 h-5 text-[#0e382c] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مسألة، آية، فصل، مصطلح، أو حكم وقفي..."
            className="flex-1 bg-transparent border-0 outline-hidden text-base sm:text-lg font-medium text-[#0e382c] placeholder:text-gray-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 text-[11px] text-gray-500 font-mono">
            <span>ESC</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition sm:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-2.5 sm:px-4 bg-[#f8f5ee] border-b border-gray-200 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#0e382c] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            الكل ({allIndexedItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('calculator')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'calculator'
                ? 'bg-[#0e382c] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            <CalcIcon className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>حاسبة ومسائل شهيرة</span>
          </button>
          <button
            onClick={() => setActiveFilter('book')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'book'
                ? 'bg-[#0e382c] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>كتاب الفرائض (28)</span>
          </button>
          <button
            onClick={() => setActiveFilter('endowment')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'endowment'
                ? 'bg-[#0e382c] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>الوقف وأحكامه (18)</span>
          </button>
          <button
            onClick={() => setActiveFilter('dictionary')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'dictionary'
                ? 'bg-[#0e382c] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>المعجم والمصطلحات</span>
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto flex-1 divide-y divide-gray-100 p-2">
          {results.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-700 text-base">لا توجد نتائج مطابقة لبحثك</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                جرّب البحث بكلمة أخرى مثل: "العول"، "الرد"، "الكلالة"، "العُمريتان"، "ناظر الوقف"، أو "الثلث".
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 text-right ${
                    isSelected
                      ? 'bg-gradient-to-l from-[#0e382c]/10 via-[#0e382c]/5 to-transparent border-r-4 border-[#0e382c]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'preset'
                          ? 'bg-[#c5a059]/20 text-[#0e382c]'
                          : item.type === 'chapter'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.type === 'endowment'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {item.type === 'preset' && <Sparkles className="w-4 h-4 text-[#c5a059]" />}
                      {item.type === 'chapter' && <BookOpen className="w-4 h-4" />}
                      {item.type === 'endowment' && <Layers className="w-4 h-4" />}
                      {item.type === 'term' && <BookMarked className="w-4 h-4" />}
                      {item.type === 'navigation' && <CalcIcon className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-[#0e382c] truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#8c6b2d] bg-[#fbf9f4] border border-[#c5a059]/30 px-2 py-0.5 rounded-md font-sans">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.type === 'preset' ? (
                      <span className="text-xs bg-[#c5a059] text-[#0e382c] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                        <span>احسب الآن</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 group-hover:text-[#0e382c] flex items-center gap-1">
                        <span>عرض</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#fbf9f4] border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between px-5 font-sans">
          <div className="flex items-center gap-3">
            <span>استخدم الأسهم <strong>↑</strong> <strong>↓</strong> للتنقل</span>
            <span>·</span>
            <span>اضغط <strong>Enter ↵</strong> للاختيار</span>
          </div>
          <span className="text-[#0e382c] font-semibold">منصة المواريث والوقف</span>
        </div>
      </div>
    </div>
  );
};
