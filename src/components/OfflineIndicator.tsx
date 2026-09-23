import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside
      aria-label="حالة الاتصال"
      className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-xl bg-[#0e382c] border border-[#c5a059] px-3.5 py-2 text-xs font-medium text-[#fbf9f4] shadow-lg animate-in fade-in slide-in-from-bottom-2"
    >
      <WifiOff className="w-4 h-4 text-[#c5a059]" />
      <span>وضع عدم الاتصال — الحاسبة والكتاب يعملان محلياً بكفاءة</span>
    </aside>
  );
};
