import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Key,
  Database,
  RotateCcw,
  CheckCircle2,
  Lock,
  UserCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SYSTEM_ROLES, platformStore } from '../../data/platformStore';
import { UserRole } from '../../types/platform';

export const SettingsHub: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(() => platformStore.getCurrentUser());
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSwitchRole = (role: UserRole) => {
    const updated = platformStore.switchRole(role);
    setCurrentUser(updated);
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط بيانات النظام إلى الإعدادات الأولية؟')) {
      platformStore.resetAllData();
      setCurrentUser(platformStore.getCurrentUser());
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const permissionsMatrix = [
    { feature: 'حساب وقسمة المواريث (الحاسبة)', trustee: true, auditor: true, data_entry: true, beneficiary: true, admin: true },
    { feature: 'إنشاء وتعديل ملفات التركات', trustee: true, auditor: true, data_entry: true, beneficiary: false, admin: true },
    { feature: 'المراجعة والاعتماد الشرعي للأنصبة', trustee: true, auditor: true, data_entry: false, beneficiary: false, admin: true },
    { feature: 'إدارة وتعديل أصول وعقود الأوقاف', trustee: true, auditor: false, data_entry: false, beneficiary: false, admin: true },
    { feature: 'تقديم مقترح صرف جديد', trustee: true, auditor: false, data_entry: true, beneficiary: false, admin: true },
    { feature: 'الاعتماد النهائي للصرف والتحويل', trustee: true, auditor: false, data_entry: false, beneficiary: false, admin: true },
    { feature: 'حذف المعاملات والملفات الحساسة', trustee: false, auditor: false, data_entry: false, beneficiary: false, admin: true },
    { feature: 'الاطلاع على التقارير المالية للوقف', trustee: true, auditor: true, data_entry: false, beneficiary: false, admin: true },
  ];

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
            <Settings className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>إدارة الحساب ومصفوفة الصلاحيات والحوكمة</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
            الصلاحيات والإعدادات
          </h1>
          <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
            التحكم في أدوار المستخدمين (ناظر، مراجع شرعي، مدخل بيانات، مستفيد، مدير نظام)، وضبط قيود الوصول وحماية العمليات الحساسة.
          </p>
        </div>
      </div>

      {/* Active Role Selector Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#c5a059]/30 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0e382c]">الدور الحالي النشط بالجلسة:</h3>
            <p className="text-xs text-gray-500">اختر دوراً لتجربة الصلاحيات وواجهات الاستخدام المخصصة له</p>
          </div>
          <span className="px-3 py-1 bg-[#0e382c] text-[#f3e5ab] text-xs font-bold rounded-xl self-start">
            {currentUser.roleTitle} ({currentUser.name})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_ROLES.map((r) => {
            const isSelected = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => handleSwitchRole(r.role)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-[#0e382c] bg-[#0e382c]/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-[#c5a059]/50 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0e382c]">{r.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0e382c]" />}
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">{r.name}</span>
                  <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{r.description}</p>
                </div>

                <button
                  type="button"
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#0e382c] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'الدور المفعّل حالياً' : 'التبديل لهذا الدور'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0e382c] border-b border-gray-100 pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#c5a059]" />
          <span>مصفوفة الصلاحيات والأدوار المعتمدة:</span>
        </h3>

        <div className="overflow-x-auto text-xs text-right">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <th className="p-3">الخدمة / الإجراء</th>
                <th className="p-3 text-center">ناظر الوقف</th>
                <th className="p-3 text-center">المراجع الشرعي</th>
                <th className="p-3 text-center">مدخل البيانات</th>
                <th className="p-3 text-center">المستفيد</th>
                <th className="p-3 text-center">مدير النظام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissionsMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-800">{row.feature}</td>
                  <td className="p-3 text-center">
                    {row.trustee ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.auditor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.data_entry ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.beneficiary ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engine Info & System Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-[#0e382c] border-b border-gray-100 pb-2">بيانات المحرك الحسابي والقواعد الشرعية</h4>
          <p className="text-gray-600 leading-relaxed">
            محرك الفرائض المعتمد: <strong>Farayed Rule Engine v2.4.0 (النسخة المنقحة)</strong>
          </p>
          <p className="text-gray-600">
            المرجعية الشرعية: <strong>مذهب جمهور الفقهاء الأربعة (الحنفية، المالكية، الشافعية، الحنابلة)</strong> مع اعتماد قواعد العول والرد وتصحيح الانكسارات والمسائل المشهورة.
          </p>
          <div className="pt-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
              الحساب قطعي رياضي ومطابق للإجماع الفقهي
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-red-700 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>منطقة الصيانة وإعادة التعيين</span>
          </h4>
          <p className="text-gray-600 leading-relaxed">
            يمكنك إعادة تعيين كافة البيانات المحلية واستعادة ملفات التركات والأوقاف التجريبية الأولية بنقرة واحدة.
          </p>

          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-800 font-bold rounded-xl border border-red-200 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة البيانات الافتراضية الأولية للنظام</span>
          </button>

          {resetSuccess && (
            <p className="text-emerald-700 font-bold">تمت إعادة تعيين البيانات بنجاح!</p>
          )}
        </div>
      </div>
    </div>
  );
};
