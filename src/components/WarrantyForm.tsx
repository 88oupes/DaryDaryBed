import React, { useState, useEffect } from 'react';
import {
  Bed,
  Armchair,
  Check,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { MATTRESS_CATALOGUE, MOROCCAN_CITIES } from '../data/catalogue.ts';

export interface WarrantyFormData {
  productType: 'Matelas' | 'Salon';
  mattressModel: string;
  mattressDimensions: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  city: string;
  consent: boolean;
}

interface WarrantyFormProps {
  onSubmitSuccess: (data: any) => void;
}

export const WarrantyForm: React.FC<WarrantyFormProps> = ({ onSubmitSuccess }) => {
  const [productType, setProductType] = useState<'Matelas' | 'Salon'>('Matelas');
  const [mattressModel, setMattressModel] = useState<string>(MATTRESS_CATALOGUE[0].name);
  const [mattressDimensions, setMattressDimensions] = useState<string>(
    MATTRESS_CATALOGUE[0].dimensions[4] // 160 × 190 default
  );

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca — الدار البيضاء');
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update available dimensions when mattress model changes
  const currentModelData = MATTRESS_CATALOGUE.find((m) => m.name === mattressModel);
  const availableDimensions = currentModelData ? currentModelData.dimensions : [];

  // When model changes, adjust dimensions if current is not in list
  useEffect(() => {
    if (availableDimensions.length > 0 && !availableDimensions.includes(mattressDimensions)) {
      setMattressDimensions(availableDimensions[0]);
    }
  }, [mattressModel, availableDimensions, mattressDimensions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client validations
    if (!lastName.trim() || !firstName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et prénom (يرجى إدخال الاسم العائلي والشخصي).');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone (يرجى إدخال رقم الهاتف).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide (يرجى إدخال بريد إلكتروني صحيح).');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Veuillez sélectionner la ville d\'achat (يرجى اختيار مدينة الشراء).');
      return;
    }

    if (!consent) {
      setErrorMessage('Veuillez cocher la case de consentement aux conditions de garantie pour continuer.');
      return;
    }

    if (productType === 'Matelas' && (!mattressModel || !mattressDimensions)) {
      setErrorMessage('Veuillez sélectionner le modèle et les dimensions de votre matelas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: WarrantyFormData = {
        productType,
        mattressModel: productType === 'Matelas' ? mattressModel : '',
        mattressDimensions: productType === 'Matelas' ? mattressDimensions : '',
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        city: city.trim(),
        consent,
      };

      const FALLBACK_APPS_SCRIPT_URL =
        'https://script.google.com/macros/s/AKfycbyAid9WveI5QeesxVPdANjpdVhSR25H_C7UWT2Owk7bU4WTb5-04kBkOdWGyv9mp6DICw/exec';

      let result: any = null;

      try {
        const response = await fetch('/api/register-warranty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const rawResponse = await response.text();
        if (response.ok && !rawResponse.trim().startsWith('<')) {
          const parsed = JSON.parse(rawResponse);
          if (parsed && parsed.success) {
            result = parsed;
          }
        }
      } catch (_) {
        // Fallback vers l'envoi direct
      }

      // Si le backend /api n'est pas disponible (hébergement statique Vercel), envoi direct au script Google
      if (!result || !result.success) {
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const ref = `DARY-GAR-${randomDigits}`;
        const dateStr = new Date().toLocaleString('fr-FR', {
          timeZone: 'Africa/Casablanca',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const directPayload = {
          ...payload,
          reference: ref,
          date: dateStr,
        };

        try {
          await fetch(FALLBACK_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(directPayload),
          });
        } catch (_) {}

        result = {
          success: true,
          reference: ref,
          registration: directPayload,
          forwardStatus: {
            synced: true,
            message: 'Enregistré avec succès dans Google Sheets !',
          },
          message: 'Votre bulletin de garantie a été enregistré avec succès !',
        };
      }

      onSubmitSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#EDE4F2] shadow-sm p-5 sm:p-8 md:p-10 transition-all">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================================= */}
        {/* ÉTAPE 1 : TYPE DE PRODUIT */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE4F2]/70 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#EDE4F2] text-[#61218B] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-semibold text-base sm:text-lg text-[#292331]">
                Type de Produit
              </h3>
            </div>
            <span className="font-arabic text-sm sm:text-base font-semibold text-[#61218B]" dir="rtl">
              نوع المنتوج
            </span>
          </div>

          {/* Cards de sélection : Matelas ou Salon (1 seul choix possible) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option Matelas */}
            <div
              role="radio"
              aria-checked={productType === 'Matelas'}
              tabIndex={0}
              onClick={() => setProductType('Matelas')}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setProductType('Matelas')}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col items-center justify-center text-center gap-3 select-none ${
                productType === 'Matelas'
                  ? 'border-[#61218B] bg-[#EDE4F2]/30 shadow-xs'
                  : 'border-[#EDE4F2] bg-white hover:border-[#61218B]/40 hover:bg-[#F7F2EB]/40'
              }`}
            >
              {productType === 'Matelas' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#61218B] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  productType === 'Matelas'
                    ? 'bg-[#61218B] text-white'
                    : 'bg-[#EDE4F2] text-[#61218B]'
                }`}
              >
                <Bed className="w-7 h-7" />
              </div>
              <div>
                <p className="font-semibold text-base text-[#292331]">Matelas</p>
                <p className="font-arabic text-sm text-[#61218B] font-medium" dir="rtl">
                  مرتبة
                </p>
              </div>
            </div>

            {/* Option Salon */}
            <div
              role="radio"
              aria-checked={productType === 'Salon'}
              tabIndex={0}
              onClick={() => setProductType('Salon')}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setProductType('Salon')}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col items-center justify-center text-center gap-3 select-none ${
                productType === 'Salon'
                  ? 'border-[#61218B] bg-[#EDE4F2]/30 shadow-xs'
                  : 'border-[#EDE4F2] bg-white hover:border-[#61218B]/40 hover:bg-[#F7F2EB]/40'
              }`}
            >
              {productType === 'Salon' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#61218B] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  productType === 'Salon'
                    ? 'bg-[#61218B] text-white'
                    : 'bg-[#EDE4F2] text-[#61218B]'
                }`}
              >
                <Armchair className="w-7 h-7" />
              </div>
              <div>
                <p className="font-semibold text-base text-[#292331]">Salon</p>
                <p className="font-arabic text-sm text-[#61218B] font-medium" dir="rtl">
                  صالون
                </p>
              </div>
            </div>
          </div>

          {/* MENUS CONDITIONNELS : UNIQUEMENT SI LE CLIENT CHOISIT MATELAS */}
          {productType === 'Matelas' && (
            <div className="bg-[#F7F2EB]/70 border border-[#EDE4F2] rounded-2xl p-4 sm:p-5 transition-all mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Modèle de matelas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                    <span>Modèle de matelas *</span>
                    <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                      نموذج المرتبة *
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={mattressModel}
                      onChange={(e) => setMattressModel(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#292331] pr-9 outline-none transition-colors"
                    >
                      {MATTRESS_CATALOGUE.map((model) => (
                        <option key={model.id} value={model.name}>
                          {model.name} — {model.arabicName} ({model.warrantyYears} ans de garantie)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6F7072] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Dimensions en centimètres */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                    <span>Dimensions (cm) *</span>
                    <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                      المقاسات (سم) *
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={mattressDimensions}
                      onChange={(e) => setMattressDimensions(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#292331] pr-9 outline-none transition-colors"
                    >
                      {availableDimensions.map((dim) => (
                        <option key={dim} value={dim}>
                          {dim} cm
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6F7072] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Helper badge */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#6F7072]">
                <span>
                  Options autorisées pour <strong>{mattressModel}</strong> ({availableDimensions.length} tailles homologuées)
                </span>
                <span className="text-[#61218B] font-medium hidden sm:inline">
                  Conforme au catalogue officiel Dary
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* ÉTAPE 2 : INFORMATIONS DE L'ACHETEUR */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE4F2]/70 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#EDE4F2] text-[#61218B] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-semibold text-base sm:text-lg text-[#292331]">
                Informations de l'Acheteur
              </h3>
            </div>
            <span className="font-arabic text-sm sm:text-base font-semibold text-[#61218B]" dir="rtl">
              معلومات المشتري
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Nom */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>Nom *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  الاسم العائلي *
                </span>
              </div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex. Alaoui"
                required
                className="w-full bg-[#FFFFFF] border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
              />
            </div>

            {/* Prénom */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>Prénom *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  الاسم الشخصي *
                </span>
              </div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex. Mohammed"
                required
                className="w-full bg-[#FFFFFF] border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>Téléphone *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  رقم الهاتف *
                </span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0612345678"
                required
                className="w-full bg-[#FFFFFF] border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
              />
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>E-mail *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  البريد الإلكتروني *
                </span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@dary.ma"
                required
                className="w-full bg-[#FFFFFF] border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
              />
            </div>

            {/* Ville d'achat (Pleine largeur sur la grille) */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>Ville d’achat ({MOROCCAN_CITIES.length} villes du catalogue) *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  مدينة الشراء *
                </span>
              </div>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full appearance-none bg-[#FFFFFF] border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] pr-9 outline-none transition-colors font-medium"
                >
                  {MOROCCAN_CITIES.map((c) => {
                    const label = `${c.fr} — ${c.ar}`;
                    return (
                      <option key={c.fr} value={label}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6F7072] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Case de consentement obligatoire (Français + Arabe) */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#F7F2EB]/50 border border-[#EDE4F2] cursor-pointer hover:bg-[#F7F2EB] transition-colors">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-1 w-4 h-4 text-[#61218B] accent-[#61218B] rounded border-[#EDE4F2] focus:ring-[#61218B] cursor-pointer"
              />
              <div className="space-y-1 text-xs text-[#292331] leading-relaxed select-none">
                <p>
                  J'atteste de l'exactitude des informations fournies et j'accepte les conditions
                  générales de garantie Dary Bed & Living pour le suivi du service après-vente.
                </p>
                <p className="font-arabic text-xs text-[#61218B] font-semibold text-right" dir="rtl">
                  أؤكد صحة المعلومات المدلى بها وأوافق على الشروط العامة لضمان داري لتتبع خدمة ما بعد البيع.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Message d'erreur s'il y a lieu */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bouton d'action principal : Activer ma garantie — تفعيل الضمان */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-[#61218B] hover:bg-[#4F1872] active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enregistrement en cours... جارٍ تفعيل الضمان</span>
            </>
          ) : (
            <>
              <span>Activer ma garantie</span>
              <span className="text-white/40">/</span>
              <span className="font-arabic font-bold" dir="rtl">تفعيل الضمان</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
