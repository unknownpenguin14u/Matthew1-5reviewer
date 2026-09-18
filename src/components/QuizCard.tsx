import React, { useEffect, useState } from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, BookOpen, Flame, Award, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentScore: number;
  currentStreak: number;
  onAnswer: (selectedOption: string, isCorrect: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
  isLastQuestion: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentScore,
  currentStreak,
  onAnswer,
  onNext,
  onQuit,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Reset local state on question change
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleSelectOption = (opt: string) => {
    if (hasAnswered) return;
    const isCorrect = opt === question.answer;
    setSelectedOption(opt);
    setHasAnswered(true);

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    onAnswer(opt, isCorrect);
  };

  // Keyboard shortcut listener (1-4 for options, Enter/Space for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (question.options[idx]) {
            handleSelectOption(question.options[idx]);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, question, onNext]);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const accuracyPercent = currentIndex > 0 ? Math.round((currentScore / currentIndex) * 100) : 0;

  return (
    <div id="active-quiz-card" className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header / Progress & Live Score Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Question Index & Chapter */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold text-xs">
              Tanong {currentIndex + 1} ng {totalQuestions}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200">
              Matthew Ch {question.chapter}
            </span>
          </div>

          {/* Live Total Score & Streak Tracker */}
          <div className="flex items-center gap-3">
            {currentStreak >= 2 && (
              <div 
                id="streak-indicator" 
                className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 animate-pulse"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                <span>{currentStreak} Streak!</span>
              </div>
            )}

            <div 
              id="live-total-score-badge" 
              className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-800"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Score:</span>
              <span className="text-amber-700 font-extrabold text-sm">{currentScore}</span>
              <span className="text-slate-400">/</span>
              <span>{currentIndex}</span>
              {currentIndex > 0 && (
                <span className="text-slate-500 font-normal">({accuracyPercent}%)</span>
              )}
            </div>

            <button
              id="quit-quiz-btn"
              onClick={onQuit}
              className="text-xs text-slate-400 hover:text-red-600 hover:underline transition-colors"
            >
              Quit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            id="quiz-progress-bar"
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Question Prompt */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Question • Pagsusulit</span>
          </div>
          <h2 id="question-text" className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* 4 Interactive Multiple Choice Options */}
        <div id="options-group" className="space-y-3">
          {question.options.map((opt, idx) => {
            const letter = optionLetters[idx];
            const isSelected = selectedOption === opt;
            const isCorrect = opt === question.answer;

            let buttonStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (hasAnswered) {
              if (isCorrect) {
                buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400/30';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                buttonStyle = 'border-slate-100 bg-slate-50/60 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={opt}
                id={`option-btn-${idx}`}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${badgeStyle}`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm sm:text-base font-medium pt-0.5">{opt}</span>
                </div>

                {hasAnswered && (
                  <div className="shrink-0 mt-1">
                    {isCorrect && (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                        <X className="w-4 h-4 text-rose-600" />
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & Scripture Citation */}
        {hasAnswered && (
          <div
            id="answer-feedback-box"
            className={`mt-6 p-4 sm:p-5 rounded-xl border transition-all ${
              selectedOption === question.answer
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {selectedOption === question.answer ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    <Check className="w-3.5 h-3.5" /> TAMA / CORRECT!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    <X className="w-3.5 h-3.5" /> MALI / INCORRECT
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  {question.verse}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Pindutin ang Space o Enter para sumunod</span>
            </div>

            <p className="text-sm font-medium text-slate-800">
              <span className="font-bold">Tamang Sagot:</span> {question.answer}
            </p>

            {question.explanation && (
              <p className="text-xs text-slate-600 mt-1.5 italic bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                {question.explanation}
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        {hasAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              id="next-question-btn"
              type="button"
              onClick={onNext}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{isLastQuestion ? 'Tingnan ang Kabuuang Iskor / Finish' : 'Susunod na Tanong / Next'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
