export interface MattressModel {
  id: string;
  name: string;
  arabicName: string;
  dimensions: string[];
  warrantyYears: number;
}

export const MATTRESS_CATALOGUE: MattressModel[] = [
  {
    id: 'feelsoft-hr-plus',
    name: 'Feel Soft HR+',
    arabicName: 'فيل سوفت إتش آر بلس',
    warrantyYears: 20,
    dimensions: [
      '90 × 190',
      '100 × 190',
      '120 × 190',
      '140 × 190',
      '160 × 190',
      '180 × 190',
      '90 × 200',
      '120 × 200',
      '140 × 200',
      '160 × 200',
      '180 × 200',
      '200 × 200',
    ],
  },
  {
    id: 'feelsoft-hr',
    name: 'Feelsoft Hr',
    arabicName: 'فيل سوفت إتش آر',
    warrantyYears: 17,
    dimensions: [
      '90 × 190',
      '100 × 190',
      '120 × 190',
      '140 × 190',
      '160 × 190',
      '180 × 190',
      '90 × 200',
      '120 × 200',
      '140 × 200',
      '160 × 200',
      '180 × 200',
      '200 × 200',
    ],
  },
  {
    id: 'feelsoft-confort',
    name: 'Feelsoft Confort',
    arabicName: 'فيل سوفت كونفور',
    warrantyYears: 17,
    dimensions: [
      '90 × 190',
      '100 × 190',
      '120 × 190',
      '140 × 190',
      '160 × 190',
      '180 × 190',
      '90 × 200',
      '120 × 200',
      '140 × 200',
      '160 × 200',
      '180 × 200',
      '200 × 200',
    ],
  },
  {
    id: 'consoft-33',
    name: 'Consoft 33',
    arabicName: 'كونسوفت 33',
    warrantyYears: 15,
    dimensions: [
      '90 × 190',
      '100 × 190',
      '120 × 190',
      '140 × 190',
      '160 × 190',
      '180 × 190',
      '90 × 200',
      '120 × 200',
      '140 × 200',
      '160 × 200',
      '200 × 200',
    ],
  },
  {
    id: 'yara',
    name: 'Yara',
    arabicName: 'يارا',
    warrantyYears: 10,
    dimensions: [
      '90 × 190',
      '100 × 190',
      '120 × 190',
      '140 × 190',
      '160 × 190',
      '180 × 190',
      '90 × 200',
      '120 × 200',
      '140 × 200',
      '160 × 200',
      '180 × 200',
      '200 × 200',
    ],
  },
  {
    id: 'rahb',
    name: 'Rahb',
    arabicName: 'رحب',
    warrantyYears: 6,
    dimensions: ['90 × 190', '140 × 190'],
  },
];

export interface SalonModel {
  id: string;
  name: string;
  arabicName: string;
  warrantyYears: number;
}

export const SALON_CATALOGUE: SalonModel[] = [
  {
    id: 'salon-medina-hr',
    name: 'Salon Medina HR',
    arabicName: 'صالون المدينة إتش آر',
    warrantyYears: 30,
  },
  {
    id: 'salon-rim-33',
    name: 'Salon RIM 33',
    arabicName: 'صالون ريم 33',
    warrantyYears: 25,
  },
  {
    id: 'salon-hala',
    name: 'Salon HALA',
    arabicName: 'صالون هالة',
    warrantyYears: 20,
  },
];

export interface MoroccanCity {
  fr: string;
  ar: string;
}

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { fr: 'Casablanca', ar: 'الدار البيضاء' },
  { fr: 'Rabat', ar: 'الرباط' },
  { fr: 'Fès', ar: 'فاس' },
  { fr: 'Tanger', ar: 'طنجة' },
  { fr: 'Marrakech', ar: 'مراكش' },
  { fr: 'Salé', ar: 'سلا' },
  { fr: 'Meknès', ar: 'مكناس' },
  { fr: 'Agadir', ar: 'أكادير' },
  { fr: 'Oujda', ar: 'وجدة' },
  { fr: 'Kénitra', ar: 'القنيطرة' },
  { fr: 'Tétouan', ar: 'تطوان' },
  { fr: 'Témara', ar: 'تمارة' },
  { fr: 'Safi', ar: 'آسفي' },
  { fr: 'Mohammédia', ar: 'المحمدية' },
  { fr: 'El Jadida', ar: 'الجديدة' },
  { fr: 'Béni Mellal', ar: 'بني ملال' },
  { fr: 'Nador', ar: 'الناظور' },
  { fr: 'Khouribga', ar: 'خريبكة' },
  { fr: 'Settat', ar: 'سطات' },
  { fr: 'Berkane', ar: 'بركان' },
  { fr: 'Taourirt', ar: 'تاوريرت' },
  { fr: 'Taza', ar: 'تازة' },
  { fr: 'Guelmim', ar: 'كلميم' },
  { fr: 'Khémisset', ar: 'الخميسات' },
  { fr: 'Berrechid', ar: 'برشيد' },
  { fr: 'Larache', ar: 'العرائش' },
  { fr: 'Ksar El Kebir', ar: 'القصر الكبير' },
  { fr: 'Al Hoceïma', ar: 'الحسيمة' },
  { fr: 'Errachidia', ar: 'الرشيدية' },
  { fr: 'Ouarzazate', ar: 'ورزازات' },
  { fr: 'Taroudant', ar: 'تارودانت' },
  { fr: 'Essaouira', ar: 'الصويرة' },
  { fr: 'Dakhla', ar: 'الداخلة' },
  { fr: 'Laâyoune', ar: 'العيون' },
  { fr: 'Tiznit', ar: 'تيزنيت' },
  { fr: 'Sidi Slimane', ar: 'سيدي سليمان' },
  { fr: 'Sidi Kacem', ar: 'سيدي قاسم' },
  { fr: 'Midelt', ar: 'ميدلت' },
  { fr: 'Fquih Ben Salah', ar: 'الفقيه بن صالح' },
  { fr: 'Youssoufia', ar: 'اليوسفية' },
  { fr: 'Tan-Tan', ar: 'طانطان' },
  { fr: 'Sefrou', ar: 'صفرو' },
  { fr: 'Azrou', ar: 'أزرو' },
  { fr: 'Ifrane', ar: 'إفران' },
  { fr: 'Oued Zem', ar: 'واد زم' },
  { fr: 'Chefchaouen', ar: 'شفشاون' },
  { fr: 'Martil', ar: 'مرتيل' },
  { fr: 'Fnideq', ar: 'الفنيدق' },
  { fr: 'M\'diq', ar: 'المضيق' },
  { fr: 'Asilah', ar: 'أصيلة' },
  { fr: 'Bouznika', ar: 'بوزنيقة' },
  { fr: 'Skhirat', ar: 'الصخيرات' },
];

export const GOOGLE_SHEETS_ID = '148zAkd_M-LR9NpQmq0rP4BEeMT9lGqx2qCwX4a2TKug';

export const APPS_SCRIPT_SOURCE_CODE = `/**
 * ====================================================================
 * SCRIPT GOOGLE APPS SCRIPT — DARY (BED & LIVING)
 * AUTOMATISATION DE L'ENREGISTREMENT DES BULLETINS DE GARANTIE
 * ====================================================================
 * 
 * Feuille de calcul liée :
 * ID : 148zAkd_M-LR9NpQmq0rP4BEeMT9lGqx2qCwX4a2TKug
 * Onglet : sheetId = 0 (détection automatique du nom réel de l'onglet)
 * 
 * Colonnes garanties :
 * Date | Référence | Nom | Prénom | Téléphone | E-mail | Ville | Produit | Modèle | Dimensions | Consentement
 */

function doPost(e) {
  // Verrouillage pour empêcher deux écritures simultanées d'écraser la même ligne
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var SPREADSHEET_ID = "${GOOGLE_SHEETS_ID}";
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Étape 1 : Récupérer l'onglet dont le sheetId est 0
    var targetSheet = null;
    var allSheets = ss.getSheets();
    for (var i = 0; i < allSheets.length; i++) {
      if (allSheets[i].getSheetId() === 0) {
        targetSheet = allSheets[i];
        break;
      }
    }
    // Si aucun onglet ne porte l'ID 0, on prend par sécurité le tout premier onglet
    if (!targetSheet) {
      targetSheet = allSheets[0];
    }

    var realSheetName = targetSheet.getName();

    // Étape 2 : Définition des colonnes attendues selon la charte
    var expectedHeaders = [
      "Date",
      "Référence",
      "Nom",
      "Prénom",
      "Téléphone",
      "E-mail",
      "Ville",
      "Produit",
      "Modèle",
      "Dimensions",
      "Consentement"
    ];

    // Étape 3 : Vérifier si l'onglet est vide. S'il est vide, on crée les en-têtes.
    var lastRow = targetSheet.getLastRow();
    var lastCol = targetSheet.getLastColumn();

    if (lastRow === 0 || lastCol === 0) {
      targetSheet.appendRow(expectedHeaders);
      
      // Styliser la ligne d'en-tête (Couleur Violet Dary #61218B)
      var headerRange = targetSheet.getRange(1, 1, 1, expectedHeaders.length);
      headerRange.setBackground("#61218B");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      targetSheet.setFrozenRows(1);
    }

    // Étape 4 : Extraire les données envoyées par l'application
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Requête de test simple
    if (data.isTest) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Test réussi ! Connecté à l'onglet : " + realSheetName,
        sheetName: realSheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Formater la date en fuseau horaire du Maroc (Africa/Casablanca)
    var formattedDate = Utilities.formatDate(new Date(), "Africa/Casablanca", "dd/MM/yyyy HH:mm:ss");

    var rowValues = [
      formattedDate,
      data.reference || ("DARY-" + Math.floor(100000 + Math.random() * 900000)),
      data.lastName || "",
      data.firstName || "",
      data.phoneNumber || "",
      data.email || "",
      data.city || "",
      data.productType || "",
      data.mattressModel || "",
      data.mattressDimensions || "",
      data.consent ? "Oui (Accepté)" : "Non"
    ];

    // Étape 5 : Ajouter la nouvelle ligne sans jamais écraser les données précédentes
    targetSheet.appendRow(rowValues);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Garantie enregistrée avec succès dans Google Sheets",
      reference: data.reference,
      sheetName: realSheetName,
      rowIndex: targetSheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Dary Bed & Living - Webhook Garantie",
    spreadsheetId: "${GOOGLE_SHEETS_ID}"
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
