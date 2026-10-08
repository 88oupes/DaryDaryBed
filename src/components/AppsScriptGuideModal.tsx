import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Code2,
  X,
  Loader2,
} from 'lucide-react';
import { APPS_SCRIPT_SOURCE_CODE, GOOGLE_SHEETS_ID } from '../data/catalogue.ts';

interface AppsScriptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const AppsScriptGuideModal: React.FC<AppsScriptGuideModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'tutoriel' | 'code' | 'explication'>('tutoriel');

  // Load current config
  useEffect(() => {
    if (isOpen) {
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          if (data.appsScriptUrl) {
            setAppsScriptUrl(data.appsScriptUrl);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveUrl = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appsScriptUrl }),
      });
      const data = await res.json();
      if (data.success) {
        onConfigSaved?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    const trimmed = appsScriptUrl.trim();
    if (!trimmed) return;

    if (trimmed.includes('docs.google.com/spreadsheets')) {
      setTestResult({
        success: false,
        message: 'Vous avez collé le lien de votre feuille Google Sheets (docs.google.com). Le lien nécessaire doit commencer par https://script.google.com/macros/s/... et se terminer par /exec (voir l\'illustration ci-dessous).',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      // Save first
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appsScriptUrl: trimmed }),
      });

      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appsScriptUrl: trimmed }),
      });

      const raw = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(raw);
      } catch {
        data = {
          success: false,
          message: 'Google a renvoyé du contenu HTML (page de connexion). Vérifiez que vous avez bien sélectionné Qui a accès : "Tout le monde" (Anyone) lors du déploiement.',
        };
      }

      setTestResult({
        success: res.ok && data.success,
        message: data.error || data.message || 'Résultat du test',
        details: data.details,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Impossible de contacter le serveur de test',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/edit`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#EDE4F2] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#34134F] to-[#61218B] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#EDE4F2] font-semibold">
                Guide Débutant Pas-à-Pas
              </p>
              <h2 className="text-lg font-bold text-white">
                Automatisation Google Sheets avec Apps Script
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#EDE4F2] bg-[#F7F2EB]/50 shrink-0">
          <button
            onClick={() => setActiveTab('tutoriel')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'tutoriel'
                ? 'bg-white text-[#61218B] border-t-2 border-[#61218B] shadow-xs'
                : 'text-[#6F7072] hover:text-[#292331]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide étape par étape</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-white text-[#61218B] border-t-2 border-[#61218B] shadow-xs'
                : 'text-[#6F7072] hover:text-[#292331]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code du Script</span>
          </button>
          <button
            onClick={() => setActiveTab('explication')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'explication'
                ? 'bg-white text-[#61218B] border-t-2 border-[#61218B] shadow-xs'
                : 'text-[#6F7072] hover:text-[#292331]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Explication du code</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-[#292331]">
          {/* TAB 1: TUTORIEL PAS À PAS */}
          {activeTab === 'tutoriel' && (
            <div className="space-y-6">
              {/* Note rassurante pour non-développeur */}
              <div className="p-4 rounded-2xl bg-[#EDE4F2]/50 border border-[#61218B]/20 text-[#292331] space-y-1">
                <p className="font-bold text-sm text-[#61218B] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#61218B]" />
                  <span>Vous n'êtes pas développeur ? Aucun problème !</span>
                </p>
                <p className="leading-relaxed">
                  Cette démarche prend exactement <strong>2 minutes</strong>. Google Apps Script est un outil gratuit intégré directement dans votre feuille Google Sheets qui va recevoir les données du formulaire et les inscrire automatiquement dans les bonnes colonnes.
                </p>
              </div>

              {/* Étapes illustrées */}
              <div className="space-y-4">
                {/* Étape 1 */}
                <div className="p-4 rounded-2xl border border-[#EDE4F2] bg-[#FFFFFF] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#61218B] uppercase tracking-wider text-[11px]">
                      Étape 1 : Ouvrir votre Google Sheet
                    </span>
                    <a
                      href={sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EDE4F2] text-[#61218B] font-semibold text-xs hover:bg-[#61218B] hover:text-white transition-colors"
                    >
                      <span>Ouvrir la feuille</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-[#6F7072]">
                    Votre feuille officielle a l'identifiant :{' '}
                    <code className="bg-[#F7F2EB] px-1.5 py-0.5 rounded font-mono text-[#292331]">
                      {GOOGLE_SHEETS_ID}
                    </code>
                  </p>
                </div>

                {/* Étape 2 */}
                <div className="p-4 rounded-2xl border border-[#EDE4F2] bg-[#FFFFFF] space-y-2">
                  <span className="font-bold text-[#61218B] uppercase tracking-wider text-[11px]">
                    Étape 2 : Ouvrir l'éditeur de script
                  </span>
                  <p className="leading-relaxed">
                    Dans le menu en haut de votre Google Sheet, cliquez sur :<br />
                    <strong>Extensions</strong> ➔ <strong>Apps Script</strong>.
                  </p>
                  <p className="text-[#6F7072]">
                    Un nouvel onglet va s'ouvrir avec une page de programmation Google.
                  </p>
                </div>

                {/* Étape 3 */}
                <div className="p-4 rounded-2xl border border-[#EDE4F2] bg-[#FFFFFF] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#61218B] uppercase tracking-wider text-[11px]">
                      Étape 3 : Coller le code préparé
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#61218B] text-white font-semibold text-xs hover:bg-[#4F1872] transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Code copié !' : 'Copier le code'}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed">
                    Supprimez le texte présent par défaut (les quelques lignes avec <code>myFunction</code>), puis collez le code copié. Cliquez ensuite sur l'icône de disquette 💾 pour <strong>Enregistrer</strong>.
                  </p>
                </div>

                {/* Étape 4 */}
                <div className="p-4 rounded-2xl border border-[#EDE4F2] bg-[#FFFFFF] space-y-2">
                  <span className="font-bold text-[#61218B] uppercase tracking-wider text-[11px]">
                    Étape 4 : Déployer en Application Web
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[#292331]">
                    <li>Cliquez sur le bouton bleu <strong>Déployer</strong> (en haut à droite) ➔ <strong>Nouveau déploiement</strong>.</li>
                    <li>Cliquez sur l'engrenage ⚙️ à gauche et sélectionnez <strong>Application Web</strong>.</li>
                    <li>Donnez une description, par exemple : <em>Dary Garantie</em>.</li>
                    <li><strong>Exécuter en tant que :</strong> sélectionnez <em>Moi (votre adresse e-mail)</em>.</li>
                    <li><strong>Qui a accès :</strong> sélectionnez impérativement <strong>Tout le monde (Anyone)</strong> pour autoriser le formulaire à envoyer les garanties.</li>
                    <li>Cliquez sur <strong>Déployer</strong>, puis autorisez l'accès si Google vous le demande.</li>
                  </ul>
                </div>

                {/* Étape 5 & 6 : URL et test */}
                <div className="p-5 rounded-2xl border-2 border-[#61218B] bg-[#F7F2EB] space-y-4">
                  <div className="space-y-1">
                    <span className="font-bold text-[#61218B] uppercase tracking-wider text-xs">
                      Étape 5 : Où trouver l'URL et comment la coller ?
                    </span>
                    <p className="text-xs text-[#292331] leading-relaxed">
                      Dès que vous cliquez sur <strong>Déployer</strong>, Google affiche une petite fenêtre comme celle-ci :
                    </p>
                  </div>

                  {/* Reproduction visuelle de la fenêtre Google */}
                  <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-xs space-y-2.5 font-sans">
                    <div className="flex items-center justify-between border-b pb-2 text-[11px] text-gray-500 font-semibold">
                      <span>Fenêtre Google Apps Script</span>
                      <span className="text-emerald-600 font-bold">✓ Déploiement réussi</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-gray-700">Application Web</p>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs">
                        <span className="font-mono text-gray-600 truncate flex-1 select-all">
                          https://script.google.com/macros/s/AKfycb.../exec
                        </span>
                        <span className="bg-[#61218B] text-white px-2.5 py-1 rounded text-[11px] font-bold shrink-0">
                          1. Cliquez sur "Copier" ici chez Google
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="font-semibold text-xs text-[#292331]">
                      2. Revenez ici et collez ce lien dans la case ci-dessous :
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={appsScriptUrl}
                        onChange={(e) => setAppsScriptUrl(e.target.value)}
                        placeholder="Collez ici le lien copié (https://script.google.com/.../exec)"
                        className="flex-1 bg-white border-2 border-[#61218B]/30 focus:border-[#61218B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#292331] outline-none shadow-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveUrl}
                          disabled={isSaving || !appsScriptUrl}
                          className="px-4 py-2.5 rounded-xl bg-[#292331] hover:bg-black text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                          onClick={handleTestConnection}
                          disabled={isTesting || !appsScriptUrl}
                          className="px-4 py-2.5 rounded-xl bg-[#61218B] hover:bg-[#4F1872] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {isTesting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                          <span>Tester la connexion</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Résultat du test */}
                  {testResult && (
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                        testResult.success
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-red-50 border-red-300 text-red-900'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="font-bold text-xs">{testResult.message}</p>
                        {testResult.success && (
                          <p className="text-[11px] text-emerald-700">
                            Bravo ! Tout est connecté. Désormais, chaque client qui cliquera sur "Activer ma garantie" ajoutera automatiquement une nouvelle ligne dans votre fichier Google Sheets.
                          </p>
                        )}
                        {testResult.details && (
                          <p className="text-[11px] font-mono mt-0.5 text-gray-700 bg-white/70 p-1.5 rounded">
                            {typeof testResult.details === 'object'
                              ? JSON.stringify(testResult.details)
                              : testResult.details}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE DU SCRIPT */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#292331] text-sm">
                    Code Google Apps Script à coller
                  </h4>
                  <p className="text-[#6F7072]">
                    Ce script est configuré sur mesure pour votre feuille{' '}
                    <code>{GOOGLE_SHEETS_ID}</code>.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#61218B] text-white font-semibold text-xs hover:bg-[#4F1872] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Code copié !' : 'Copier tout le code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#292331] p-4 text-[#EDE4F2] font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#34134F] max-h-96">
                <pre>{APPS_SCRIPT_SOURCE_CODE}</pre>
              </div>
            </div>
          )}

          {/* TAB 3 : EXPLICATION DU CODE POUR NON-DÉVELOPPEURS */}
          {activeTab === 'explication' && (
            <div className="space-y-4">
              <h4 className="font-bold text-[#292331] text-sm">
                Comment fonctionne ce code ? (Explication simple étape par étape)
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-[#EDE4F2] bg-[#F7F2EB]/50">
                  <p className="font-bold text-[#61218B]">1. La fonction doPost(e)</p>
                  <p className="text-[#6F7072] mt-1 leading-relaxed">
                    C'est la porte d'entrée qui écoute chaque clic sur <em>"Activer ma garantie"</em>. Dès qu'un client valide son formulaire sur le site, les informations lui sont transmises de manière sécurisée.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#EDE4F2] bg-[#F7F2EB]/50">
                  <p className="font-bold text-[#61218B]">2. Le système anti-collision (LockService)</p>
                  <p className="text-[#6F7072] mt-1 leading-relaxed">
                    Si deux clients valident leur garantie à la même seconde, le script met la seconde demande en attente quelques millisecondes pour éviter qu'une ligne n'en écrase une autre.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#EDE4F2] bg-[#F7F2EB]/50">
                  <p className="font-bold text-[#61218B]">3. Détection de l'onglet (sheetId = 0) et récupération du nom réel</p>
                  <p className="text-[#6F7072] mt-1 leading-relaxed">
                    Le code parcourt tous les onglets du classeur pour trouver celui dont l'identifiant technique est <code>0</code> (le premier onglet d'origine, qu'il s'appelle "Feuille 1", "Sheet1" ou que vous l'ayez renommé).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#EDE4F2] bg-[#F7F2EB]/50">
                  <p className="font-bold text-[#61218B]">4. Création automatique des 11 colonnes sans écrasement</p>
                  <p className="text-[#6F7072] mt-1 leading-relaxed">
                    Le code vérifie si la feuille est vide. Si oui, il écrit automatiquement les 11 colonnes officielles avec le violet Dary :<br />
                    <code className="text-[#61218B] font-semibold">
                      Date | Référence | Nom | Prénom | Téléphone | E-mail | Ville | Produit | Modèle | Dimensions | Consentement
                    </code>
                    <br />
                    Si la feuille contient déjà des lignes, il ne touche à rien et ajoute simplement le nouveau client à la suite !
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#EDE4F2] bg-[#F7F2EB]/50">
                  <p className="font-bold text-[#61218B]">5. Gestion spécifique des Salons vs Matelas</p>
                  <p className="text-[#6F7072] mt-1 leading-relaxed">
                    Si le client a choisi <em>"Salon"</em>, les colonnes <strong>Modèle</strong> et <strong>Dimensions</strong> restent automatiquement vides comme demandé dans le cahier des charges.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F7F2EB] border-t border-[#EDE4F2] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#6F7072]">
            Classeur Google Sheets ID : <span className="font-mono font-bold text-[#292331]">{GOOGLE_SHEETS_ID}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#61218B] hover:bg-[#4F1872] text-white transition-colors cursor-pointer"
          >
            Compris / Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
