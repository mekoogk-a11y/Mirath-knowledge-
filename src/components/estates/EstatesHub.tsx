import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building,
  Coins,
  ShieldCheck,
  ChevronLeft,
  X,
  Calendar,
  Save,
  Trash2,
  Share2,
  ExternalLink,
  History,
  CheckSquare,
  FileCheck,
} from 'lucide-react';
import { EstateCase, CaseStatus, EstateAsset, EstateObligation } from '../../types/platform';
import { platformStore } from '../../data/platformStore';

interface EstatesHubProps {
  onOpenCalculatorWithCase?: (caseData: EstateCase) => void;
}

export const EstatesHub: React.FC<EstatesHubProps> = ({ onOpenCalculatorWithCase }) => {
  const [cases, setCases] = useState<EstateCase[]>(() => platformStore.getEstateCases());
  const [selectedCase, setSelectedCase] = useState<EstateCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const currentUser = platformStore.getCurrentUser();

  const refreshCases = () => {
    setCases(platformStore.getEstateCases());
    if (selectedCase) {
      setSelectedCase(platformStore.getEstateCaseById(selectedCase.id) || null);
    }
  };

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.deceasedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [cases, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: cases.length,
      underReview: cases.filter((c) => c.status === 'under_review').length,
      needsCompletion: cases.filter((c) => c.status === 'needs_completion').length,
      reviewed: cases.filter((c) => c.status === 'reviewed').length,
      closed: cases.filter((c) => c.status === 'closed').length,
      totalNetValue: cases.reduce((sum, c) => sum + (c.netDistributableEstate || 0), 0),
    };
  }, [cases]);

  // Handle status update
  const handleUpdateStatus = (caseId: string, newStatus: CaseStatus) => {
    platformStore.updateCaseStatus(caseId, newStatus, `تحديث بواسطة ${currentUser.name}`);
    refreshCases();
  };

  // Status badge helper
  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'draft':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">مسودة</span>;
      case 'needs_completion':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3 h-3" /> يحتاج استكمالاً</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-800 border border-blue-300 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> قيد المراجعة</span>;
      case 'reviewed':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> تمت مراجعته</span>;
      case 'closed':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-gray-200 text-gray-800 border border-gray-300">مغلق وموزع</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
              <FolderKanban className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>إدارة وحصر التركات الرقمية المعتمدة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
              ملفات التركات وقسمة المواريث
            </h1>
            <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
              نظام متكامل لتنظيم ملفات التركات، بدءاً من حصر بيانات المتوفى والورثة، وتوثيق الأصول والالتزامات، وإدارة دورة المراجعة الشرعية وسجل العمليات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewCaseModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#dfba73] hover:from-[#b38f4a] hover:to-[#c5a059] text-[#0a271f] font-bold text-sm shadow-md flex items-center gap-2 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء ملف تركة جديد</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#c5a059]/20">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-[#c5a059]">إجمالي ملفات التركات</div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stats.total}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-amber-300">تحتاج استكمالاً ومتابعة</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono">{stats.needsCompletion}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-blue-300">قيد المراجعة الشرعية</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-300 font-mono">{stats.underReview}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-emerald-300">معتمدة وموثقة</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-300 font-mono">{stats.reviewed}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c5a059]/25 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الملف أو المدينة..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e382c]/20 focus:border-[#0e382c]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'draft', label: 'مسودة' },
            { id: 'needs_completion', label: 'يحتاج استكمالاً' },
            { id: 'under_review', label: 'قيد المراجعة' },
            { id: 'reviewed', label: 'تمت مراجعته' },
            { id: 'closed', label: 'مغلق' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-[#c5a059]/30 hover:border-[#c5a059] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5 sm:p-6 space-y-4">
              {/* Header Badge & Number */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <span className="font-mono text-xs text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  {c.caseNumber}
                </span>
                {getStatusBadge(c.status)}
              </div>

              {/* Title & Deceased */}
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#0e382c] group-hover:text-[#c5a059] transition font-amiri">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>المتوفى: {c.deceasedName} ({c.deceasedGender === 'male' ? 'ذكر' : 'أنثى'})</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>تاريخ الوفاة: {c.deathDate || 'غير مسجل'} • {c.city}</span>
                </p>
              </div>

              {/* Financial Summary */}
              <div className="bg-[#fcfaf6] rounded-xl p-3 border border-[#c5a059]/20 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span>إجمالي التركة:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {c.totalGrossEstate.toLocaleString('ar-EG')} {c.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>الالتزامات والديون والوصايا:</span>
                  <span className="font-mono text-red-600">
                    - {c.totalObligations.toLocaleString('ar-EG')} {c.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#0e382c] font-bold border-t border-gray-200 pt-1.5">
                  <span>الصافي الموزع شرعاً:</span>
                  <span className="font-mono text-sm text-[#0e382c]">
                    {c.netDistributableEstate.toLocaleString('ar-EG')} {c.currency}
                  </span>
                </div>
              </div>

              {/* Meta indicators */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{c.assets?.length || 0} أصول</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#0e382c]" />
                  <span>{c.documents?.length || 0} مستندات</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>{c.tasks?.length || 0} مهام</span>
                </span>
              </div>
            </div>

            {/* Footer action button */}
            <div className="bg-[#f8f6f0] px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedCase(c)}
                className="text-xs font-bold text-[#0e382c] hover:text-[#c5a059] flex items-center gap-1 transition"
              >
                <span>فتح ملف التركة الكامل</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-gray-400">آخر تحديث: {c.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">لا توجد ملفات تركات مطابقة</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            يمكنك إنشاء ملف تركة جديد أو تعديل معايير البحث والتصفية لعرض النتائج.
          </p>
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl hover:bg-[#124838] transition"
          >
            إنشاء ملف تركة جديد الآن
          </button>
        </div>
      )}

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <EstateCaseDetailsModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
          onRefresh={refreshCases}
        />
      )}

      {/* New Case Creation Modal */}
      {isNewCaseModalOpen && (
        <NewEstateCaseModal
          onClose={() => setIsNewCaseModalOpen(false)}
          onCreated={(newCase) => {
            setIsNewCaseModalOpen(false);
            refreshCases();
            setSelectedCase(newCase);
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// مكون نافذة تفاصيل ملف التركة الكامل
// -------------------------------------------------------------

interface DetailsProps {
  caseData: EstateCase;
  onClose: () => void;
  onUpdateStatus: (caseId: string, status: CaseStatus) => void;
  onRefresh: () => void;
}

const EstateCaseDetailsModal: React.FC<DetailsProps> = ({
  caseData,
  onClose,
  onUpdateStatus,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'obligations' | 'documents' | 'tasks' | 'audit'>('overview');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetValue, setNewAssetValue] = useState<number>(0);
  const [newAssetType, setNewAssetType] = useState<EstateAsset['type']>('real_estate');
  const [newObligationTitle, setNewObligationTitle] = useState('');
  const [newObligationAmount, setNewObligationAmount] = useState<number>(0);
  const [newObligationType, setNewObligationType] = useState<EstateObligation['type']>('debt_people');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const currentUser = platformStore.getCurrentUser();

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim() || newAssetValue <= 0) return;

    const typeNames: Record<EstateAsset['type'], string> = {
      real_estate: 'عقار سكني وتجاري',
      bank_account: 'حساب بنكي',
      shares: 'أسهم واستثمارات',
      vehicle: 'مركبة',
      business: 'نشاط تجاري',
      other: 'أصل آخر',
    };

    const newAsset: EstateAsset = {
      id: `ast-${Date.now()}`,
      title: newAssetTitle.trim(),
      estimatedValue: newAssetValue,
      type: newAssetType,
      typeName: typeNames[newAssetType],
    };

    const updated = { ...caseData };
    updated.assets = [...(updated.assets || []), newAsset];
    updated.totalGrossEstate = updated.assets.reduce((sum, a) => sum + a.estimatedValue, 0);
    updated.netDistributableEstate = Math.max(0, updated.totalGrossEstate - updated.totalObligations);

    platformStore.saveEstateCase(updated);
    setNewAssetTitle('');
    setNewAssetValue(0);
    onRefresh();
  };

  const handleAddObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObligationTitle.trim() || newObligationAmount <= 0) return;

    const typeNames: Record<EstateObligation['type'], string> = {
      funeral: 'مؤن التجهيز والدفن',
      debt_god: 'ديون لله (زكاة/كفارة)',
      debt_people: 'ديون للعباد',
      bequest: 'وصية شرعية (بحدود الثلث)',
      other: 'التزام آخر',
    };

    const newOb: EstateObligation = {
      id: `ob-${Date.now()}`,
      title: newObligationTitle.trim(),
      amount: newObligationAmount,
      type: newObligationType,
      typeName: typeNames[newObligationType],
      isSettled: false,
    };

    const updated = { ...caseData };
    updated.obligations = [...(updated.obligations || []), newOb];
    updated.totalObligations = updated.obligations.reduce((sum, o) => sum + o.amount, 0);
    updated.netDistributableEstate = Math.max(0, updated.totalGrossEstate - updated.totalObligations);

    platformStore.saveEstateCase(updated);
    setNewObligationTitle('');
    setNewObligationAmount(0);
    onRefresh();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const updated = { ...caseData };
    updated.tasks = [
      ...(updated.tasks || []),
      {
        id: `tsk-${Date.now()}`,
        caseId: caseData.id,
        title: newTaskTitle.trim(),
        assigneeName: currentUser.name,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'pending',
        priority: 'normal',
      },
    ];
    platformStore.saveEstateCase(updated);
    setNewTaskTitle('');
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#c5a059]/40 overflow-hidden text-right" dir="rtl">
        {/* Drawer Header */}
        <div className="bg-gradient-to-l from-[#09261e] to-[#0e382c] p-6 text-white flex items-start justify-between gap-4 border-b border-[#c5a059]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#f3e5ab] border border-white/20">
                {caseData.caseNumber}
              </span>
              <span className="text-xs text-[#c5a059]">ملف تركة رسمي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-[#fdfbf7]">{caseData.title}</h2>
            <p className="text-xs text-gray-300 mt-1">
              المتوفى: {caseData.deceasedName} • تاريخ الوفاة: {caseData.deathDate} • المدينة: {caseData.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow State Bar */}
        <div className="bg-[#fcfaf6] px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span>حالة الملف الحالية:</span>
            <span className="font-bold text-[#0e382c]">{caseData.statusText}</span>
          </div>

          {/* Stepper Buttons for Status Progression */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'draft', label: 'مسودة' },
              { id: 'needs_completion', label: 'يحتاج استكمالاً' },
              { id: 'under_review', label: 'قيد المراجعة' },
              { id: 'reviewed', label: 'تمت المراجعة' },
              { id: 'closed', label: 'مغلق وموزع' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => onUpdateStatus(caseData.id, st.id as CaseStatus)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  caseData.status === st.id
                    ? 'bg-[#0e382c] text-[#f3e5ab] ring-1 ring-[#c5a059]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-6 flex flex-wrap gap-4 text-xs font-semibold bg-gray-50">
          {[
            { id: 'overview', label: 'نظرة عامة والورثة' },
            { id: 'assets', label: `الأصول والممتلكات (${caseData.assets?.length || 0})` },
            { id: 'obligations', label: `الالتزامات والوصايا (${caseData.obligations?.length || 0})` },
            { id: 'documents', label: `المستندات (${caseData.documents?.length || 0})` },
            { id: 'tasks', label: `المهام والمتابعة (${caseData.tasks?.length || 0})` },
            { id: 'audit', label: 'سجل العمليات (Audit)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#0e382c] text-[#0e382c] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#f9f8f4] p-4 rounded-2xl border border-[#c5a059]/20">
                  <div className="text-xs text-gray-500">إجمالي الأصول (Gross Estate)</div>
                  <div className="text-lg font-bold text-[#0e382c] font-mono mt-1">
                    {caseData.totalGrossEstate.toLocaleString('ar-EG')} {caseData.currency}
                  </div>
                </div>
                <div className="bg-[#f9f8f4] p-4 rounded-2xl border border-[#c5a059]/20">
                  <div className="text-xs text-gray-500">مجموع الالتزامات والوصايا</div>
                  <div className="text-lg font-bold text-red-600 font-mono mt-1">
                    {caseData.totalObligations.toLocaleString('ar-EG')} {caseData.currency}
                  </div>
                </div>
                <div className="bg-[#0e382c]/5 p-4 rounded-2xl border border-[#0e382c]/20">
                  <div className="text-xs text-[#0e382c] font-bold">صافي التركة القابلة للقسمة</div>
                  <div className="text-lg font-bold text-[#0e382c] font-mono mt-1">
                    {caseData.netDistributableEstate.toLocaleString('ar-EG')} {caseData.currency}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-1">
                <h4 className="text-xs font-bold text-gray-700">بيان الحالة والوصية والورثة:</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {caseData.notes || 'لا توجد ملاحظات مسجلة على هذا الملف.'}
                </p>
              </div>

              {/* Sharia Principles Reminder */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>الترتيب الشرعي لإخراج الحقوق المتعلقة بالتركة:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  1. مؤن تجهيز الميت بالمعروف • 2. الديون المتعلقة بعين التركة (كالرهن) • 3. الديون المرسلة في الذمة (لله وللعباد) • 4. الوصية بالثلث فأقل لغير وارث • 5. قسمة الباقي بين الورثة حسب الفروض والعصوبات الشرعية.
                </p>
              </div>
            </div>
          )}

          {/* 2. Assets */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0e382c]">حصر أصول التركة وممتلكاتها:</h3>
              </div>

              <div className="space-y-3">
                {caseData.assets?.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#0e382c]/10 text-[#0e382c] rounded text-[11px] font-semibold">
                          {a.typeName}
                        </span>
                        <h4 className="font-bold text-sm text-gray-800">{a.title}</h4>
                      </div>
                      {a.location && <p className="text-xs text-gray-500 mt-1">{a.location}</p>}
                      {a.ownershipDocRef && <p className="text-[11px] text-gray-400 mt-0.5">{a.ownershipDocRef}</p>}
                    </div>
                    <div className="text-left font-mono font-bold text-sm text-[#0e382c]">
                      {a.estimatedValue.toLocaleString('ar-EG')} {caseData.currency}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Asset Form */}
              <form onSubmit={handleAddAsset} className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 space-y-3">
                <h4 className="text-xs font-bold text-gray-700">إضافة أصل جديد للتركة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newAssetTitle}
                    onChange={(e) => setNewAssetTitle(e.target.value)}
                    placeholder="اسم الأصل (مثال: عمارة سكنية، رصيد بنكي)..."
                    className="col-span-1 sm:col-span-2 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#0e382c]"
                  />
                  <input
                    type="number"
                    value={newAssetValue || ''}
                    onChange={(e) => setNewAssetValue(Number(e.target.value))}
                    placeholder="القيمة التقديرية..."
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-[#0e382c]"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="real_estate">عقار</option>
                    <option value="bank_account">حساب بنكي</option>
                    <option value="shares">أسهم وحصص</option>
                    <option value="vehicle">مركبة</option>
                    <option value="business">مشروع / محل</option>
                    <option value="other">أصل آخر</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-lg hover:bg-[#124838] transition"
                  >
                    حفظ الأصل
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Obligations */}
          {activeTab === 'obligations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0e382c]">الالتزامات والديون والوصايا:</h3>
              </div>

              <div className="space-y-3">
                {caseData.obligations?.map((ob) => (
                  <div
                    key={ob.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-[11px] font-semibold">
                          {ob.typeName}
                        </span>
                        <h4 className="font-bold text-sm text-gray-800">{ob.title}</h4>
                      </div>
                      {ob.creditorOrBeneficiary && (
                        <p className="text-xs text-gray-500 mt-1">المستحق / الدائن: {ob.creditorOrBeneficiary}</p>
                      )}
                    </div>
                    <div className="text-left font-mono font-bold text-sm text-red-600">
                      - {ob.amount.toLocaleString('ar-EG')} {caseData.currency}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Obligation Form */}
              <form onSubmit={handleAddObligation} className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 space-y-3">
                <h4 className="text-xs font-bold text-gray-700">قيد التزام أو دين أو وصية جديدة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newObligationTitle}
                    onChange={(e) => setNewObligationTitle(e.target.value)}
                    placeholder="بيان الدين أو الوصية (مثال: سداد قرض، مؤن دفن، وصية خيرية)..."
                    className="col-span-1 sm:col-span-2 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#0e382c]"
                  />
                  <input
                    type="number"
                    value={newObligationAmount || ''}
                    onChange={(e) => setNewObligationAmount(Number(e.target.value))}
                    placeholder="المبلغ..."
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-[#0e382c]"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <select
                    value={newObligationType}
                    onChange={(e) => setNewObligationType(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="funeral">مؤن التجهيز والدفن</option>
                    <option value="debt_god">ديون لله (زكاة/كفارة/حج)</option>
                    <option value="debt_people">ديون للعباد</option>
                    <option value="bequest">وصية شرعية (بحدود الثلث)</option>
                    <option value="other">التزام آخر</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition"
                  >
                    قيد الالتزام
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#0e382c]">المستندات والصكوك المرفوعة في هذا الملف:</h3>
              <div className="space-y-3">
                {caseData.documents?.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-[#0e382c]" />
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">{doc.title}</h4>
                        <p className="text-[11px] text-gray-500">
                          {doc.typeName} • المالك/الجهة: {doc.ownerName} • التاريخ: {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      معتمد ومراجع
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Tasks */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#0e382c]">المهام والإجراءات المطلوبة للملف:</h3>
              <div className="space-y-2">
                {caseData.tasks?.map((tsk) => (
                  <div
                    key={tsk.id}
                    className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-800">{tsk.title}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">المكلف: {tsk.assigneeName} • الاستحقاق: {tsk.dueDate}</span>
                  </div>
                ))}
              </div>

              {/* Add Task */}
              <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="إضافة مهمة متابعة جديدة..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl"
                >
                  إضافة
                </button>
              </form>
            </div>
          )}

          {/* 6. Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0e382c]">سجل العمليات والتعديلات (Audit Log):</h3>
              <div className="space-y-2">
                {platformStore
                  .getAuditLogs()
                  .filter((l) => l.entityId === caseData.id || l.entityType === 'estate')
                  .slice(0, 10)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#0e382c]">{log.action}</span>
                        <p className="text-gray-600 mt-0.5">{log.details}</p>
                        <p className="text-[10px] text-gray-400 mt-1">بواسطة: {log.userName} ({log.userRole})</p>
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">{log.timestamp}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center text-xs">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
          >
            طباعة تقرير ملف التركة
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0e382c] text-[#f3e5ab] font-bold rounded-xl hover:bg-[#124838] transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// مكون نافذة إنشاء ملف تركة جديد
// -------------------------------------------------------------

interface NewCaseModalProps {
  onClose: () => void;
  onCreated: (newCase: EstateCase) => void;
}

const NewEstateCaseModal: React.FC<NewCaseModalProps> = ({ onClose, onCreated }) => {
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male');
  const [deathDate, setDeathDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [city, setCity] = useState('الرياض');
  const [currency, setCurrency] = useState('ريال سعودي');
  const [initialEstateValue, setInitialEstateValue] = useState<number>(100000);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) return;

    const caseNumber = `TRK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newCase: EstateCase = {
      id: `est-${Date.now()}`,
      caseNumber,
      title: `تركة المرحوم ${deceasedName.trim()}`,
      deceasedName: deceasedName.trim(),
      deceasedGender,
      deathDate: deathDate || new Date().toISOString().split('T')[0],
      nationalId: nationalId.trim() || undefined,
      city,
      currency,
      totalGrossEstate: initialEstateValue,
      totalObligations: 0,
      netDistributableEstate: initialEstateValue,
      status: 'draft',
      statusText: 'مسودة قيد الحصر',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      heirsCount: 0,
      notes: notes.trim(),
      assets: [
        {
          id: `ast-init-${Date.now()}`,
          type: 'bank_account',
          typeName: 'رصيد مبدئي للتركة',
          title: 'الرصيد المبدئي المحصور',
          estimatedValue: initialEstateValue,
        },
      ],
      obligations: [],
      documents: [],
      tasks: [
        {
          id: `tsk-init-${Date.now()}`,
          caseId: '',
          title: 'استخراج صك حصر الورثة الرسمي',
          assigneeName: 'مدخل البيانات',
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          priority: 'urgent',
        },
      ],
      reviews: [],
      auditLogs: [],
    };

    const saved = platformStore.saveEstateCase(newCase);
    onCreated(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-5 text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold font-amiri text-[#0e382c]">إنشاء ملف تركة جديد</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">اسم المتوفى كاملاً:</label>
            <input
              type="text"
              required
              value={deceasedName}
              onChange={(e) => setDeceasedName(e.target.value)}
              placeholder="مثال: عبد الله بن محمد آل فهد"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#0e382c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">جنس المتوفى:</label>
              <select
                value={deceasedGender}
                onChange={(e) => setDeceasedGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="male">ذكر (رجل)</option>
                <option value="female">أنثى (امرأة)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">تاريخ الوفاة:</label>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">المدينة / المنطقة:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="الرياض / الخرطوم..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">العملة المعتمدة:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="ريال سعودي">ريال سعودي</option>
                <option value="جنيه سوداني">جنيه سوداني</option>
                <option value="درهم إماراتي">درهم إماراتي</option>
                <option value="دينار كويتي">دينار كويتي</option>
                <option value="جنيه مصري">جنيه مصري</option>
                <option value="دولار أمريكي">دولار أمريكي</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">القيمة التقديرية الأولية للتركة:</label>
            <input
              type="number"
              min="0"
              value={initialEstateValue}
              onChange={(e) => setInitialEstateValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">ملاحظات أولية عن الورثة والوصية:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="بيانات أولية عن الورثة والوصايا إن وجدت..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
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
              إنشاء الملف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
