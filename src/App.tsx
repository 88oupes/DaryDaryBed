/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { WarrantyForm } from './components/WarrantyForm.tsx';
import { CertificateModal } from './components/CertificateModal.tsx';
import { TrustSection } from './components/TrustSection.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);

  const handleFormSuccess = (result: any) => {
    setActiveCertificate(result);
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] text-[#292331] flex flex-col font-sans selection:bg-[#61218B] selection:text-white">
      {/* Navigation Header avec Logo officiel */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Hero Section */}
        <HeroBanner />

        {/* Main Warranty Form */}
        <WarrantyForm onSubmitSuccess={handleFormSuccess} />

        {/* Trust Badges & Guarantees */}
        <TrustSection />
      </main>

      {/* Footer officiel */}
      <Footer />

      {/* Attestation officielle de garantie */}
      {activeCertificate && (
        <CertificateModal
          data={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}
