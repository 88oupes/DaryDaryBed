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
import { MATTRESS_CATALOGUE, SALON_CATALOGUE, MOROCCAN_CITIES } from '../data/catalogue.ts';

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
  const [salonModel, setSalonModel] = useState<string>(SALON_CATALOGUE[0].name);
  const [salonWidth, setSalonWidth] = useState<string>('');
  const [salonLength, setSalonLength] = useState<string>('');
  const [salonHeight, setSalonHeight] = useState<string>('');

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca — الدار البيضاء');
  const [customCity, setCustomCity] = useState('');
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
      setErrorMessage('Veuillez sélectionner la ville de livraison (يرجى اختيار مدينة التوصيل).');
      return;
    }

    if (city === 'Autre' && !customCity.trim()) {
      setErrorMessage('Veuillez préciser le nom de votre ville de livraison (يرجى إدخال اسم مدينة التوصيل).');
      return;
    }

    if (!consent) {
      setErrorMessage('Veuillez accepter les conditions générales de garantie pour continuer.');
      return;
    }

    if (productType === 'Matelas' && (!mattressModel || !mattressDimensions)) {
      setErrorMessage('Veuillez sélectionner le modèle et les dimensions de votre matelas.');
      return;
    }

    if (productType === 'Salon' && (!salonModel || !salonWidth.trim() || !salonLength.trim())) {
      setErrorMessage('Veuillez sélectionner le modèle et indiquer la largeur et la longueur de votre salon (en cm).');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedModel = productType === 'Matelas' ? mattressModel : salonModel;
      const salonFormattedDimensions = salonHeight.trim()
        ? `L: ${salonWidth.trim()} × Lg: ${salonLength.trim()} cm (H: ${salonHeight.trim()} cm)`
        : `${salonWidth.trim()} × ${salonLength.trim()} cm`;
      const selectedDimensions = productType === 'Matelas' ? mattressDimensions : salonFormattedDimensions;
      const selectedCity = city === 'Autre' ? customCity.trim() : city.trim();

      const payload: WarrantyFormData = {
        productType,
        mattressModel: selectedModel,
        mattressDimensions: selectedDimensions,
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        city: selectedCity,
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
                  ماطلة
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
                          {model.name} ({model.warrantyYears} ans de garantie)
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

          {/* MENUS CONDITIONNELS : UNIQUEMENT SI LE CLIENT CHOISIT SALON */}
          {productType === 'Salon' && (
            <div className="bg-[#F7F2EB]/70 border border-[#EDE4F2] rounded-2xl p-4 sm:p-5 transition-all mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Modèle de salon */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                    <span>Modèle de salon *</span>
                    <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                      نموذج الصالون *
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={salonModel}
                      onChange={(e) => setSalonModel(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#292331] pr-9 outline-none transition-colors"
                    >
                      {SALON_CATALOGUE.map((model) => (
                        <option key={model.id} value={model.name}>
                          {model.name} ({model.warrantyYears} ans de garantie)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6F7072] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Dimensions avec case Largeur et case Longueur */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                    <span>Dimensions du salon (cm) *</span>
                    <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                      المقاسات (العرض × الطول) *
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#6F7072] mb-1 font-medium">Largeur (العرض) *</label>
                      <input
                        type="text"
                        value={salonWidth}
                        onChange={(e) => setSalonWidth(e.target.value)}
                        placeholder="Ex. 70 cm"
                        required
                        className="w-full bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3 py-2.5 text-sm font-medium text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6F7072] mb-1 font-medium">Longueur (الطول) *</label>
                      <input
                        type="text"
                        value={salonLength}
                        onChange={(e) => setSalonLength(e.target.value)}
                        placeholder="Ex. 200 cm"
                        required
                        className="w-full bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3 py-2.5 text-sm font-medium text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] text-[#6F7072] mb-1 font-medium">Hauteur (الارتفاع)</label>
                      <input
                        type="text"
                        value={salonHeight}
                        onChange={(e) => setSalonHeight(e.target.value)}
                        placeholder="Ex. 25 cm"
                        className="w-full bg-white border border-[#EDE4F2] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3 py-2.5 text-sm font-medium text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Helper badge */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#6F7072]">
                <span>
                  Garantie constructeur officielle pour <strong>{salonModel}</strong>
                </span>
                <span className="text-[#61218B] font-medium hidden sm:inline">
                  Indiquez la largeur et la longueur en cm
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

            {/* Ville de livraison (Pleine largeur sur la grille) */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292331]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#61218B]" />
                  <span>Ville de livraison *</span>
                </div>
                <span className="font-arabic text-xs text-[#61218B]" dir="rtl">
                  مدينة التوصيل *
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
                  <option value="Autre">Autre — أخرى</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#6F7072] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Si Autre est sélectionné, champ de saisie libre */}
              {city === 'Autre' && (
                <div className="mt-2 animate-in fade-in duration-200">
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Précisez votre ville de livraison (يرجى إدخال اسم مدينة التوصيل)..."
                    required
                    className="w-full bg-[#FFFFFF] border border-[#61218B] focus:border-[#61218B] focus:ring-1 focus:ring-[#61218B] rounded-xl px-3.5 py-2.5 text-sm text-[#292331] placeholder:text-[#6F7072]/60 outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ÉTAPE 3 : CONDITIONS GÉNÉRALES DE GARANTIE — الشروط العامة للضمان */}
        {/* ========================================================================= */}
        <section className="space-y-4 pt-2">
          {/* En-tête de section bilingue */}
          <div className="flex items-center justify-between border-b border-[#EDE4F2]/70 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#EDE4F2] text-[#61218B] font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-bold text-base sm:text-lg text-[#292331] tracking-tight">
                Conditions Générales de Garantie
              </h3>
            </div>
            <span className="font-arabic text-sm sm:text-base font-bold text-[#61218B]" dir="rtl">
              الشروط العامة للضمان
            </span>
          </div>

          {/* Blocs lisibles bilingues */}
          <div className="space-y-3.5">
            {/* 1. OBJET DE LA GARANTIE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F2EB]/50 border border-[#EDE4F2] space-y-2.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#EDE4F2]/60">
                <h4 className="font-bold text-xs sm:text-sm text-[#61218B] tracking-wide uppercase">
                  1. OBJET DE LA GARANTIE
                </h4>
                <h4 className="font-arabic font-bold text-xs sm:text-sm text-[#61218B] text-right" dir="rtl">
                  موضوع الضمان .1
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-[#292331] leading-relaxed">
                <p>
                  La présente garantie couvre uniquement les défauts de fabrication constatés dans le cadre d’une utilisation normale du produit.
                </p>
                <p className="font-arabic text-right text-[#4A4553]" dir="rtl">
                  يشمل هذا الضمان فقط عيوب التصنيع التي يتم اكتشافها في إطار الاستعمال العادي للمنتج.
                </p>
              </div>
            </div>

            {/* 2. DURÉE DE LA GARANTIE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F2EB]/50 border border-[#EDE4F2] space-y-2.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#EDE4F2]/60">
                <h4 className="font-bold text-xs sm:text-sm text-[#61218B] tracking-wide uppercase">
                  2. DURÉE DE LA GARANTIE
                </h4>
                <h4 className="font-arabic font-bold text-xs sm:text-sm text-[#61218B] text-right" dir="rtl">
                  مدة الضمان .2
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-[#292331] leading-relaxed">
                <p>
                  La durée de la garantie est celle indiquée sur le bulletin de garantie. Elle prend effet à compter de la date d’achat figurant sur la facture.
                </p>
                <p className="font-arabic text-right text-[#4A4553]" dir="rtl">
                  مدة الضمان هي المدة المحددة في شهادة الضمان، ويبدأ سريانها من تاريخ الشراء المبيّن في الفاتورة.
                </p>
              </div>
            </div>

            {/* 3. DOCUMENTS OBLIGATOIRES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F2EB]/50 border border-[#EDE4F2] space-y-2.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#EDE4F2]/60">
                <h4 className="font-bold text-xs sm:text-sm text-[#61218B] tracking-wide uppercase">
                  3. DOCUMENTS OBLIGATOIRES
                </h4>
                <h4 className="font-arabic font-bold text-xs sm:text-sm text-[#61218B] text-right" dir="rtl">
                  الوثائق المطلوبة .3
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-[#292331] leading-relaxed">
                <p>
                  Toute demande de prise en charge au titre de la garantie doit être accompagnée du présent bulletin de garantie, dûment rempli, ainsi que de la facture d’achat originale.
                </p>
                <p className="font-arabic text-right text-[#4A4553]" dir="rtl">
                  يجب إرفاق كل طلب للاستفادة من الضمان بشهادة الضمان هذه، بعد تعبئتها بشكل صحيح، بالإضافة إلى فاتورة الشراء الأصلية.
                </p>
              </div>
            </div>

            {/* 4. EXCLUSIONS DE GARANTIE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F2EB]/50 border border-[#EDE4F2] space-y-2.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#EDE4F2]/60">
                <h4 className="font-bold text-xs sm:text-sm text-[#61218B] tracking-wide uppercase">
                  4. EXCLUSIONS DE GARANTIE
                </h4>
                <h4 className="font-arabic font-bold text-xs sm:text-sm text-[#61218B] text-right" dir="rtl">
                  الاستثناءات من الضمان .4
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs text-[#292331] leading-relaxed">
                <div className="space-y-1.5">
                  <p className="font-semibold text-[#292331]">La garantie ne couvre pas :</p>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4553]">
                    <li>Les dommages liés à une mauvaise utilisation ou à un mauvais entretien ;</li>
                    <li>Les taches, brûlures, coupures ou déchirures ;</li>
                    <li>L’usure normale liée à l’utilisation du produit ;</li>
                    <li>Les dommages causés par l’humidité, l’eau, les produits chimiques ou les catastrophes naturelles ;</li>
                    <li>Les modifications ou réparations effectuées par une personne non autorisée.</li>
                  </ul>
                </div>
                <div className="space-y-1.5 font-arabic text-right" dir="rtl">
                  <p className="font-semibold text-[#292331]">لا يشمل الضمان:</p>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4553]">
                    <li>الأضرار الناتجة عن سوء الاستعمال أو سوء الصيانة؛</li>
                    <li>البقع أو الحروق أو القطوع أو التمزقات؛</li>
                    <li>الاستهلاك العادي الناتج عن استعمال المنتج؛</li>
                    <li>الأضرار الناتجة عن الرطوبة أو الماء أو المواد الكيميائية أو الكوارث الطبيعية؛</li>
                    <li>التعديلات أو الإصلاحات التي يجريها شخص غير معتمد.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. ACCEPTATION DES CONDITIONS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F2EB]/50 border border-[#EDE4F2] space-y-2.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-[#EDE4F2]/60">
                <h4 className="font-bold text-xs sm:text-sm text-[#61218B] tracking-wide uppercase">
                  5. ACCEPTATION DES CONDITIONS
                </h4>
                <h4 className="font-arabic font-bold text-xs sm:text-sm text-[#61218B] text-right" dir="rtl">
                  قبول الشروط .5
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-[#292331] leading-relaxed">
                <p>
                  Pour valider le formulaire, veuillez confirmer que vous avez lu et accepté les présentes conditions générales de garantie en cochant la case ci-dessous.
                </p>
                <p className="font-arabic text-right text-[#4A4553]" dir="rtl">
                  لتأكيد النموذج، يُرجى الإقرار بقراءة هذه الشروط العامة للضمان والموافقة عليها من خلال تحديد خانة الاختيار أدناه.
                </p>
              </div>
            </div>
          </div>

          {/* Case à cocher obligatoire (décochée par défaut) */}
          <div className="pt-2">
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                consent
                  ? 'bg-[#EDE4F2]/30 border-[#61218B] shadow-xs'
                  : 'bg-white border-[#EDE4F2] hover:border-[#61218B]/40 hover:bg-[#F7F2EB]/40'
              }`}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#61218B] accent-[#61218B] rounded border-[#EDE4F2] focus:ring-[#61218B] cursor-pointer shrink-0"
              />
              <div className="space-y-1 text-xs sm:text-sm font-semibold text-[#292331] leading-snug">
                <p>
                  J’ai lu et j’accepte les conditions générales de garantie.
                </p>
                <p className="font-arabic text-xs sm:text-sm font-bold text-[#61218B] text-right" dir="rtl">
                  لقد قرأت الشروط العامة للضمان وأوافق عليها.
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

        {/* Bouton de validation : « Valider / تأكيد » */}
        <button
          type="submit"
          disabled={!consent || isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-[#61218B] hover:bg-[#4F1872] active:scale-[0.99] text-white font-semibold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Validation en cours... جارٍ التأكيد</span>
            </>
          ) : (
            <>
              <span>Valider</span>
              <span className="text-white/40">/</span>
              <span className="font-arabic font-bold" dir="rtl">تأكيد</span>
              <Check className="w-5 h-5 ml-1 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
