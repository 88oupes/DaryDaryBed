import React from 'react';
import { ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sérénité */}
        <div className="bg-white rounded-2xl p-6 border border-[#EDE4F2] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Garantie Constructeur Certifiée
          </h4>
          <p className="text-xs text-[#6F7072] leading-relaxed">
            Vos matelas Feelsoft, Consoft 33, YARA et salons bénéficient d'une couverture pièces et main d'œuvre de 5 à 10 ans selon le modèle.
          </p>
        </div>

        {/* Card 2: Confiance */}
        <div className="bg-white rounded-2xl p-6 border border-[#EDE4F2] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Réseau SAV Partout au Maroc
          </h4>
          <p className="text-xs text-[#6F7072] leading-relaxed">
            Un service après-vente réactif présent dans 52 villes du Royaume pour prendre soin de votre literie et de vos salons.
          </p>
        </div>

        {/* Card 3: Signature */}
        <div className="bg-white rounded-2xl p-6 border border-[#EDE4F2] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDE4F2] text-[#61218B] flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#292331]">
            Assistance & Suivi Personnalisé
          </h4>
          <p className="text-xs text-[#6F7072] leading-relaxed">
            Un numéro d'enregistrement unique généré instantanément pour faciliter vos démarches auprès de votre conseiller Dary.
          </p>
        </div>
      </div>
    </section>
  );
};
