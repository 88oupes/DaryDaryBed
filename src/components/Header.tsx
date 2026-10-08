import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const OFFICIAL_DARY_LOGO_URL = 'https://res.cloudinary.com/psbqhe7h/image/upload/v1791452763/Daryy_beed.png';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EDE4F2] sticky top-0 z-30 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center">
          <img
            src={OFFICIAL_DARY_LOGO_URL}
            alt="Dary Bed & Living"
            className="h-10 sm:h-11 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Official Warranty Badge (faithful to the official screenshot) */}
        <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#EDE4F2] border border-[#61218B]/20 text-[#61218B] text-xs font-medium tracking-tight shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#61218B] shrink-0" />
          <span className="font-semibold">Garantie Officielle</span>
          <span className="text-[#61218B]/40">|</span>
          <span className="font-arabic text-xs font-bold" dir="rtl">ضمان رسمي</span>
        </div>
      </div>
    </header>
  );
};

