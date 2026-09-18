import React, { useState, useMemo } from 'react';
import { QuizResultRecord, MatthewChapter } from '../types';
import { Trophy, Medal, Crown, Award, Search, Trash2, Calendar, ArrowRight, BookOpen, Star, Sparkles, User, Filter } from 'lucide-react';

interface LeaderboardProps {
  records: QuizResultRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onTakeNewQuiz: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  records,
  onClearHistory,
  onDeleteRecord,
  onTakeNewQuiz,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<'all' | MatthewChapter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'highest' | 'recent'>('highest');

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let list = [...records];

    // Chapter filter
    if (selectedChapter !== 'all') {
      const targetStr = `Matthew Chapter ${selectedChapter}`;
      list = list.filter(r => r.chapter.includes(targetStr) || r.chapter.includes(String(selectedChapter)));
    }

    // Search player query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => (r.playerName || 'Anonymous').toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'highest') {
      list.sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return b.score - a.score;
      });
    } else {
      // Recent (id is Date.now())
      list.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return list;
  }, [records, selectedChapter, searchQuery, sortBy]);

  // Overall top 3 for the podium (based on highest score across all or selected chapter)
  const topThree = useMemo(() => {
    let pool = [...records];
    if (selectedChapter !== 'all') {
      const targetStr = `Matthew Chapter ${selectedChapter}`;
      pool = pool.filter(r => r.chapter.includes(targetStr) || r.chapter.includes(String(selectedChapter)));
    }
    return pool.sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.score - a.score;
    }).slice(0, 3);
  }, [records, selectedChapter]);

  // Stats calculation
  const highestScore = records.length > 0 ? Math.max(...records.map(r => r.percentage)) : 0;
  const topPlayer = records.find(r => r.percentage === highestScore);
  const averageScore = records.length > 0
    ? Math.round(records.reduce((acc, curr) => acc + curr.percentage, 0) / records.length)
    : 0;

  return (
    <div id="leaderboard-container" className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Scoreboard • Leaderboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Who Has the Highest Score?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            View the ranking of Matthew 1–5 quiz takers with their names and points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="leaderboard-take-quiz-btn"
            type="button"
            onClick={onTakeNewQuiz}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Kumuha ng Quiz</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          {records.length > 0 && (
            <button
              id="clear-all-records-btn"
              type="button"
              onClick={onClearHistory}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Burahin ang lahat ng talaan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {records.length > 0 ? (
        <>
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-2xs">
                <Crown className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pinakamataas na Iskor</p>
                <p className="text-base font-extrabold text-slate-900 truncate">
                  {highestScore}% {topPlayer?.playerName ? `(${topPlayer.playerName})` : ''}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Katamtamang Iskor</p>
                <p className="text-base font-extrabold text-slate-900">{averageScore}% Average</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-2xs">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Kabuuang Natapos</p>
                <p className="text-base font-extrabold text-slate-900">{records.length} Pagsusulit</p>
              </div>
            </div>
          </div>

          {/* Top 3 Podium (Hall of Fame) */}
          {topThree.length > 0 && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bulwagan ng Karangalan • Hall of Fame
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Nangungunang mga Iskolar sa Mateo 1–5
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
                  {/* Rank 2 (Silver) */}
                  {topThree[1] ? (
                    <div className="order-2 sm:order-1 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-900 font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-xs">
                        🥈 2
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {topThree[1].playerName || 'Anonymous'}
                      </h4>
                      <p className="text-xl font-extrabold text-slate-200 mt-1">
                        {topThree[1].percentage}%
                      </p>
                      <p className="text-xs text-slate-400">
                        {topThree[1].score}/{topThree[1].totalQuestions} • {topThree[1].chapter}
                      </p>
                    </div>
                  ) : (
                    <div className="order-2 sm:order-1 hidden sm:block p-4" />
                  )}

                  {/* Rank 1 (Gold - Elevated) */}
                  {topThree[0] && (
                    <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/25 to-slate-800/90 border-2 border-amber-400/80 rounded-3xl p-5 text-center shadow-lg relative -mt-2 sm:-mt-4">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3" /> Champion
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center mx-auto mb-2 shadow-md">
                        🥇 1
                      </div>
                      <h4 className="text-base font-extrabold text-amber-300 truncate">
                        {topThree[0].playerName || 'Anonymous'}
                      </h4>
                      <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                        {topThree[0].percentage}%
                      </p>
                      <p className="text-xs text-amber-200/80 font-medium">
                        {topThree[0].score}/{topThree[0].totalQuestions} pts • {topThree[0].chapter}
                      </p>
                    </div>
                  )}

                  {/* Rank 3 (Bronze) */}
                  {topThree[2] ? (
                    <div className="order-3 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-700 text-amber-100 font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-xs">
                        🥉 3
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {topThree[2].playerName || 'Anonymous'}
                      </h4>
                      <p className="text-xl font-extrabold text-slate-200 mt-1">
                        {topThree[2].percentage}%
                      </p>
                      <p className="text-xs text-slate-400">
                        {topThree[2].score}/{topThree[2].totalQuestions} • {topThree[2].chapter}
                      </p>
                    </div>
                  ) : (
                    <div className="order-3 hidden sm:block p-4" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search Bar */}
          <div className="bg-white/95 rounded-2xl p-4 border border-amber-200/80 shadow-[0_2px_15px_rgba(217,119,6,0.04)] mb-6 space-y-3 backdrop-blur-xs">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="leaderboard-search-input"
                  type="text"
                  placeholder="Maghanap ng pangalan ng manlalaro (e.g. Juan, Maria)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
                />
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
                <button
                  id="sort-highest-btn"
                  type="button"
                  onClick={() => setSortBy('highest')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sortBy === 'highest'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pinakamataas (Highest)
                </button>
                <button
                  id="sort-recent-btn"
                  type="button"
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sortBy === 'recent'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pinakabago (Recent)
                </button>
              </div>
            </div>

            {/* Chapter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-slate-100 pt-2.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Kabanata:
              </span>
              <button
                id="filter-ch-all"
                type="button"
                onClick={() => setSelectedChapter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  selectedChapter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lahat
              </button>
              {([1, 2, 3, 4, 5] as MatthewChapter[]).map(ch => (
                <button
                  key={ch}
                  id={`filter-ch-${ch}`}
                  type="button"
                  onClick={() => setSelectedChapter(ch)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    selectedChapter === ch
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Matthew {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="space-y-2.5">
            {filteredAndSortedRecords.map((record, index) => {
              const isPerfect = record.percentage === 100;
              const isFirst = index === 0 && sortBy === 'highest';
              const isSecond = index === 1 && sortBy === 'highest';
              const isThird = index === 2 && sortBy === 'highest';

              const rankDisplay = isFirst ? '🥇 #1' : isSecond ? '🥈 #2' : isThird ? '🥉 #3' : `#${index + 1}`;

              return (
                <div
                  key={record.id}
                  id={`leaderboard-row-${record.id}`}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all ${
                    isFirst
                      ? 'border-amber-400 bg-amber-50/25 ring-1 ring-amber-300/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: Rank & Player info */}
                  <div className="flex items-center gap-3.5">
                    <span className="w-12 text-center text-xs font-extrabold text-slate-700 bg-slate-100 py-1.5 px-2 rounded-xl shrink-0">
                      {rankDisplay}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {(record.playerName || 'A').charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {record.playerName || 'Anonymous Player'}
                        </h4>
                        {isPerfect && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Perfect 100%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700">{record.chapter}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {record.date}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Score & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 ml-14 sm:ml-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          {record.percentage}%
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({record.score}/{record.totalQuestions} pts)
                        </span>
                      </div>
                      <div className="w-28 sm:w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          className={`h-full rounded-full ${
                            record.percentage >= 80 ? 'bg-emerald-500' : record.percentage >= 50 ? 'bg-amber-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${record.percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      id={`delete-record-${record.id}`}
                      type="button"
                      onClick={() => onDeleteRecord(record.id)}
                      className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Burahin ang iskor na ito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedRecords.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-sm font-semibold text-slate-600">
                  Walang natagpuang manlalaro o iskor para sa napiling filter.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedChapter('all'); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  I-reset ang Filter
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Wala pang nakatalang iskor sa Leaderboard
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Maging unang maglagay ng iyong pangalan at magtala ng pinakamataas na iskor mula sa Mateo 1–5!
          </p>
          <button
            id="start-first-quiz-btn"
            type="button"
            onClick={onTakeNewQuiz}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Simulan ang Pagsusulit Ngayon</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
};
