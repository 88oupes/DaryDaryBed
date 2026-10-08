import React, { useState } from 'react';
import {
  X,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Bed,
  Armchair,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { WarrantyRegistration } from '../../server.ts';

interface RegistrationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: WarrantyRegistration[];
  onSelectRegistration: (reg: WarrantyRegistration) => void;
}

export const RegistrationsDrawer: React.FC<RegistrationsDrawerProps> = ({
  isOpen,
  onClose,
  registrations,
  onSelectRegistration,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = registrations.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.reference.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.firstName.toLowerCase().includes(q) ||
      r.phoneNumber.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.productType.toLowerCase().includes(q) ||
      r.mattressModel.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = [
      'Date',
      'Référence',
      'Nom',
      'Prénom',
      'Téléphone',
      'E-mail',
      'Ville',
      'Produit',
      'Modèle',
      'Dimensions',
      'Consentement',
      'Sync Google Sheets',
    ];

    const rows = registrations.map((r) => [
      `"${r.date}"`,
      `"${r.reference}"`,
      `"${r.lastName}"`,
      `"${r.firstName}"`,
      `"${r.phoneNumber}"`,
      `"${r.email}"`,
      `"${r.city.replace(/"/g, '""')}"`,
      `"${r.productType}"`,
      `"${r.mattressModel || ''}"`,
      `"${r.mattressDimensions || ''}"`,
      `"${r.consent ? 'Oui' : 'Non'}"`,
      `"${r.syncedToGoogleSheets ? 'Oui' : 'En attente'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dary_garanties_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#EDE4F2] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#292331] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Registre des Bulletins de Garantie Dary</span>
              <span className="bg-[#61218B] text-white text-xs px-2 py-0.5 rounded-full font-mono">
                {registrations.length}
              </span>
            </h3>
            <p className="text-xs text-[#EDE4F2]/70 mt-0.5">
              Historique des garanties enregistrées localement et synchronisées
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={registrations.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search filter */}
        <div className="px-6 py-3 border-b border-[#EDE4F2] bg-[#F7F2EB]/50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6F7072] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par référence, client, téléphone, ville ou modèle..."
              className="w-full bg-white border border-[#EDE4F2] focus:border-[#61218B] rounded-xl pl-9 pr-4 py-2 text-xs text-[#292331] outline-none"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-y-auto flex-1 p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#6F7072] space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-[#6F7072]/50" />
              <p className="text-sm font-medium">Aucun bulletin de garantie trouvé</p>
              <p className="text-xs">
                {searchTerm
                  ? 'Essayez avec un autre mot-clé de recherche'
                  : 'Remplissez le formulaire de la landing page pour créer votre première garantie'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EDE4F2]">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectRegistration(item)}
                  className="py-4 hover:bg-[#F7F2EB]/60 rounded-xl px-3 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#61218B] bg-[#EDE4F2] px-2 py-0.5 rounded">
                        {item.reference}
                      </span>
                      <span className="text-xs font-semibold text-[#292331]">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="text-[11px] text-[#6F7072] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F7072]">
                      <span className="inline-flex items-center gap-1 text-[#292331] font-medium">
                        {item.productType === 'Matelas' ? (
                          <Bed className="w-3.5 h-3.5 text-[#61218B]" />
                        ) : (
                          <Armchair className="w-3.5 h-3.5 text-[#61218B]" />
                        )}
                        <span>{item.productType}</span>
                        {item.mattressModel && (
                          <span className="text-[#61218B]">({item.mattressModel} - {item.mattressDimensions} cm)</span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.city}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{item.phoneNumber}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.syncedToGoogleSheets ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Google Sheets OK</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Stocké localement</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F7F2EB] border-t border-[#EDE4F2] flex items-center justify-between shrink-0 text-xs text-[#6F7072]">
          <span>Cliquez sur une ligne pour afficher et réimprimer son certificat</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#EDE4F2] text-[#292331] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
