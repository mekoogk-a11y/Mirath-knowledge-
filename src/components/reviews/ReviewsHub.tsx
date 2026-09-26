import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { platformStore } from '../../data/platformStore';

export const ReviewsHub: React.FC = () => {
  const [estateCases, setEstateCases] = useState(() => platformStore.getEstateCases());
  const [documents, setDocuments] = useState(() => platformStore.getAllDocuments());
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const currentUser = platformStore.getCurrentUser();

  const pendingEstates = estateCases.filter((c) => c.status === 'under_review' || c.status === 'needs_completion');
  const pendingDocs = documents.filter((d) => d.reviewStatus === 'pending');

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>بوابة المراجعة والتدقيق الشرعي والقانوني</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
            المراجعات والاعتمادات الرسمية
          </h1>
          <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
            مساحة عمل متخصصة للمراجعين الشرعيين والقانونيين لتدقيق ملفات التركات، مطابقة حصر الورثة، فحص شروط الواقف، واعتماد مراحل الصرف والأنصبة.
          </p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#c5a059]/20">
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-amber-300">تركات تنتظر المراجعة</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{pendingEstates.length} ملفات</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-blue-300">وثائق وصكوك قيد التدقيق</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{pendingDocs.length} وثيقة</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-xs text-[#c5a059]">المراجع الحالي</span>
            <div className="text-sm font-bold text-white mt-1 truncate">{currentUser.name}</div>
          </div>
        </div>
      </div>

      {/* Review Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Estates for Review */}
        <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#0e382c] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#c5a059]" />
              <span>ملفات تركات تتطلب قرار المراجع:</span>
            </h3>
            <span className="text-xs font-mono font-bold text-gray-500">{pendingEstates.length} معلقة</span>
          </div>

          <div className="space-y-3">
            {pendingEstates.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {c.caseNumber}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">{c.title}</h4>
                    <p className="text-gray-500 mt-0.5">المتوفى: {c.deceasedName} • الصافي: {c.netDistributableEstate.toLocaleString('ar-EG')} {c.currency}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                    {c.statusText}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      platformStore.updateCaseStatus(c.id, 'reviewed', 'تم اعتماد ومطابقة الأنصبة الشرعية');
                      setEstateCases(platformStore.getEstateCases());
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>اعتماد شرعي</span>
                  </button>
                  <button
                    onClick={() => {
                      platformStore.updateCaseStatus(c.id, 'needs_completion', 'طلب استكمال حصر باقي الورثة');
                      setEstateCases(platformStore.getEstateCases());
                    }}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>طلب استكمال</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingEstates.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">
                لا توجد ملفات تركات معلقة حالياً بانتظار المراجعة.
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Recent Reviews Audit Log */}
        <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#0e382c] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c5a059]" />
              <span>سجل قرارات التدقيق الأخيرة:</span>
            </h3>
          </div>

          <div className="space-y-3">
            {platformStore
              .getAuditLogs()
              .filter((l) => l.action.includes('مراجعة') || l.action.includes('اعتماد'))
              .slice(0, 6)
              .map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-gray-100 bg-[#fcfaf6] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0e382c]">{log.action}</span>
                    <span className="font-mono text-[10px] text-gray-400">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-600">{log.details}</p>
                  <p className="text-[10px] text-gray-400">بواسطة: {log.userName} ({log.userRole})</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
