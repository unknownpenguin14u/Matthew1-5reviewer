import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Sparkles, Trophy, X } from 'lucide-react';

interface NameEditorModalProps {
  isOpen: boolean;
  currentName: string;
  onSaveName: (name: string) => void;
  onClose: () => void;
  isInitialPrompt?: boolean;
}

export const NameEditorModal: React.FC<NameEditorModalProps> = ({
  isOpen,
  currentName,
  onSaveName,
  onClose,
  isInitialPrompt = false,
}) => {
  const [name, setName] = useState<string>(currentName || '');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(currentName || '');
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed && isInitialPrompt) {
      // If user submitted empty, default to Anonymous or prompt
      onSaveName('Anonymous');
      onClose();
      return;
    }
    if (trimmed.length > 35) {
      setError('Masyadong mahaba ang pangalan (max 35 characters).');
      return;
    }
    onSaveName(trimmed || 'Anonymous');
    onClose();
  };

  const handleSkipOrGuest = () => {
    onSaveName('Anonymous');
    onClose();
  };

  return (
    <div
      id="name-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="name-editor-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 relative overflow-hidden"
      >
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {!isInitialPrompt && (
          <button
            id="close-name-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            title="Isara"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
            <User className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isInitialPrompt ? 'Maligayang Pagdating! / Welcome!' : 'I-edit ang Pangalan'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isInitialPrompt ? 'Ipasok ang Iyong Pangalan' : 'Palitan ang Pangalan ng Manlalaro'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {isInitialPrompt
              ? 'Ipasok ang iyong pangalan upang maitala at makilala ka sa Leaderboard kapag nakakuha ka ng mataas na iskor.'
              : 'I-update ang pangalan na ginagamit sa mga susunod mong pagsusulit at sa Leaderboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="modal-name-input-field"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Pangalan / Player Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                ref={inputRef}
                id="modal-name-input-field"
                type="text"
                placeholder="Hal. Juan Dela Cruz, Maria, Joshua..."
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                maxLength={35}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-semibold text-sm shadow-2xs"
              />
            </div>
            {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
            <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-snug">
              Awtomatikong itatabi ang iyong pangalan. Hindi na ito muling hihingin sa susunod na pagbukas ng app.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              id="submit-player-name-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{isInitialPrompt ? 'I-save at Magsimula' : 'I-save ang Pagbabago'}</span>
            </button>

            {isInitialPrompt && (
              <button
                id="skip-name-prompt-btn"
                type="button"
                onClick={handleSkipOrGuest}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Magpatuloy bilang Anonymous / Guest
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
