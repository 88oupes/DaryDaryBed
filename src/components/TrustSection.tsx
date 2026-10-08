import React from 'react';
import { Truck, Headphones, Award } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sérénité */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE4F2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Garantie Constructeur Certifiée
          </h4>
        </div>

        {/* Card 2: Confiance */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE4F2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Réseau SAV Partout au Maroc
          </h4>
        </div>

        {/* Card 3: Signature */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE4F2] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Assistance & Suivi Personnalisé
          </h4>
        </div>
      </div>
    </section>
  );
};
