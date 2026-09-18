import React, { useState } from 'react';
import { MatthewChapter } from '../types';
import { MATTHEW_QUESTIONS, CHAPTER_SUMMARIES } from '../data/questions';
import { Search, BookOpen, Check, Copy } from 'lucide-react';

export const ReviewerList: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<'all' | MatthewChapter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = MATTHEW_QUESTIONS.filter(q => {
    const matchesChapter = selectedChapter === 'all' || q.chapter === selectedChapter;
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      q.question.toLowerCase().includes(qLower) ||
      q.answer.toLowerCase().includes(qLower) ||
      q.verse.toLowerCase().includes(qLower);
    return matchesChapter && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="reviewer-list-container" className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kumpletong Reviewer • Matthew Chapters 1–5
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Lahat ng tanong at sagot mula sa orihinal na reviewer notes na may kaukulang talata sa Banal na Kasulatan.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/95 rounded-2xl p-4 border border-amber-200/80 shadow-[0_2px_15px_rgba(217,119,6,0.04)] mb-6 space-y-3 backdrop-blur-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="reviewer-search-input"
            type="text"
            placeholder="Maghanap ng tanong, sagot, o talata (hal. Herod, Jordan, Beatitudes, Jesus)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              id="rev-chapter-all"
              type="button"
              onClick={() => setSelectedChapter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                selectedChapter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lahat ({MATTHEW_QUESTIONS.length})
            </button>
            {([1, 2, 3, 4, 5] as MatthewChapter[]).map(ch => (
              <button
                key={ch}
                id={`rev-chapter-${ch}`}
                type="button"
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  selectedChapter === ch
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Ch {ch} ({CHAPTER_SUMMARIES[ch].count})
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Ipinapakita ang {filtered.length} tanong
          </span>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filtered.map((item, index) => (
          <div
            key={item.id}
            id={`reviewer-card-${item.id}`}
            className="bg-white/95 rounded-2xl border border-amber-200/80 p-5 shadow-[0_2px_15px_rgba(217,119,6,0.04)] hover:border-amber-400 transition-colors backdrop-blur-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold">
                  #{index + 1}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  {item.verse}
                </span>
              </div>

              <button
                id={`copy-btn-${item.id}`}
                type="button"
                onClick={() => handleCopy(item.id, `Q: ${item.question}\nA: ${item.answer} (${item.verse})`)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Kopyahin ang tanong at sagot"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              {item.question}
            </h3>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-emerald-950">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                Sagot (Answer):
              </span>
              <p className="text-sm font-semibold">{item.answer}</p>
            </div>

            {item.explanation && (
              <p className="text-xs text-slate-500 italic mt-2.5 flex items-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{item.explanation}</span>
              </p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 font-medium">Walang natagpuang tanong na tugma sa iyong paghahanap.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedChapter('all'); }}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              I-clear ang Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
