import React, { useState, useMemo } from 'react';
import {
  Layers,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Plus,
  ArrowRight,
  Calendar,
  Phone,
  Search,
  Filter,
  ShieldCheck,
  ChevronDown,
  X,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  WaqfRecord,
  WaqfAsset,
  WaqfContract,
  WaqfDisbursement,
  WaqfTransaction,
  WaqfBeneficiary,
  DisbursementStage,
} from '../../types/platform';
import { platformStore } from '../../data/platformStore';

export const WaqfHub: React.FC = () => {
  const [waqfs, setWaqfs] = useState<WaqfRecord[]>(() => platformStore.getWaqfRecords());
  const [selectedWaqfId, setSelectedWaqfId] = useState<string>(waqfs[0]?.id || 'wqf-1');
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'contracts' | 'finances' | 'disbursements' | 'beneficiaries'>('overview');

  // Modals state
  const [isAddTrxModalOpen, setIsAddTrxModalOpen] = useState(false);
  const [isAddDisbModalOpen, setIsAddDisbModalOpen] = useState(false);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);

  const currentUser = platformStore.getCurrentUser();

  const refreshWaqfs = () => {
    setWaqfs(platformStore.getWaqfRecords());
  };

  const currentWaqf = useMemo(() => {
    return waqfs.find((w) => w.id === selectedWaqfId) || waqfs[0];
  }, [waqfs, selectedWaqfId]);

  // Advance disbursement workflow stage
  const handleAdvanceDisbursement = (disbursementId: string) => {
    platformStore.advanceDisbursementStage(currentWaqf.id, disbursementId);
    refreshWaqfs();
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>إدارة الأوقاف والأصول والعقود والمتابعة المالية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
              نظام إدارة الأوقاف الشرعية
            </h1>
            <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
              منظومة إدارية ومالية متكاملة لخدمة الأوقاف: حفظ وثائق الواقف وشروطه، متابعة الأصول والعقود، إدارة الإيرادات والمصروفات، ومسار الصرف السداسي المعتمد.
            </p>
          </div>

          {/* Waqf Selector */}
          <div className="bg-black/30 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <label className="text-xs text-[#c5a059] block mb-1 font-semibold">الوقف النشط حالياً:</label>
            <select
              value={selectedWaqfId}
              onChange={(e) => setSelectedWaqfId(e.target.value)}
              className="bg-[#0e382c] text-white text-xs font-bold px-3 py-2 rounded-xl border border-[#c5a059]/40 focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
            >
              {waqfs.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Highlights of Active Waqf */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#c5a059]/20">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-gray-300">القيمة التقديرية للأصول</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
              {currentWaqf.totalValue.toLocaleString('ar-EG')} ريال
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-[#c5a059]">الرصيد النقدي المتاح</div>
            <div className="text-lg sm:text-xl font-bold text-[#f3e5ab] font-mono mt-1">
              {currentWaqf.currentCashBalance.toLocaleString('ar-EG')} ريال
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-emerald-300">الإيرادات السنوية</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-300 font-mono mt-1">
              + {currentWaqf.totalAnnualRevenue.toLocaleString('ar-EG')} ريال
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/5">
            <div className="text-xs text-red-300">المصروفات والتوزيعات</div>
            <div className="text-lg sm:text-xl font-bold text-red-300 font-mono mt-1">
              - {currentWaqf.totalAnnualExpenses.toLocaleString('ar-EG')} ريال
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-[#c5a059]/25 shadow-sm flex flex-wrap gap-1 sm:gap-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'بيانات الوقف وشروط الواقف', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'assets', label: `الأصول والعقارات (${currentWaqf.assets?.length || 0})`, icon: <Building className="w-3.5 h-3.5" /> },
          { id: 'contracts', label: `العقود والتحصيل (${currentWaqf.contracts?.length || 0})`, icon: <FileCheck className="w-3.5 h-3.5" /> },
          { id: 'finances', label: 'الإدارة المالية والحركة', icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: 'disbursements', label: `دورة الصرف (${currentWaqf.disbursements?.length || 0})`, icon: <Clock className="w-3.5 h-3.5" /> },
          { id: 'beneficiaries', label: `المستفيدون والمصارف (${currentWaqf.beneficiaries?.length || 0})`, icon: <Users className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? 'bg-[#0e382c] text-[#f3e5ab] shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#c5a059]/25 shadow-sm space-y-5">
            <h3 className="text-lg font-bold font-amiri text-[#0e382c] border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>بيانات وثيقة الوقف والواقف</span>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-sans font-semibold">
                {currentWaqf.statusText}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">اسم الواقف:</span>
                <p className="font-bold text-gray-800 mt-1">{currentWaqf.endowerName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">الناظر الشرعي:</span>
                <p className="font-bold text-gray-800 mt-1">{currentWaqf.trusteeName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">رقم وتاريخ صك الوقف:</span>
                <p className="font-bold text-gray-800 mt-1">{currentWaqf.deedNumber} • {currentWaqf.deedDate}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">الجهة الإشرافية / المحكمة:</span>
                <p className="font-bold text-gray-800 mt-1">{currentWaqf.supervisorName || 'المحكمة العامة والهيئة العامة للأوقاف'}</p>
              </div>
            </div>

            {/* Conditions of Endower */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>شروط الواقف (شرط الواقف كنص الشارع):</span>
              </h4>
              <p className="text-amber-950 leading-relaxed font-sans">{currentWaqf.conditions}</p>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700">مصارف وغايات الوقف المعتمدة:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentWaqf.objectives.map((obj, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-gray-100 bg-[#fbf9f4] text-xs text-gray-700 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0e382c]" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#c5a059]/25 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-[#0e382c] border-b border-gray-100 pb-2">الملخص التنفيذي للوقف</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">عدد الأصول الوقفية:</span>
                  <span className="font-bold text-gray-800">{currentWaqf.assets?.length || 0} أصول</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">العقود النشطة:</span>
                  <span className="font-bold text-gray-800">{currentWaqf.contracts?.length || 0} عقود</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المستفيدون المعتمدون:</span>
                  <span className="font-bold text-gray-800">{currentWaqf.beneficiaries?.length || 0} جهات/أفراد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">معاملات الصرف الجارية:</span>
                  <span className="font-bold text-gray-800">{currentWaqf.disbursements?.length || 0} معاملات</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0e382c] text-white p-5 rounded-2xl border border-[#c5a059]/30 text-xs space-y-2">
              <span className="font-bold text-[#f3e5ab]">ضوابط الحوكمة والنزاهة:</span>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                تخضع كافة عمليات الصرف والتعاقد في منصة الميراث والوقف لمسار مراجعة شرعية وتدقيق محاسبي ثنائي لمنع أي تعارض في المصالح وحفظ الأصول الوقفية عبر الأجيال.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0e382c]">أصول وممتلكات الوقف الاستثمارية والتشغيلية:</h3>
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-[#124838] self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة أصل وقفي جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentWaqf.assets?.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0e382c]/10 text-[#0e382c]">
                      {asset.typeName}
                    </span>
                    <h4 className="font-bold text-base text-gray-900 mt-1">{asset.name}</h4>
                    <p className="text-xs text-gray-500">{asset.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    حالة الأصل: {asset.condition}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">القيمة التقديرية:</span>
                    <p className="font-mono font-bold text-gray-800 text-sm mt-0.5">
                      {asset.estimatedValue.toLocaleString('ar-EG')} ريال
                    </p>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">الإيراد السنوي المتوقع:</span>
                    <p className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                      {asset.annualRevenue.toLocaleString('ar-EG')} ريال
                    </p>
                  </div>
                </div>

                {asset.notes && <p className="text-xs text-gray-600 bg-[#fbf9f4] p-3 rounded-xl">{asset.notes}</p>}

                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span>العقود المرتبطة: {asset.contractsCount}</span>
                  <span>سجل الصيانة: {asset.maintenanceHistoryCount} عمليات</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0e382c]">عقود الإيجار والاستثمار والتحصيل:</h3>
            <button
              onClick={() => setIsAddContractModalOpen(true)}
              className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-[#124838] self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة عقد جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentWaqf.contracts?.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {c.contractNumber}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900">{c.tenantOrPartyName}</h4>
                    {c.daysRemaining <= 45 && (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>ينتهي قريباً (خلال {c.daysRemaining} يوماً)</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    الأصل: {c.assetName} • الفترة: {c.startDate} إلى {c.endDate} • الهاتف: {c.partyPhone}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-left">
                    <div className="text-gray-500">القيمة السنوية ({c.paymentCycleName}):</div>
                    <div className="font-bold text-gray-900 text-sm">{c.annualValue.toLocaleString('ar-EG')} ريال</div>
                  </div>
                  <div className="text-left border-r border-gray-200 pr-4">
                    <div className="text-emerald-600">المحصل:</div>
                    <div className="font-bold text-emerald-700 text-sm">{c.paidAmount.toLocaleString('ar-EG')} ريال</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Finances Tab */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0e382c]">حركة الإيرادات والمصروفات المالية:</h3>
            <button
              onClick={() => setIsAddTrxModalOpen(true)}
              className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-[#124838] self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل قيد مالي جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">نوع الحركة</th>
                    <th className="p-3">البيان والتفاصيل</th>
                    <th className="p-3">الأصل المرتبط</th>
                    <th className="p-3">المبلغ</th>
                    <th className="p-3">القائم بالقيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentWaqf.transactions?.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-mono text-gray-600">{trx.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            trx.type === 'revenue'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trx.typeName}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-900">{trx.notes}</td>
                      <td className="p-3 text-gray-500">{trx.assetName || '—'}</td>
                      <td className="p-3 font-mono font-bold text-sm">
                        <span className={trx.type === 'revenue' ? 'text-emerald-700' : 'text-red-600'}>
                          {trx.type === 'revenue' ? '+' : '-'} {trx.amount.toLocaleString('ar-EG')} {trx.currency}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{trx.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Disbursements 6-Stage Workflow Tab */}
      {activeTab === 'disbursements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#0e382c]">دورة الصرف والاعتماد السداسية:</h3>
              <p className="text-xs text-gray-500">
                مقترح صرف ← مراجعة داخلية ← اعتماد مخول ← تنفيذ ← إرفاق المستند ← إغلاق العملية
              </p>
            </div>
            <button
              onClick={() => setIsAddDisbModalOpen(true)}
              className="px-4 py-2 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-[#124838] self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تقديم مقترح صرف جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {currentWaqf.disbursements?.map((disb) => {
              const stages: { key: DisbursementStage; label: string }[] = [
                { key: 'proposal', label: 'مقترح صرف' },
                { key: 'internal_review', label: 'مراجعة داخلية' },
                { key: 'authorized_approval', label: 'اعتماد مخول' },
                { key: 'execution', label: 'تنفيذ' },
                { key: 'doc_attached', label: 'إرفاق مستند' },
                { key: 'closed', label: 'إغلاق العملية' },
              ];

              const currentStageIdx = stages.findIndex((s) => s.key === disb.currentStage);

              return (
                <div key={disb.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {disb.referenceNumber}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900">{disb.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        المستفيد/المورد: {disb.beneficiaryOrVendor} • الغرض: {disb.purpose}
                      </p>
                    </div>
                    <div className="text-left font-mono font-bold text-base text-[#0e382c]">
                      {disb.amount.toLocaleString('ar-EG')} {disb.currency}
                    </div>
                  </div>

                  {/* 6-Stage Visual Stepper */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    {stages.map((stage, idx) => {
                      const isDone = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div
                          key={stage.key}
                          className={`p-2 rounded-xl border transition ${
                            isDone
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : isCurrent
                              ? 'bg-[#0e382c] border-[#c5a059] text-[#f3e5ab] font-bold ring-2 ring-[#c5a059]/30'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                        >
                          <div className="text-[10px] opacity-75">المرحلة {idx + 1}</div>
                          <div className="text-[11px] mt-0.5">{stage.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stage Advancement Button */}
                  {disb.currentStage !== 'closed' && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvanceDisbursement(disb.id)}
                        className="px-4 py-2 bg-gradient-to-l from-[#c5a059] to-[#dfba73] hover:from-[#b38f4a] hover:to-[#c5a059] text-[#0a271f] font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        <span>الانتقال للمرحلة التالية في مسار الصرف</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Beneficiaries Tab */}
      {activeTab === 'beneficiaries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0e382c]">المستفيدون ومصارف الوقف المقيدة:</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWaqf.beneficiaries?.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0e382c]/10 text-[#0e382c]">
                      {b.typeName}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">{b.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {b.eligibilityStatusText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">الاستحقاق الشهري:</span>
                    <p className="font-mono font-bold text-gray-800 mt-0.5">{b.monthlyEntitlement.toLocaleString('ar-EG')} ريال</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">إجمالي المصروف:</span>
                    <p className="font-mono font-bold text-emerald-700 mt-0.5">{b.totalDistributedToDate.toLocaleString('ar-EG')} ريال</p>
                  </div>
                </div>

                {b.notes && <p className="text-xs text-gray-500 bg-[#fbf9f4] p-2.5 rounded-xl">{b.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Financial Transaction */}
      {isAddTrxModalOpen && (
        <AddTransactionModal
          waqfId={currentWaqf.id}
          onClose={() => setIsAddTrxModalOpen(false)}
          onSuccess={() => {
            setIsAddTrxModalOpen(false);
            refreshWaqfs();
          }}
        />
      )}

      {/* Modal: Add Disbursement Proposal */}
      {isAddDisbModalOpen && (
        <AddDisbursementModal
          waqfId={currentWaqf.id}
          onClose={() => setIsAddDisbModalOpen(false)}
          onSuccess={() => {
            setIsAddDisbModalOpen(false);
            refreshWaqfs();
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// نافذة إضافة قيد مالي (إيراد أو مصروف)
// -------------------------------------------------------------

interface AddTrxModalProps {
  waqfId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTransactionModal: React.FC<AddTrxModalProps> = ({ waqfId, onClose, onSuccess }) => {
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('إيجارات عقارية');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !notes.trim()) return;

    platformStore.addWaqfTransaction(waqfId, {
      type,
      typeName: type === 'revenue' ? 'إيراد وقفي' : 'مصروف وقفي',
      amount,
      currency: 'ريال سعودي',
      category,
      notes: notes.trim(),
      date: new Date().toISOString().split('T')[0],
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-4 text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-base text-[#0e382c]">تسجيل عملية مالية جديدة للوقف</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">نوع الحركة:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('revenue')}
                className={`py-2 rounded-xl font-bold transition ${
                  type === 'revenue'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                + إيراد وقفي
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-xl font-bold transition ${
                  type === 'expense'
                    ? 'bg-red-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                - مصروف وقفي
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">المبلغ (ريال سعودي):</label>
            <input
              type="number"
              required
              min="1"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="المبلغ..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">البند المالي:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
            >
              <option value="إيجارات عقارية">إيجارات عقارية</option>
              <option value="عوائد استثمارية وصكوك">عوائد استثمارية وصكوك</option>
              <option value="صيانة وتشغيل مباني">صيانة وتشغيل مباني</option>
              <option value="كفالة ورعاية مستفيدين">كفالة ورعاية مستفيدين</option>
              <option value="أجور ونظارة">أجور ونظارة</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">بيان الحركة والتفاصيل:</label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: تحصيل إيجار الربع الثالث من المعرض التجاري..."
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
              حفظ القيد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// نافذة تقديم مقترح صرف جديد
// -------------------------------------------------------------

interface AddDisbModalProps {
  waqfId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDisbursementModal: React.FC<AddDisbModalProps> = ({ waqfId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [beneficiary, setBeneficiary] = useState('');
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<WaqfDisbursement['category']>('كفالة أيتام');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    const waqf = platformStore.getWaqfById(waqfId);
    if (!waqf) return;

    const refNumber = `DSB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newDisb: WaqfDisbursement = {
      id: `disb-${Date.now()}`,
      waqfId,
      referenceNumber: refNumber,
      title: title.trim(),
      amount,
      currency: 'ريال سعودي',
      beneficiaryOrVendor: beneficiary.trim() || 'المستفيد المعتمد',
      purpose: purpose.trim(),
      category,
      proposalDate: new Date().toISOString().split('T')[0],
      currentStage: 'proposal',
      currentStageName: 'مقترح صرف مبدئي',
      stagesHistory: [
        {
          stage: 'proposal',
          stageName: 'مقترح صرف',
          completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          userName: platformStore.getCurrentUser().name,
          notes: 'تم تقديم مقترح الصرف من خلال النظام تمهيداً للمراجعة الداخلية والشرعية',
        },
      ],
    };

    waqf.disbursements = [newDisb, ...(waqf.disbursements || [])];
    platformStore.saveWaqfRecord(waqf);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-4 text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-base text-[#0e382c]">تقديم مقترح صرف وقفي جديد</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">عنوان المعاملة / الغرض الرئيسي:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منحة كفالة أسر أيتام شهر ربيع الثاني..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">المبلغ المقترح:</label>
              <input
                type="number"
                required
                min="1"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">التصنيف:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="كفالة أيتام">كفالة أيتام</option>
                <option value="دعم أسر">دعم أسر</option>
                <option value="منح تعليمية">منح تعليمية</option>
                <option value="صيانة أصل">صيانة أصل</option>
                <option value="مصروفات تشغيلية">مصروفات تشغيلية</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">الجهة أو المستفيد المستحق:</label>
            <input
              type="text"
              required
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="اسم المستفيد أو الجمعية أو المورد..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">مبررات الصرف ومطابقة شرط الواقف:</label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="شرح الاستحقاق وتطابقه مع مصارف الوقف المعتمدة..."
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
              إرسال المقترح للمراجعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
