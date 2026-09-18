import React from 'react';
import { BookOpen, Trophy, Layers, Volume2, VolumeX, HelpCircle, User, Edit3 } from 'lucide-react';

export type AppMode = 'quiz' | 'flashcards' | 'reviewer' | 'history';

export interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
  idToken?: string;
}

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playerName: string;
  onOpenNameEditor: () => void;
  googleUser?: GoogleProfile | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  playerName,
  onOpenNameEditor,
  googleUser,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  return (
    <header id="main-header" className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-amber-500/20 sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <div 
          id="brand-logo" 
          onClick={() => onSelectMode('quiz')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black shadow-md ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform relative overflow-hidden">
            <BookOpen className="w-5 h-5 text-slate-950 relative z-10" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Mateo 1–5</span>
              <span className="text-amber-400 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 tracking-wide uppercase">
                ✝ Banal na Kasulatan
              </span>
            </h1>
            <p className="text-xs text-amber-200/70 hidden sm:block font-serif italic">Reviewer & Kabuuang Iskor • Para sa Kaluwalhatian ng Diyos</p>
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
            id="nav-leaderboard-tab"
            onClick={() => onSelectMode('history')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentMode === 'history'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Leaderboard & High Scores"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Leaderboard</span>
          </button>

          {/* Google Sign-In / Player Name */}
          {googleUser ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 ml-1">
              {googleUser.picture ? (
                <img src={googleUser.picture} alt={googleUser.name} className="w-6 h-6 rounded-full border border-emerald-400/40" />
              ) : (
                <User className="w-4 h-4 text-emerald-300 shrink-0" />
              )}
              <span className="max-w-[90px] sm:max-w-[120px] truncate text-xs font-semibold text-emerald-100">
                {googleUser.name}
              </span>
              <button
                type="button"
                onClick={onGoogleSignOut}
                className="text-[10px] font-medium text-emerald-200 hover:text-white underline-offset-2 hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              id="header-google-signin-btn"
              type="button"
              onClick={onGoogleSignIn}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-400/50 transition-all cursor-pointer ml-1"
              title="Continue with Google"
            >
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="max-w-[90px] sm:max-w-[120px] truncate">Google Login</span>
            </button>
          )}

          <button
            id="header-player-name-btn"
            type="button"
            onClick={onOpenNameEditor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400/50 transition-all cursor-pointer ml-1"
            title="I-click upang palitan ang iyong pangalan"
          >
            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="max-w-[75px] sm:max-w-[110px] truncate">
              {playerName || 'Ipasok ang Pangalan'}
            </span>
            <Edit3 className="w-3 h-3 text-slate-400 hover:text-white hidden sm:inline-block shrink-0" />
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
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
