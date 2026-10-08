import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data folder exists for persistent registrations & config
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Initialize files if not existing
if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

interface ServerConfig {
  googleSheetsId: string;
  appsScriptUrl: string;
}

const DEFAULT_CONFIG: ServerConfig = {
  googleSheetsId: process.env.GOOGLE_SHEETS_ID || '148zAkd_M-LR9NpQmq0rP4BEeMT9lGqx2qCwX4a2TKug',
  appsScriptUrl: process.env.APPS_SCRIPT_URL || '',
};

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
}

function loadConfig(): ServerConfig {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveConfig(cfg: Partial<ServerConfig>): ServerConfig {
  const current = loadConfig();
  const updated = { ...current, ...cfg };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export interface WarrantyRegistration {
  id: string;
  reference: string;
  date: string;
  productType: 'Matelas' | 'Salon';
  mattressModel: string;
  mattressDimensions: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  city: string;
  consent: boolean;
  syncedToGoogleSheets: boolean;
  sheetsResponse?: string;
  createdAt: string;
}

function loadRegistrations(): WarrantyRegistration[] {
  try {
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegistration(item: WarrantyRegistration) {
  const items = loadRegistrations();
  items.unshift(item);
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function updateRegistration(id: string, updates: Partial<WarrantyRegistration>) {
  const items = loadRegistrations();
  const index = items.findIndex((r) => r.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API: Get current config
app.get('/api/config', (_req: Request, res: Response) => {
  const cfg = loadConfig();
  res.json({
    googleSheetsId: cfg.googleSheetsId,
    appsScriptUrl: cfg.appsScriptUrl,
    hasAppsScript: Boolean(cfg.appsScriptUrl && cfg.appsScriptUrl.trim().length > 0),
  });
});

// API: Save or update Apps Script URL
app.post('/api/config', (req: Request, res: Response) => {
  const { appsScriptUrl, googleSheetsId } = req.body;
  const updated = saveConfig({
    ...(typeof appsScriptUrl === 'string' ? { appsScriptUrl: appsScriptUrl.trim() } : {}),
    ...(typeof googleSheetsId === 'string' ? { googleSheetsId: googleSheetsId.trim() } : {}),
  });
  res.json({ success: true, config: updated });
});

// API: Get registrations list
app.get('/api/registrations', (_req: Request, res: Response) => {
  const registrations = loadRegistrations();
  res.json({ success: true, registrations });
});

// Helper to forward data to Google Apps Script Web App
async function forwardToAppsScript(url: string, payload: Record<string, unknown>) {
  try {
    const cleanUrl = url.trim();

    // Vérification : l'utilisateur a-t-il collé le lien du classeur au lieu de l'application Web ?
    if (cleanUrl.includes('docs.google.com/spreadsheets')) {
      return {
        success: false,
        error: "Vous avez collé l'adresse de votre feuille Google Sheets (docs.google.com) au lieu du lien d'application Web Google Apps Script. L'URL attendue doit commencer par https://script.google.com/macros/s/ et se terminer par /exec.",
      };
    }

    if (!cleanUrl.startsWith('https://script.google.com/')) {
      return {
        success: false,
        error: "L'URL est invalide. Elle doit obligatoirement commencer par https://script.google.com/macros/s/ et se terminer par /exec.",
      };
    }

    // Appel sécurisé vers Google Apps Script
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await response.text();
    let jsonResult = null;
    try {
      jsonResult = JSON.parse(text);
    } catch {
      // Ce n'est pas du JSON valide
    }

    // Détection d'une page HTML (ex: page de connexion Google ou erreur de permission)
    if (!jsonResult && (text.trim().startsWith('<') || text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('accounts.google.com'))) {
      return {
        success: false,
        error: "Google a renvoyé une page de connexion Google au lieu d'enregistrer les données. Cela arrive quand 'Qui a accès' est resté sur 'Moi uniquement' au lieu de 'Tout le monde' (Anyone). Dans Apps Script, cliquez sur Déployer > Gérer les déploiements > Modifier (crayon), et choisissez Qui a accès : 'Tout le monde'.",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: (jsonResult && jsonResult.message) || text || `Erreur serveur Google HTTP ${response.status}`,
      };
    }

    if (jsonResult && jsonResult.status === 'error') {
      return {
        success: false,
        error: jsonResult.message || 'Erreur renvoyée par le script Google Apps Script',
      };
    }

    return {
      success: true,
      status: response.status,
      response: jsonResult || text,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Erreur lors de la communication avec Google Apps Script',
    };
  }
}

// API: Test Google Sheets Apps Script connection
app.post('/api/test-sheets', async (req: Request, res: Response) => {
  const cfg = loadConfig();
  const targetUrl = (req.body.appsScriptUrl || cfg.appsScriptUrl || '').trim();

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      message: 'Aucune URL Google Apps Script configurée. Veuillez renseigner l\'URL de votre Web App.',
    });
  }

  const result = await forwardToAppsScript(targetUrl, {
    isTest: true,
    testTimestamp: new Date().toISOString(),
    spreadsheetId: cfg.googleSheetsId,
  });

  if (result.success) {
    return res.json({
      success: true,
      message: 'Connexion à Google Sheets établie avec succès !',
      details: result.response,
    });
  } else {
    return res.status(502).json({
      success: false,
      message: 'Impossible de joindre le script Google Apps Script. Vérifiez les autorisations de déploiement (Accès: "Tout le monde / Anyone").',
      error: result.error || result.response,
    });
  }
});

// API: Register Warranty
app.post('/api/register-warranty', async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (!productType || !['Matelas', 'Salon'].includes(productType)) {
      return res.status(400).json({ success: false, error: 'Type de produit invalide (Matelas ou Salon attendu).' });
    }

    if (productType === 'Matelas') {
      if (!mattressModel || !mattressModel.trim()) {
        return res.status(400).json({ success: false, error: 'Le modèle du matelas est obligatoire.' });
      }
      if (!mattressDimensions || !mattressDimensions.trim()) {
        return res.status(400).json({ success: false, error: 'Les dimensions du matelas sont obligatoires.' });
      }
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ success: false, error: 'Le nom de famille est obligatoire.' });
    }
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ success: false, error: 'Le prénom est obligatoire.' });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, error: 'Le numéro de téléphone est obligatoire.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'L\'adresse e-mail est obligatoire.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, error: 'La ville d\'achat est obligatoire.' });
    }
    if (!consent) {
      return res.status(400).json({ success: false, error: 'Le consentement aux conditions de garantie est obligatoire.' });
    }

    // Generate unique warranty reference (Format: DARY-GAR-XXXXXX)
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

    const newRecord: WarrantyRegistration = {
      id: `gar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reference,
      date: dateStr,
      productType,
      mattressModel: productType === 'Matelas' ? mattressModel.trim() : '',
      mattressDimensions: productType === 'Matelas' ? mattressDimensions.trim() : '',
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      consent: Boolean(consent),
      syncedToGoogleSheets: false,
      createdAt: new Date().toISOString(),
    };

    // Save locally immediately
    saveRegistration(newRecord);

    // Forward to Google Apps Script if URL configured
    const cfg = loadConfig();
    let forwardStatus = {
      synced: false,
      message: 'Enregistrement sauvegardé localement. En attente de configuration Google Sheets.',
    };

    if (cfg.appsScriptUrl && cfg.appsScriptUrl.trim().length > 0) {
      const sheetsResult = await forwardToAppsScript(cfg.appsScriptUrl.trim(), {
        reference: newRecord.reference,
        date: newRecord.date,
        productType: newRecord.productType,
        mattressModel: newRecord.mattressModel,
        mattressDimensions: newRecord.mattressDimensions,
        lastName: newRecord.lastName,
        firstName: newRecord.firstName,
        phoneNumber: newRecord.phoneNumber,
        email: newRecord.email,
        city: newRecord.city,
        consent: newRecord.consent,
      });

      if (sheetsResult.success) {
        newRecord.syncedToGoogleSheets = true;
        newRecord.sheetsResponse = typeof sheetsResult.response === 'string' ? sheetsResult.response : JSON.stringify(sheetsResult.response);
        updateRegistration(newRecord.id, {
          syncedToGoogleSheets: true,
          sheetsResponse: newRecord.sheetsResponse,
        });
        forwardStatus = {
          synced: true,
          message: 'Transmis et synchronisé directement dans votre feuille Google Sheets !',
        };
      } else {
        forwardStatus = {
          synced: false,
          message: 'Sauvegardé avec succès dans le système. La synchronisation avec Google Sheets sera réessayée.',
        };
      }
    }

    return res.status(201).json({
      success: true,
      reference,
      registration: newRecord,
      forwardStatus,
      message: 'Votre bulletin de garantie a été enregistré avec succès !',
    });
  } catch (error: any) {
    console.error('Erreur enregistrement garantie:', error);
    return res.status(500).json({
      success: false,
      error: 'Une erreur interne est survenue lors de l\'enregistrement de votre garantie.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Dary Bed & Living démarré sur http://localhost:${PORT}`);
    console.log(`GOOGLE_SHEETS_ID: ${loadConfig().googleSheetsId}`);
  });
}

startServer();
