import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Info,
  Calendar,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { SystemAlert } from '../../types/platform';
import { platformStore } from '../../data/platformStore';

interface AlertsHubProps {
  onNavigateToTab?: (tab: string, payload?: any) => void;
}

export const AlertsHub: React.FC<AlertsHubProps> = ({ onNavigateToTab }) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => platformStore.getAlerts());

  const handleMarkAsRead = (id: string) => {
    platformStore.markAlertRead(id);
    setAlerts(platformStore.getAlerts());
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09261e] to-[#0e382c] rounded-3xl p-6 sm:p-8 text-[#fbf9f4] border border-[#c5a059]/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f3e5ab] text-xs font-semibold">
            <Bell className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>مركز التنبيهات والإشعارات التشغيلية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#fdfbf7]">
            التنبيهات ومواعيد الاستحقاق
          </h1>
          <p className="text-xs sm:text-sm text-[#e8e4da]/90 max-w-2xl leading-relaxed">
            متابعة حية لتنبيهات انتهاء عقود الأوقاف، طلبات المراجعة الشرعية المعلقة للتركات، ومطالبات الصرف والمهام ذات الأولوية القصوى.
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alt) => {
          const typeStyles = {
            urgent: 'border-red-300 bg-red-50/70 text-red-900',
            warning: 'border-amber-300 bg-amber-50/70 text-amber-900',
            info: 'border-blue-300 bg-blue-50/70 text-blue-900',
            success: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
          }[alt.type];

          const typeIcon = {
            urgent: <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          }[alt.type];

          return (
            <div
              key={alt.id}
              className={`p-5 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${typeStyles} ${
                alt.isRead ? 'opacity-60 bg-gray-50 border-gray-200 text-gray-700' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {typeIcon}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{alt.title}</h3>
                    {!alt.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        جديد
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{alt.message}</p>
                  <span className="text-[11px] opacity-70 block font-mono">{alt.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!alt.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alt.id)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold hover:bg-gray-100 flex items-center gap-1 shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تحديد كمقروء</span>
                  </button>
                )}
                {alt.linkTab && onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab(alt.linkTab!, alt.linkPayload)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0e382c] text-[#f3e5ab] text-xs font-bold hover:bg-[#124838] flex items-center gap-1 transition"
                  >
                    <span>الانتقال للملف</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
