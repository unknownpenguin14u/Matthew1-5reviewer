import React from 'react';
import { BookOpen, Award, Layers, Volume2, VolumeX, HelpCircle } from 'lucide-react';

export type AppMode = 'quiz' | 'flashcards' | 'reviewer' | 'history';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <div 
          id="brand-logo" 
          onClick={() => onSelectMode('quiz')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Matthew 1–5 <span className="text-amber-400 font-semibold text-xs sm:text-sm px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">Q&A Quiz</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Interactive Reviewer & Total Score</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="header-nav" className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-quiz-tab"
            onClick={() => onSelectMode('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentMode === 'quiz'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz</span>
          </button>

          <button
            id="nav-flashcards-tab"
            onClick={() => onSelectMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentMode === 'flashcards'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden xs:inline">Flashcards</span>
          </button>

          <button
            id="nav-reviewer-tab"
            onClick={() => onSelectMode('reviewer')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentMode === 'reviewer'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">All Q&A</span>
          </button>

          <button
            id="nav-history-tab"
            onClick={() => onSelectMode('history')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentMode === 'history'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Score Records"
          >
            <Award className="w-4 h-4" />
            <span className="hidden md:inline">Scores</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className={`ml-1 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              !soundEnabled ? 'text-slate-500 opacity-60' : 'text-amber-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
