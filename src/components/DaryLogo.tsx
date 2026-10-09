import React from 'react';

export const OFFICIAL_DARY_LOGO_URL =
  'https://res.cloudinary.com/psbqhe7h/image/upload/v1791549959/Sans_titre-40.png';

interface DaryLogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

export const DaryLogo: React.FC<DaryLogoProps> = ({
  className = 'h-10',
}) => {
  return (
    <img
      src={OFFICIAL_DARY_LOGO_URL}
      alt="Dary Bed"
      className={`${className} w-auto object-contain`}
      referrerPolicy="no-referrer"
    />
  );
};
