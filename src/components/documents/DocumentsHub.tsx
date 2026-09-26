import React, { useState, useMemo } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Sparkles,
  ShieldAlert,
  FileCheck,
  Building,
  User,
  Calendar,
  X,
  Check,
} from 'lucide-react';
import { CaseDocument } from '../../types/platform';
import { platformStore } from '../../data/platformStore';

export const DocumentsHub: React.FC = () => {
  const [documents, setDocuments] = useState<CaseDocument[]>(() => platformStore.getAllDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const currentUser = platformStore.getCurrentUser();

  const refreshDocs = () => {
    setDocuments(platformStore.getAllDocuments());
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.typeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || doc.reviewStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, searchQuery, typeFilter, statusFilter]);

  const handleReviewAction = (docId: string, decision: 'approved' | 'rejected' | 'needs_fix', notes: string) => {
    platformStore.reviewDocument(docId, decision, notes);
    refreshDocs();
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>نظام إدارة الوثائق والمستندات الرسمية والمراجعة الشرعية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
              مستودع المستندات والصكوك الشرعية
            </h1>
            <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
              إدارة مركزية لشهادات الوفاة، صكوك حصر الورثة، عقود الملكية، صكوك الأوقاف، مع التدقيق والاعتماد البشري الإلزامي وميزة الاستخراج الذكي الاسترشادي.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#dfba73] hover:from-[#b38f4a] hover:to-[#c5a059] text-[#0a271f] font-bold text-sm shadow-md flex items-center gap-2 transition active:scale-95 self-start"
          >
            <Upload className="w-4 h-4" />
            <span>رفع مستند رسمي جديد</span>
          </button>
        </div>

        {/* AI Disclaimer Alert */}
        <div className="mt-6 pt-4 border-t border-[#c5a059]/20 flex items-center gap-3 bg-black/20 p-3 rounded-2xl text-xs text-[#f3e5ab]">
          <ShieldAlert className="w-5 h-5 text-[#c5a059] shrink-0" />
          <span>
            <strong>تنبيه نظامي وشرعي:</strong> يمكن استخدام تقنيات استخراج البيانات لقراءة المستندات، ولكن يمنع منعاً باتاً اعتماد أي بيانات مستخرجة آلياً دون مراجعة وتوقيع المستخدم أو المراجع الشرعي المختص.
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c5a059]/25 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المستند، الصك، المالك..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#0e382c]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
            {[
              { id: 'all', label: 'كافة الأنواع' },
              { id: 'heirs_proof', label: 'حصر ورثة' },
              { id: 'death_certificate', label: 'شهادة وفاة' },
              { id: 'deed', label: 'صك وقف' },
              { id: 'property_title', label: 'صك ملكية' },
              { id: 'financial', label: 'مستند مالي' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  typeFilter === t.id
                    ? 'bg-[#0e382c] text-[#f3e5ab]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0e382c]/10 text-[#0e382c]">
                  {doc.typeName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    doc.reviewStatus === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : doc.reviewStatus === 'pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {doc.reviewStatus === 'approved' ? 'معتمد ومراجع' : doc.reviewStatus === 'pending' ? 'بانتظار المراجعة' : 'مرفوض'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-snug">{doc.title}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>الجهة / المالك: {doc.ownerName}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>تاريخ الرفع: {doc.uploadDate} • الحجم: {doc.fileSizeText}</span>
                </p>
              </div>

              {doc.reviewerNotes && (
                <div className="p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-600 border border-gray-100">
                  <span className="font-bold text-gray-700 block">ملاحظات المراجع:</span>
                  <span>{doc.reviewerNotes}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="text-xs font-bold text-[#0e382c] hover:text-[#c5a059] flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة وتدقيق المستند</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedDoc && (
        <ReviewDocModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDecision={(decision, notes) => handleReviewAction(selectedDoc.id, decision, notes)}
        />
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadDocModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            refreshDocs();
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// نافذة تدقيق ومراجعة المستند
// -------------------------------------------------------------

interface ReviewModalProps {
  doc: CaseDocument;
  onClose: () => void;
  onDecision: (decision: 'approved' | 'rejected' | 'needs_fix', notes: string) => void;
}

const ReviewDocModal: React.FC<ReviewModalProps> = ({ doc, onClose, onDecision }) => {
  const [notes, setNotes] = useState(doc.reviewerNotes || '');
  const [simulatedExtraction, setSimulatedExtraction] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleSimulateAIExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setSimulatedExtraction(
        `[بيانات مستخرجة استرشادية]: تم التعرف على رقم الصك (${Math.floor(Math.random() * 8999999) + 1000000})، وتاريخه، وتطابق بيانات الورثة مع السجل المدني. يتطلب تدقيق الأسماء والأنصبة من قبل المراجع.`
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-5 text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <span className="text-[11px] text-[#c5a059] font-bold block">{doc.typeName}</span>
            <h3 className="font-bold text-base text-[#0e382c]">{doc.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Meta */}
        <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
          <p className="text-gray-600">صاحب المستند / الجهة المصدرة: <strong>{doc.ownerName}</strong></p>
          <p className="text-gray-600">تاريخ الرفع: <strong>{doc.uploadDate}</strong> • الحجم: <strong>{doc.fileSizeText}</strong></p>
        </div>

        {/* AI extraction helper button with warning */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>مساعد القراءة الآلية للمستندات</span>
            </span>
            <button
              onClick={handleSimulateAIExtract}
              disabled={isExtracting}
              className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg font-bold text-[11px]"
            >
              {isExtracting ? 'جاري التحليل...' : 'استخراج تجريبي للبيانات'}
            </button>
          </div>
          {simulatedExtraction && (
            <p className="text-amber-950 font-mono text-[11px] bg-white p-2 rounded-lg border border-amber-200">
              {simulatedExtraction}
            </p>
          )}
          <p className="text-[10px] text-amber-800">
            * شرط المنصة: ممنوع اعتماد البيانات المستخرجة تلقائياً دون تدقيق بشري كامل.
          </p>
        </div>

        {/* Reviewer Notes Input */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-gray-700">ملاحظات وقرار المراجع الشرعي:</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب أسباب القبول أو التوجيهات بالاستكمال والتعديل..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
          />
        </div>

        {/* Decision Actions */}
        <div className="pt-2 flex flex-wrap justify-end gap-2 text-xs">
          <button
            onClick={() => onDecision('rejected', notes || 'مرفوض لعدم اكتمال الشروط')}
            className="px-4 py-2 rounded-xl bg-red-100 text-red-800 font-bold hover:bg-red-200"
          >
            رفض المستند
          </button>
          <button
            onClick={() => onDecision('needs_fix', notes || 'يحتاج استكمال')}
            className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-bold hover:bg-amber-200"
          >
            طلب استكمال
          </button>
          <button
            onClick={() => onDecision('approved', notes || 'معتمد بعد المراجعة والمطابقة')}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
          >
            اعتماد المستند رسمياً
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// نافذة رفع مستند جديد
// -------------------------------------------------------------

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UploadDocModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CaseDocument['type']>('heirs_proof');
  const [ownerName, setOwnerName] = useState('');

  const typeLabels: Record<CaseDocument['type'], string> = {
    deed: 'صك وقف رسمي',
    death_certificate: 'شهادة وفاة',
    heirs_proof: 'صك حصر ورثة',
    property_title: 'صك ملكية عقار',
    bank_statement: 'كشف حساب بنكي',
    contract: 'عقد استثمار/إيجار',
    financial: 'إيصال أو فاتورة مالية',
    other: 'وثيقة أخرى',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: CaseDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      type,
      typeName: typeLabels[type],
      ownerName: ownerName.trim() || 'المراجع المعني',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSizeText: '1.8 MB',
      reviewStatus: 'pending',
    };

    // Attach to first estate case for demo persistence
    const cases = platformStore.getEstateCases();
    if (cases.length > 0) {
      cases[0].documents = [newDoc, ...(cases[0].documents || [])];
      platformStore.saveEstateCase(cases[0]);
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-4 text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-base text-[#0e382c]">رفع وثيقة أو صك رسمي</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">اسم أو وصف المستند:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: صك حصر ورثة المتوفى..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">نوع المستند:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
            >
              <option value="heirs_proof">صك حصر ورثة</option>
              <option value="death_certificate">شهادة وفاة</option>
              <option value="deed">صك وقفية</option>
              <option value="property_title">صك ملكية عقار</option>
              <option value="bank_statement">كشف حساب بنكي</option>
              <option value="contract">عقد إيجار / استثمار</option>
              <option value="financial">مستند مالي أو سند قبض</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">الجهة المصدرة أو المالك:</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="مثال: محكمة الأحوال الشخصية / كتابة العدل..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-1 text-gray-500">
            <Upload className="w-6 h-6 text-gray-400 mx-auto" />
            <p className="text-xs font-semibold">اسحب الملف هنا أو اضغط للاختيار</p>
            <p className="text-[10px] text-gray-400">يدعم صيغ PDF، JPG، PNG بحجم أقصى 15 ميجابايت</p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0e382c] text-[#f3e5ab] font-bold hover:bg-[#124838]"
            >
              حفظ ورفع المستند
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
