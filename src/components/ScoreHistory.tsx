import React from 'react';
import { QuizResultRecord } from '../types';
import { Award, Trash2, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

interface ScoreHistoryProps {
  records: QuizResultRecord[];
  onClearHistory: () => void;
  onTakeNewQuiz: () => void;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  records,
  onClearHistory,
  onTakeNewQuiz,
}) => {
  return (
    <div id="score-history-container" className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Talaan ng mga Iskor / Score Records
          </h2>
          <p className="text-sm text-slate-600">
            Kasaysayan ng iyong mga natapos na pagsusulit sa Mateo 1–5
          </p>
        </div>

        {records.length > 0 && (
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClearHistory}
            className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Burahin ang Talaan</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Wala pang nakatalang iskor</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Kumuha ng pagsusulit upang maitala ang iyong iskor at makita ang iyong pag-unlad!
          </p>
          <button
            id="start-first-quiz-btn"
            type="button"
            onClick={onTakeNewQuiz}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Kumuha ng Pagsusulit Ngayon</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => {
            const isHigh = record.percentage >= 80;
            return (
              <div
                key={record.id}
                id={`record-card-${record.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                      isHigh
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : record.percentage >= 50
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {record.percentage}%
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {record.score} out of {record.totalQuestions} Points
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{record.chapter}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {record.date}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isHigh
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isHigh ? 'Pasado / Mastered' : 'Completed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
