import React, { useState, useMemo } from 'react';
import { INHERITANCE_TERMS, TermDefinition } from '../data/dictionary';
import { BookMarked, Search, Filter, HelpCircle } from 'lucide-react';

export const DictionaryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'جميع المصطلحات' },
    { id: 'مفاهيم عامة', label: 'مفاهيم عامة' },
    { id: 'أنصبة وفروض', label: 'أنصبة وفروض' },
    { id: 'حجب وعصبات', label: 'حجب وعصبات' },
    { id: 'حساب وفرائض', label: 'حساب وفرائض' },
  ];

  const filteredTerms = useMemo(() => {
    return INHERITANCE_TERMS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.term.includes(search) ||
        item.shortDef.includes(search) ||
        item.fullDef.includes(search);
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <BookMarked className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>المعجم الاصطلاحي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          قاموس مصطلحات علم المواريث
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          دليل مبسط وشامل لأهم المفاهيم الفقهية والحسابية في علم الفرائض، مدعومة بالأمثلة التطبيقية.
        </p>
      </div>

      {/* Controls: Search & Category */}
      <div className="bg-white rounded-2xl p-5 border border-[#c5a059]/30 shadow-sm space-y-4 text-right">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مصطلح (مثل: العول، الرد، الكلالة، أصل المسألة، الحجب)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#0e382c] outline-hidden"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium ml-1">التصنيف:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#0e382c] text-white shadow-xs'
                  : 'bg-[#fbf9f4] border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500 text-sm">
            لم نجد مصطلحاً يطابق بحثك. جرب كلمة أخرى.
          </div>
        ) : (
          filteredTerms.map((term) => (
            <div
              key={term.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#c5a059]/50 transition shadow-xs space-y-3 text-right flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-lg text-[#0e382c] font-amiri">
                    {term.term}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0e382c]/10 text-[#0e382c] font-medium">
                    {term.category}
                  </span>
                </div>

                <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                  {term.shortDef}
                </p>

                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {term.fullDef}
                </p>
              </div>

              {term.example && (
                <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-[#c5a059]/20 text-[11px] text-gray-700 mt-2">
                  <strong className="text-[#0e382c]">مثال تطبيقي:</strong> {term.example}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
