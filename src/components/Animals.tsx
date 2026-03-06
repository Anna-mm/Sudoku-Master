import React from 'react';

interface AnimalProps {
  className?: string;
}

export const CuteRabbit = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="35" cy="25" rx="8" ry="20" fill="#FFD1DC" stroke="#333" strokeWidth="2" transform="rotate(-10, 35, 25)" />
    <ellipse cx="65" cy="25" rx="8" ry="20" fill="#FFD1DC" stroke="#333" strokeWidth="2" transform="rotate(10, 65, 25)" />
    <circle cx="50" cy="60" r="30" fill="white" stroke="#333" strokeWidth="2" />
    <circle cx="40" cy="55" r="3" fill="#333" />
    <circle cx="60" cy="55" r="3" fill="#333" />
    <path d="M48 65 L52 65 L50 68 Z" fill="#FFB7C5" />
    <circle cx="32" cy="65" r="5" fill="#FFD1DC" opacity="0.6" />
    <circle cx="68" cy="65" r="5" fill="#FFD1DC" opacity="0.6" />
    <path d="M46 72 Q50 75 54 72" stroke="#333" strokeWidth="1.5" fill="none" />
  </svg>
);

export const CuteCat = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 40 L35 15 L50 40 Z" fill="#FFD1DC" stroke="#333" strokeWidth="2" />
    <path d="M75 40 L65 15 L50 40 Z" fill="#FFD1DC" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="60" r="30" fill="#F5F5F5" stroke="#333" strokeWidth="2" />
    <circle cx="40" cy="55" r="3" fill="#333" />
    <circle cx="60" cy="55" r="3" fill="#333" />
    <circle cx="50" cy="65" r="2" fill="#FFB7C5" />
    <path d="M30 65 L15 62 M30 68 L15 70 M70 65 L85 62 M70 68 L85 70" stroke="#333" strokeWidth="1" />
  </svg>
);

export const CuteDog = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="25" cy="45" rx="10" ry="20" fill="#8B4513" stroke="#333" strokeWidth="2" />
    <ellipse cx="75" cy="45" rx="10" ry="20" fill="#8B4513" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="60" r="30" fill="#DEB887" stroke="#333" strokeWidth="2" />
    <circle cx="40" cy="55" r="3" fill="#333" />
    <circle cx="60" cy="55" r="3" fill="#333" />
    <circle cx="50" cy="68" r="4" fill="#333" />
  </svg>
);

export const CuteFox = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40 L30 10 L50 40 Z" fill="#FF8C00" stroke="#333" strokeWidth="2" />
    <path d="M80 40 L70 10 L50 40 Z" fill="#FF8C00" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="60" r="30" fill="#FF8C00" stroke="#333" strokeWidth="2" />
    <path d="M20 60 Q50 90 80 60" fill="white" />
    <circle cx="40" cy="55" r="3" fill="#333" />
    <circle cx="60" cy="55" r="3" fill="#333" />
    <circle cx="50" cy="75" r="3" fill="#333" />
  </svg>
);

export const CutePanda = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="35" r="10" fill="#333" />
    <circle cx="70" cy="35" r="10" fill="#333" />
    <circle cx="50" cy="60" r="30" fill="white" stroke="#333" strokeWidth="2" />
    <ellipse cx="40" cy="55" rx="8" ry="10" fill="#333" transform="rotate(-15, 40, 55)" />
    <ellipse cx="60" cy="55" rx="8" ry="10" fill="#333" transform="rotate(15, 60, 55)" />
    <circle cx="40" cy="55" r="2" fill="white" />
    <circle cx="60" cy="55" r="2" fill="white" />
    <circle cx="50" cy="68" r="3" fill="#333" />
  </svg>
);

export const CuteKoala = ({ className }: AnimalProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="40" r="15" fill="#A9A9A9" stroke="#333" strokeWidth="2" />
    <circle cx="75" cy="40" r="15" fill="#A9A9A9" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="60" r="30" fill="#A9A9A9" stroke="#333" strokeWidth="2" />
    <circle cx="40" cy="55" r="3" fill="#333" />
    <circle cx="60" cy="55" r="3" fill="#333" />
    <ellipse cx="50" cy="68" rx="6" ry="10" fill="#333" />
  </svg>
);
