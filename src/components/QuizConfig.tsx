import React from 'react';
import { MatthewChapter, QuizSettings, QuizResultRecord } from '../types';
import { MATTHEW_QUESTIONS, CHAPTER_SUMMARIES } from '../data/questions';
import { Play, Sparkles, BookOpen, CheckCircle, Shuffle } from 'lucide-react';

interface QuizConfigProps {
  settings: QuizSettings;
  onUpdateSettings: (newSettings: Partial<QuizSettings>) => void;
  onStartQuiz: () => void;
  latestResult: QuizResultRecord | null;
}

export const QuizConfig: React.FC<QuizConfigProps> = ({
  settings,
  onUpdateSettings,
  onStartQuiz,
  latestResult,
}) => {
  const chapterFilter = settings.selectedChapter;
  const filteredQuestions = chapterFilter === 'all'
    ? MATTHEW_QUESTIONS
    : MATTHEW_QUESTIONS.filter(q => q.chapter === chapterFilter);

  const availableCounts = [5, 10, 20, 30, filteredQuestions.length].filter(
    (val, idx, arr) => arr.indexOf(val) === idx && val <= filteredQuestions.length
  );

  return (
    <div id="quiz-config-container" className="max-w-3xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Interactive Bible Reviewer • Matthew 1 to 5
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Question & Answer Quiz with Live Scoring
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Subukin ang iyong kaalaman mula sa Ebanghelyo ni Mateo Kabanata 1 hanggang 5. Sagutin ang mga tanong at subaybayan ang iyong kabuuang iskor!
        </p>
      </div>

      {/* Latest Score Card (if any) */}
      {latestResult && (
        <div id="previous-score-banner" className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              {latestResult.percentage}%
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Previous Score</p>
              <p className="text-sm font-medium text-slate-200">
                {latestResult.score} out of {latestResult.totalQuestions} ({latestResult.chapter})
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-medium px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
            {latestResult.percentage >= 80 ? '🌟 Excellent' : latestResult.percentage >= 50 ? '👍 Good Job' : '📖 Review & Try Again'}
          </span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-7">
        {/* Section 1: Choose Chapter */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">
            1. Piliin ang Kabanata / Choose Chapter
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              id="chapter-all-btn"
              type="button"
              onClick={() => onUpdateSettings({ selectedChapter: 'all' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                settings.selectedChapter === 'all'
                  ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">All Chapters</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {MATTHEW_QUESTIONS.length} Qs
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Kabanata 1 hanggang 5</p>
            </button>

            {([1, 2, 3, 4, 5] as MatthewChapter[]).map(ch => {
              const summary = CHAPTER_SUMMARIES[ch];
              const isSelected = settings.selectedChapter === ch;
              return (
                <button
                  key={ch}
                  id={`chapter-${ch}-btn`}
                  type="button"
                  onClick={() => onUpdateSettings({ selectedChapter: ch })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{summary.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {summary.count} Qs
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{summary.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Chapter thematic note */}
          {settings.selectedChapter !== 'all' && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-amber-900">
                  {CHAPTER_SUMMARIES[settings.selectedChapter].subtitle}:
                </span>{' '}
                {CHAPTER_SUMMARIES[settings.selectedChapter].theme}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Number of Questions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-800">
              2. Bilang ng mga Tanong / Number of Questions
            </label>
            <span className="text-xs text-slate-500">
              {filteredQuestions.length} available
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {availableCounts.map(count => {
              const isAll = count === filteredQuestions.length;
              const isSelected = settings.questionCount === count || (settings.questionCount > filteredQuestions.length && isAll);
              return (
                <button
                  key={count}
                  id={`q-count-${count}-btn`}
                  type="button"
                  onClick={() => onUpdateSettings({ questionCount: count })}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {isAll ? `All (${count})` : `${count} Questions`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Shuffle Questions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Pagsalit-salitin ang mga Tanong (Shuffle)</span>
          </div>
          <button
            id="toggle-shuffle-btn"
            type="button"
            onClick={() => onUpdateSettings({ shuffle: !settings.shuffle })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.shuffle ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
                settings.shuffle ? 'left-6.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            id="start-quiz-btn"
            type="button"
            onClick={onStartQuiz}
            className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>Simulan ang Pagsusulit / Start Quiz</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xs font-bold text-slate-800">Instant Answer Feedback</p>
          <p className="text-[11px] text-slate-500">Agad na malalaman kung tama o mali kasama ang talata</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
          <p className="text-xs font-bold text-slate-800">Live Total Score</p>
          <p className="text-[11px] text-slate-500">Real-time score tally, accuracy, at completion summary</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <BookOpen className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
          <p className="text-xs font-bold text-slate-800">Exact Verse Citations</p>
          <p className="text-[11px] text-slate-500">Bawat tanong ay nakabatay sa Matthew 1 to 5 notes</p>
        </div>
      </div>
    </div>
  );
};
