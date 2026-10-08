import React from 'react';
import {
  CheckCircle2,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  FileCheck2,
} from 'lucide-react';
import { OFFICIAL_DARY_LOGO_URL } from './Header.tsx';

interface CertificateModalProps {
  data: any;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const reg = data.registration || {};
  const isMattress = reg.productType === 'Matelas';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EDE4F2] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#34134F] to-[#61218B] px-6 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#EDE4F2] font-semibold">
                Certificat Officiel Dary Bed & Living
              </p>
              <h3 className="text-lg font-bold text-white">Garantie Constructeur Activée</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6" id="printable-certificate">
          {/* Brand header */}
          <div className="flex items-center justify-between border-b border-[#EDE4F2] pb-4">
            <img
              src={OFFICIAL_DARY_LOGO_URL}
              alt="Dary Bed & Living"
              className="h-8 sm:h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="text-right">
              <span className="text-[11px] text-[#6F7072] uppercase font-bold tracking-wider block">
                N° Référence Garantie
              </span>
              <span className="text-base font-mono font-bold text-[#61218B] bg-[#EDE4F2]/50 px-2.5 py-0.5 rounded-md border border-[#61218B]/20">
                {reg.reference || data.reference}
              </span>
            </div>
          </div>

          {/* Success Banner */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-0.5">
              <p className="font-semibold text-sm">
                Félicitations, votre garantie a bien été validée !
              </p>
              <p className="font-arabic text-emerald-700" dir="rtl">
                تهانينا، تم تسجيل وتفعيل بطاقة الضمان الخاصة بكم بنجاح لدى داري.
              </p>
            </div>
          </div>

          {/* Product & Warranty Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F2EB] border border-[#EDE4F2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#6F7072] font-medium">
                <Package className="w-3.5 h-3.5 text-[#61218B]" />
                <span>Produit Enregistré</span>
              </div>
              <p className="text-sm font-bold text-[#292331]">
                {reg.productType}
                {reg.mattressModel && ` — ${reg.mattressModel}`}
              </p>
              {reg.mattressDimensions && (
                <p className="text-[#61218B] font-medium">
                  Dimensions : {reg.mattressDimensions}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F2EB] border border-[#EDE4F2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#6F7072] font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#61218B]" />
                <span>Date d'Activation</span>
              </div>
              <p className="text-sm font-bold text-[#292331]">{reg.date || 'Aujourd\'hui'}</p>
              <p className="text-emerald-700 font-semibold flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Statut : Active & Valide</span>
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-4 rounded-2xl border border-[#EDE4F2] bg-white space-y-2 text-xs">
            <p className="font-bold text-[#61218B] uppercase tracking-wider text-[11px]">
              Titulaire de la Garantie
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#292331]">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#6F7072]" />
                <span className="font-medium">
                  {reg.firstName} {reg.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#6F7072]" />
                <span>{reg.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#6F7072]" />
                <span className="truncate">{reg.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#6F7072]" />
                <span className="truncate">{reg.city}</span>
              </div>
            </div>
          </div>

          {/* Official Registry Status */}
          <div className="text-[11px] text-[#292331] bg-[#EDE4F2]/40 p-3 rounded-xl border border-[#EDE4F2] flex items-center justify-between">
            <span className="text-[#6F7072]">Enregistrement officiel :</span>
            <span className="font-semibold text-[#61218B] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Enregistré et certifié auprès du réseau Dary Maroc</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F7F2EB] border-t border-[#EDE4F2] flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-[#EDE4F2] text-[#292331] hover:bg-[#EDE4F2]/50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#61218B]" />
            <span>Imprimer l'attestation</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#61218B] hover:bg-[#4F1872] text-white transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
