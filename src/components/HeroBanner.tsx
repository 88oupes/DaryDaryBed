import React from 'react';
import { Shield } from 'lucide-react';

interface HeroBannerProps {
  imageSrc?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  imageSrc = '/src/assets/images/hero_bedroom_dary_1791450774133.jpg',
}) => {
  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#EDE4F2]/30 text-white my-6">
      {/* Background Image with Deep Violet Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt="Chambre confortable Dary Bed"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS gradient fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Purple Tint Scrim matching #34134F & #61218B */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#34134F]/95 via-[#34134F]/85 to-[#61218B]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292331] via-transparent to-black/25" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-2xl">
        {/* Official Activation Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-4">
          <Shield className="w-3.5 h-3.5 text-[#EDE4F2]" />
          <span>Portail d'activation officiel Dary</span>
        </div>

        {/* Main Title (French) */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
          Enregistrement et activation de garantie
        </h1>

        {/* Title (Arabic) */}
        <h2
          className="font-arabic text-xl sm:text-2xl font-bold text-[#EDE4F2] mb-4 text-right sm:text-left leading-normal"
          dir="rtl"
        >
          تسجيل وتفعيل بطاقة الضمان
        </h2>

        {/* Reassuring Text */}
        <p className="text-sm sm:text-base text-[#EDE4F2]/90 leading-relaxed max-w-xl font-normal">
          Activez votre garantie constructeur pour vos matelas et salons Dary afin de
          bénéficier de notre service après-vente.
        </p>
      </div>
    </div>
  );
};
