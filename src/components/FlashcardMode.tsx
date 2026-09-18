import React, { useState } from 'react';
import { MatthewChapter } from '../types';
import { MATTHEW_QUESTIONS } from '../data/questions';
import { BookOpen, Check, RefreshCw, ChevronLeft, ChevronRight, Shuffle, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const FlashcardMode: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<'all' | MatthewChapter>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [shuffleTrigger, setShuffleTrigger] = useState<number>(0);

  const baseQuestions = selectedChapter === 'all'
    ? MATTHEW_QUESTIONS
    : MATTHEW_QUESTIONS.filter(q => q.chapter === selectedChapter);

  // Memoized or ordered questions
  const questions = React.useMemo(() => {
    if (shuffleTrigger === 0) return [...baseQuestions];
    return [...baseQuestions].sort(() => Math.random() - 0.5);
  }, [baseQuestions, shuffleTrigger]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(questions.length - 1);
    }
  };

  const handleMarkMastered = () => {
    if (!currentQ) return;
    soundManager.playCorrect();
    setMasteredIds(prev => {
      const next = new Set(prev);
      next.add(currentQ.id);
      return next;
    });
    handleNext();
  };

  const handleMarkNeedReview = () => {
    if (!currentQ) return;
    soundManager.playIncorrect();
    setMasteredIds(prev => {
      const next = new Set(prev);
      next.delete(currentQ.id);
      return next;
    });
    handleNext();
  };

  const handleResetMastery = () => {
    setMasteredIds(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div id="flashcards-container" className="max-w-3xl mx-auto px-4 py-8">
      {/* Chapter Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            id="fc-chapter-all"
            type="button"
            onClick={() => { setSelectedChapter('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedChapter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lahat (1–5)
          </button>
          {([1, 2, 3, 4, 5] as MatthewChapter[]).map(ch => (
            <button
              key={ch}
              id={`fc-chapter-${ch}`}
              type="button"
              onClick={() => { setSelectedChapter(ch); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                selectedChapter === ch
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Matthew {ch}
            </button>
          ))}
        </div>

        <button
          id="fc-shuffle-btn"
          type="button"
          onClick={() => { setShuffleTrigger(prev => prev + 1); setCurrentIndex(0); setIsFlipped(false); }}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1"
          title="Shuffle cards"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      {/* Mastery Score Progress */}
      <div className="flex items-center justify-between gap-3 mb-3 text-xs">
        <span className="text-slate-500 font-medium">
          Card {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Mastered: {masteredIds.size} / {questions.length}
          </span>
          {masteredIds.size > 0 && (
            <button
              onClick={handleResetMastery}
              className="text-slate-400 hover:text-slate-600"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* The Flashcard */}
      <div
        id="interactive-flashcard"
        onClick={() => { soundManager.playClick(); setIsFlipped(!isFlipped); }}
        className="w-full min-h-[320px] sm:min-h-[360px] bg-white/95 rounded-3xl border-2 border-amber-200/90 hover:border-amber-400 shadow-[0_8px_30px_rgba(217,119,6,0.08)] p-6 sm:p-10 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-xl relative overflow-hidden backdrop-blur-xs"
      >
        {/* Top badge */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Matthew Chapter {currentQ.chapter}
          </span>
          <span className="flex items-center gap-1 text-amber-600">
            <RefreshCw className="w-3.5 h-3.5" />
            {isFlipped ? 'I-click para bumalik sa tanong' : 'I-click upang makita ang sagot'}
          </span>
        </div>

        {/* Card Body */}
        <div className="my-auto py-6 text-center">
          {!isFlipped ? (
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Tanong / Question</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                {currentQ.verse}
              </span>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tamang Sagot</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 leading-snug">
                  {currentQ.answer}
                </h3>
              </div>

              {currentQ.explanation && (
                <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200/70 max-w-lg mx-auto">
                  {currentQ.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Card Footer prompt */}
        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-100">
          {!isFlipped ? 'I-tap ang kard para ibunyag ang sagot at talata' : 'Gamitin ang mga button sa ibaba upang i-record ang iyong progreso'}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            id="fc-prev-btn"
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
            title="Previous question"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="fc-next-btn"
            type="button"
            onClick={handleNext}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
            title="Next question"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="fc-need-review-btn"
            type="button"
            onClick={handleMarkNeedReview}
            className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs sm:text-sm font-bold hover:bg-rose-100 shadow-xs cursor-pointer transition-all"
          >
            Kailangan Pang Pag-aralan
          </button>
          <button
            id="fc-mastered-btn"
            type="button"
            onClick={handleMarkMastered}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Kabisado Ko Na!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
