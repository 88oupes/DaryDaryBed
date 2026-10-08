export default async function handler(req: any, res: any) {
  // Support for CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      productType,
      mattressModel,
      mattressDimensions,
      lastName,
      firstName,
      phoneNumber,
      email,
      city,
      consent,
    } = body;

    if (!productType || !['Matelas', 'Salon'].includes(productType)) {
      return res.status(400).json({ success: false, error: 'Type de produit invalide.' });
    }

    if (productType === 'Matelas' && (!mattressModel || !mattressDimensions)) {
      return res.status(400).json({ success: false, error: 'Modèle et dimensions requis pour un matelas.' });
    }

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const reference = `DARY-GAR-${randomDigits}`;
    const dateStr = new Date().toLocaleString('fr-FR', {
      timeZone: 'Africa/Casablanca',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const record = {
      reference,
      date: dateStr,
      productType,
      mattressModel: productType === 'Matelas' ? mattressModel.trim() : '',
      mattressDimensions: productType === 'Matelas' ? mattressDimensions.trim() : '',
      lastName: lastName?.trim() || '',
      firstName: firstName?.trim() || '',
      phoneNumber: phoneNumber?.trim() || '',
      email: email?.trim().toLowerCase() || '',
      city: city?.trim() || '',
      consent: Boolean(consent),
    };

    const appsScriptUrl =
      process.env.APPS_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbyAid9WveI5QeesxVPdANjpdVhSR25H_C7UWT2Owk7bU4WTb5-04kBkOdWGyv9mp6DICw/exec';

    let synced = false;
    let sheetsResponse: any = null;

    if (appsScriptUrl) {
      try {
        const scriptRes = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
          redirect: 'follow',
        });
        const text = await scriptRes.text();
        try {
          sheetsResponse = JSON.parse(text);
          synced = true;
        } catch {
          sheetsResponse = text;
          synced = scriptRes.ok;
        }
      } catch (err: any) {
        console.error('Erreur Apps Script:', err);
      }
    }

    return res.status(200).json({
      success: true,
      reference,
      registration: record,
      forwardStatus: {
        synced,
        message: synced
          ? 'Transmis et synchronisé directement dans votre feuille Google Sheets !'
          : 'Enregistré avec succès !',
      },
      message: 'Votre bulletin de garantie a été enregistré avec succès !',
    });
  } catch (error: any) {
    console.error('Erreur Vercel serverless:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erreur interne lors de l\'enregistrement',
    });
  }
}
