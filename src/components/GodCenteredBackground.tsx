import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Heart, RefreshCw } from 'lucide-react';

const SACRED_VERSES = [
  {
    ref: 'Mateo 1:23',
    tagalog: 'Narito, ang dalaga’y magdadalang-tao at manganganak ng isang lalake, at tatawagin ang kaniyang pangalang Emmanuel; na kung liliwanagin ay, Sumasaatin ang Dios.',
    english: 'They shall call his name Emmanuel, which being interpreted is, God with us.',
    theme: 'Emmanuel • Sumasaatin ang Dios',
  },
  {
    ref: 'Mateo 4:4',
    tagalog: 'Nasusulat, Hindi sa tinapay lamang mabubuhay ang tao, kundi sa bawa’t salitang lumalabas sa bibig ng Dios.',
    english: 'Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
    theme: 'Ang Salita ng Buhay',
  },
  {
    ref: 'Mateo 5:14 & 16',
    tagalog: 'Kayo ang ilaw ng sanlibutan... Lumiwanag nang gayon ang inyong ilaw sa harap ng mga tao, upang makita nila ang inyong mabubuting gawa, at luwalhatiin ang inyong Ama na nasa langit.',
    english: 'Ye are the light of the world... Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.',
    theme: 'Ilaw ng Sanlibutan • Kaluwalhatian sa Dios',
  },
  {
    ref: 'Mateo 5:3',
    tagalog: 'Mapapalad ang mga mapagpakumbabang-loob: sapagka’t kanila ang kaharian ng langit.',
    english: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
    theme: 'Mga Mapapalad • Ang Kaharian ng Langit',
  },
  {
    ref: 'Mateo 5:8',
    tagalog: 'Mapapalad ang mga may malinis na puso: sapagka’t makikita nila ang Dios.',
    english: 'Blessed are the pure in heart: for they shall see God.',
    theme: 'Kabanalan at Kalinisan ng Puso',
  },
  {
    ref: 'Mateo 3:17',
    tagalog: 'At narito, ang isang tinig na mula sa mga langit, na nagsasabi, Ito ang sinisinta kong Anak, na siya kong kinalulugdan.',
    english: 'And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.',
    theme: 'Ang Banal na Tinig mula sa Langit',
  },
];

interface GodCenteredBackgroundProps {
  children: React.ReactNode;
}

export const GodCenteredBackground: React.FC<GodCenteredBackgroundProps> = ({ children }) => {
  const [verseIndex, setVerseIndex] = useState<number>(0);

  // Rotate verse every 25 seconds gently
  useEffect(() => {
    const timer = setInterval(() => {
      setVerseIndex(prev => (prev + 1) % SACRED_VERSES.length);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  const currentVerse = SACRED_VERSES[verseIndex];

  const handleNextVerse = () => {
    setVerseIndex(prev => (prev + 1) % SACRED_VERSES.length);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#FAF7F2] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* 
        LAYER 1: Heavenly Golden Radiance & Celestial Rays 
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Supreme Top Celestial Light Glow */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] sm:w-[1200px] sm:h-[650px] rounded-full blur-3xl opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.14) 40%, rgba(217, 119, 6, 0.05) 70%, transparent 85%)'
          }}
        />

        {/* Soft Left & Right Ethereal Dawn Auras */}
        <div 
          className="absolute top-48 -left-36 w-[550px] h-[550px] rounded-full blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(252, 211, 77, 0.2) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)'
          }}
        />
        <div 
          className="absolute top-72 -right-36 w-[550px] h-[550px] rounded-full blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(217, 119, 6, 0.06) 50%, transparent 75%)'
          }}
        />

        {/* Diagonal Divine Light Beams SVG */}
        <svg 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-30 mix-blend-multiply"
          viewBox="0 0 1000 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="divineBeamGrad1" x1="500" y1="0" x2="300" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="0.7" stopColor="#FDE68A" stopOpacity="0.08" />
              <stop offset="1" stopColor="#FFFBEB" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divineBeamGrad2" x1="500" y1="0" x2="700" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="0.7" stopColor="#FDE68A" stopOpacity="0.08" />
              <stop offset="1" stopColor="#FFFBEB" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="divineBeamGradCenter" x1="500" y1="0" x2="500" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" stopOpacity="0.3" />
              <stop offset="0.6" stopColor="#FDE68A" stopOpacity="0.1" />
              <stop offset="1" stopColor="#FFFBEB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Radiating Light Rays from Heaven */}
          <polygon points="500,0 200,600 350,600" fill="url(#divineBeamGrad1)" />
          <polygon points="500,0 650,600 800,600" fill="url(#divineBeamGrad2)" />
          <polygon points="500,0 430,600 570,600" fill="url(#divineBeamGradCenter)" />
          <polygon points="500,0 80,600 180,600" fill="url(#divineBeamGrad1)" opacity="0.6" />
          <polygon points="500,0 820,600 920,600" fill="url(#divineBeamGrad2)" opacity="0.6" />
        </svg>

        {/* Elegant Sacred Cross Watermark */}
        <div className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 opacity-[0.065] flex flex-col items-center select-none pointer-events-none">
          <svg 
            className="w-72 h-72 sm:w-96 sm:h-96" 
            viewBox="0 0 200 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Halo / Solar Aura */}
            <circle cx="100" cy="70" r="42" stroke="#92400E" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="100" cy="70" r="48" stroke="#B45309" strokeWidth="1" opacity="0.6" />

            {/* Radiant Sunburst Cross */}
            <line x1="100" y1="12" x2="100" y2="28" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="112" x2="100" y2="128" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="70" x2="58" y2="70" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <line x1="142" y1="70" x2="158" y2="70" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="30" x2="70" y2="40" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="140" y1="30" x2="130" y2="40" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="60" y1="110" x2="70" y2="100" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="140" y1="110" x2="130" y2="100" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />

            {/* Latin Cross Vertical Beam */}
            <rect x="94" y="24" width="12" height="152" rx="4" fill="#92400E" />
            {/* Latin Cross Horizontal Beam */}
            <rect x="52" y="64" width="96" height="12" rx="4" fill="#92400E" />
          </svg>
        </div>

        {/* Subtle Holy Stars / Celestial Points */}
        <div className="absolute top-24 left-[15%] w-2 h-2 rounded-full bg-amber-400/40 blur-[0.5px]" />
        <div className="absolute top-36 right-[18%] w-2.5 h-2.5 rounded-full bg-amber-500/35 blur-[0.5px]" />
        <div className="absolute top-64 left-[28%] w-1.5 h-1.5 rounded-full bg-amber-300/50" />
        <div className="absolute top-80 right-[25%] w-1.5 h-1.5 rounded-full bg-amber-400/40" />

        {/* Sacred Latin Inscription Watermark */}
        <div className="hidden lg:block absolute bottom-8 left-8 text-[11px] uppercase font-serif tracking-[0.25em] text-amber-900/15 select-none font-bold">
          Soli Deo Gloria • In Principio Erat Verbum
        </div>
        <div className="hidden lg:block absolute bottom-8 right-8 text-[11px] uppercase font-serif tracking-[0.25em] text-amber-900/15 select-none font-bold">
          Evangelium Secundum Matthaeum
        </div>
      </div>

      {/* 
        LAYER 2: God-Centered Daily Scripture Banner (Inspiring Word of God)
      */}
      <div 
        id="divine-scripture-top-ribbon" 
        className="relative z-20 bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 text-amber-100 border-b border-amber-500/30 px-3 py-2 sm:py-2.5 shadow-sm"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wide uppercase shrink-0 border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Salita ng Diyos
            </span>

            <div className="truncate">
              <span className="font-bold text-amber-300 mr-2">{currentVerse.ref}:</span>
              <span className="text-slate-200 italic">“{currentVerse.tagalog}”</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-amber-300/80 font-medium hidden md:inline">
              {currentVerse.theme}
            </span>
            <button
              id="next-scripture-verse-btn"
              type="button"
              onClick={handleNextVerse}
              className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
              title="Magbasa ng susunod na talata ng Diyos"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Rendered on Top */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* God-Centered Sacred Footer Ribbon */}
      <div className="relative z-10 bg-amber-950/90 text-amber-200/90 border-t border-amber-500/20 py-4 px-4 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-1.5">
          <p className="text-xs sm:text-sm font-serif italic text-amber-200 font-medium">
            “Sapagka’t sa Iyo ang kaharian, at ang kapangyarihan, at ang kaluwalhatian, magpakailanman. Amen.”
          </p>
          <p className="text-[11px] text-amber-400/70 font-semibold tracking-wider uppercase">
            Mateo 6:13 • Soli Deo Gloria • Ang Ebanghelyo Ayon kay Mateo
          </p>
        </div>
      </div>
    </div>
  );
};
