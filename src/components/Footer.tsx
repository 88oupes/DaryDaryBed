import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { OFFICIAL_DARY_LOGO_URL } from './Header.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-[#EDE4F2] bg-white py-12 text-xs text-[#6F7072]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <img
              src={OFFICIAL_DARY_LOGO_URL}
              alt="Dary Bed"
              className="h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs text-[#6F7072] max-w-sm">
              Dary Bed. Fabricant d'excellence de literie haut de gamme et salons contemporains au Maroc.
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-[#292331]">
            <p className="font-semibold text-[#61218B]">Service Client & Garantie</p>
            <div className="flex items-center gap-2 text-[#6F7072]">
              <Phone className="w-3.5 h-3.5 text-[#61218B]" />
              <a href="tel:+212666974652" className="hover:text-[#61218B] transition-colors">
                Support SAV : +212666974652
              </a>
            </div>
            <div className="flex items-center gap-2 text-[#6F7072]">
              <Mail className="w-3.5 h-3.5 text-[#61218B]" />
              <a href="mailto:contact@dary.ma" className="hover:text-[#61218B] transition-colors">
                contact@dary.ma
              </a>
            </div>
            <div className="flex items-center gap-2 text-[#6F7072]">
              <Globe className="w-3.5 h-3.5 text-[#61218B]" />
              <a
                href="https://www.darybed.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#61218B] transition-colors font-medium"
              >
                www.darybed.ma
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EDE4F2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Dary Bed. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
