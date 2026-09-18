import React, { useEffect, useState } from 'react';
import { Question, UserAnswer, MatthewChapter } from '../types';
import { Award, RotateCcw, CheckCircle, XCircle, BookOpen, AlertCircle, ArrowLeft, Trophy, User, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface ScoreModalProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  playerName: string;
  recordId: string;
  onUpdatePlayerName: (recordId: string, newName: string) => void;
  onRetry: () => void;
  onRetryMissed: (missedQuestions: Question[]) => void;
  onBackToMenu: () => void;
  onOpenReviewer: () => void;
  onOpenLeaderboard: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  score,
  totalQuestions,
  questions,
  userAnswers,
  playerName,
  recordId,
  onUpdatePlayerName,
  onRetry,
  onRetryMissed,
  onBackToMenu,
  onOpenReviewer,
  onOpenLeaderboard,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'missed' | 'correct'>('all');
  const [editingName, setEditingName] = useState<string>(playerName || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const percentage = Math.round((score / totalQuestions) * 100);

  // Trigger celebration effects
  useEffect(() => {
    soundManager.playComplete();

    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
        });
      } catch {
        // ignore
      }
    }
  }, [percentage]);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editingName.trim() || 'Anonymous';
    onUpdatePlayerName(recordId, trimmed);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Breakdown by chapter
  const chapterBreakdown: Record<MatthewChapter, { total: number; correct: number }> = {
    1: { total: 0, correct: 0 },
    2: { total: 0, correct: 0 },
    3: { total: 0, correct: 0 },
    4: { total: 0, correct: 0 },
    5: { total: 0, correct: 0 },
  };

  questions.forEach(q => {
    const ans = userAnswers.find(a => a.questionId === q.id);
    if (ans) {
      chapterBreakdown[q.chapter].total += 1;
      if (ans.isCorrect) {
        chapterBreakdown[q.chapter].correct += 1;
      }
    }
  });

  // Missed questions
  const missedQuestionIds = new Set(userAnswers.filter(a => !a.isCorrect).map(a => a.questionId));
  const missedQuestions = questions.filter(q => missedQuestionIds.has(q.id));

  // Filtered review list
  const reviewItems = questions.filter(q => {
    const ans = userAnswers.find(a => a.questionId === q.id);
    if (!ans) return false;
    if (filterMode === 'missed') return !ans.isCorrect;
    if (filterMode === 'correct') return ans.isCorrect;
    return true;
  });

  // Performance tier
  let gradeTitle = 'Magpatuloy sa Pag-aaral!';
  let gradeSubtitle = 'Rebyuhin ang mga talata at subukang muli.';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';

  if (percentage >= 90) {
    gradeTitle = 'Napakagaling! / Biblical Scholar!';
    gradeSubtitle = 'Kahanga-hanga ang iyong kabuuang kabatiran sa Mateo 1–5!';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  } else if (percentage >= 75) {
    gradeTitle = 'Napakahusay! / Great Mastery!';
    gradeSubtitle = 'Matibay at malinaw ang iyong pagkaunawa sa mga kabanata.';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
  } else if (percentage >= 50) {
    gradeTitle = 'Magandang Pagsisikap! / Good Job!';
    gradeSubtitle = 'Nasa tamang landas ka! May ilang talata pang puwedeng patatagin.';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  }

  return (
    <div id="quiz-results-container" className="max-w-3xl mx-auto px-4 py-8">
      {/* Total Score Summary Card */}
      <div className="bg-white/95 rounded-3xl shadow-[0_8px_35px_rgba(217,119,6,0.08)] border border-amber-200/80 overflow-hidden mb-8 backdrop-blur-xs">
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${badgeColor}`}>
              <Award className="w-3.5 h-3.5" />
              {gradeTitle}
            </span>

            {playerName && (
              <p className="text-amber-400 font-bold text-sm tracking-wide mb-1">
                Puntos para kay: <span className="underline decoration-amber-400/50">{playerName}</span>
              </p>
            )}

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Kabuuang Iskor / Total Score
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
              {gradeSubtitle}
            </p>

            {/* Big Score Numbers */}
            <div className="inline-flex items-baseline gap-2 bg-slate-800/80 px-8 py-4 rounded-2xl border border-slate-700/80">
              <span id="final-score-value" className="text-4xl sm:text-5xl font-black text-amber-400">
                {score}
              </span>
              <span className="text-xl text-slate-400 font-bold">/ {totalQuestions}</span>
              <span className="ml-3 text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-3 items-center justify-center">
          <button
            id="retry-quiz-btn"
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Subukang Muli / Retry</span>
          </button>

          {missedQuestions.length > 0 && (
            <button
              id="retry-missed-btn"
              type="button"
              onClick={() => onRetryMissed(missedQuestions)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Ulitin ang mga Mali ({missedQuestions.length})</span>
            </button>
          )}

          <button
            id="modal-leaderboard-btn"
            type="button"
            onClick={onOpenLeaderboard}
            className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Leaderboard</span>
          </button>

          <button
            id="open-reviewer-btn"
            type="button"
            onClick={onOpenReviewer}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Reviewer Notes</span>
          </button>

          <button
            id="back-menu-btn"
            type="button"
            onClick={onBackToMenu}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* Leaderboard Name Registration Card */}
        <div className="p-4 sm:p-6 bg-amber-50/40 border-b border-amber-200/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Itala sa Talaan ng Pinakamataas (Leaderboard)</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Kumpirmahin o palitan ang pangalan na lilitaw sa opisyal na Leaderboard.
              </p>
            </div>

            <form onSubmit={handleSaveName} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="modal-player-name-input"
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  placeholder="Ipasok ang iyong pangalan..."
                  maxLength={30}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                id="save-leaderboard-name-btn"
                type="submit"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Na-save!' : 'I-save'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Chapter Performance Breakdown */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Pagganap Bawat Kabanata / Chapter Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {([1, 2, 3, 4, 5] as MatthewChapter[]).map(ch => {
              const data = chapterBreakdown[ch];
              if (data.total === 0) return null;
              const chPercent = Math.round((data.correct / data.total) * 100);
              return (
                <div key={ch} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-700">Matthew {ch}</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-slate-900">{data.correct}</span>
                    <span className="text-xs text-slate-500">/ {data.total}</span>
                    <span className="text-xs font-semibold ml-auto text-amber-600">{chPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${chPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Review Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Pagsusuri ng mga Sagot / Answer Review</span>
            <span className="text-xs font-normal text-slate-500">({reviewItems.length} questions)</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              id="filter-all-btn"
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lahat ({questions.length})
            </button>
            <button
              id="filter-missed-btn"
              type="button"
              onClick={() => setFilterMode('missed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'missed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mali ({missedQuestions.length})
            </button>
            <button
              id="filter-correct-btn"
              type="button"
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tama ({score})
            </button>
          </div>
        </div>

        {/* Review Questions List */}
        <div className="space-y-4">
          {reviewItems.map((q, idx) => {
            const userAns = userAnswers.find(a => a.questionId === q.id);
            const isCorrect = userAns?.isCorrect;

            return (
              <div
                key={q.id}
                id={`review-item-${q.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-rose-50/40 border-rose-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                      {q.verse}
                    </span>
                  </div>

                  <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCorrect ? '+1 Puntos' : '0 Puntos'}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-2">
                  {q.question}
                </p>

                <div className="space-y-1 text-xs">
                  {!isCorrect && userAns && (
                    <div className="text-rose-700 font-medium">
                      <span className="font-bold">Iyong Sagot:</span> {userAns.selectedOption}
                    </div>
                  )}
                  <div className="text-emerald-800 font-medium">
                    <span className="font-bold">Tamang Sagot:</span> {q.answer}
                  </div>
                  {q.explanation && (
                    <div className="text-slate-600 italic pt-1 border-t border-slate-200/60 mt-2">
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
