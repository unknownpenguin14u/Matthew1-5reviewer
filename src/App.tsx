import { useState, useEffect, useMemo } from 'react';
import { Header, AppMode } from './components/Header';
import { QuizConfig } from './components/QuizConfig';
import { QuizCard } from './components/QuizCard';
import { ScoreModal } from './components/ScoreModal';
import { FlashcardMode } from './components/FlashcardMode';
import { ReviewerList } from './components/ReviewerList';
import { ScoreHistory } from './components/ScoreHistory';
import { Question, UserAnswer, QuizSettings, QuizResultRecord } from './types';
import { MATTHEW_QUESTIONS, CHAPTER_SUMMARIES } from './data/questions';
import { soundManager } from './utils/audio';

const STORAGE_KEY_RECORDS = 'matthew_quiz_records_v1';
const STORAGE_KEY_SETTINGS = 'matthew_quiz_settings_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('quiz');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Settings
  const [settings, setSettings] = useState<QuizSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      selectedChapter: 'all',
      questionCount: 10,
      shuffle: true,
      soundEnabled: true,
    };
  });

  // Score records history
  const [records, setRecords] = useState<QuizResultRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Active quiz session state
  const [quizStatus, setQuizStatus] = useState<'idle' | 'in_progress' | 'completed'>('idle');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Sync sound settings
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setSettings(prev => ({ ...prev, soundEnabled: next }));
  };

  const handleUpdateSettings = (partial: Partial<QuizSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Helper to shuffle an array
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Prepare & start quiz
  const startQuizWithQuestions = (questionsPool: Question[]) => {
    let pool = [...questionsPool];
    if (settings.shuffle) {
      pool = shuffleArray(pool).map(q => ({
        ...q,
        options: shuffleArray(q.options),
      }));
    }

    const count = Math.min(settings.questionCount, pool.length);
    const selected = pool.slice(0, count);

    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentStreak(0);
    setQuizStatus('in_progress');
    setCurrentMode('quiz');
  };

  const handleStartNewQuiz = () => {
    let pool = settings.selectedChapter === 'all'
      ? MATTHEW_QUESTIONS
      : MATTHEW_QUESTIONS.filter(q => q.chapter === settings.selectedChapter);

    startQuizWithQuestions(pool);
  };

  // Live answer recording
  const handleAnswerQuestion = (selectedOption: string, isCorrect: boolean) => {
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOption,
        isCorrect,
        timeSpentSeconds: 0,
      },
    ]);

    if (isCorrect) {
      setCurrentStreak(s => s + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Calculate total score
    const totalCorrect = userAnswers.filter(a => a.isCorrect).length;
    const totalCount = activeQuestions.length;
    const percent = Math.round((totalCorrect / totalCount) * 100);

    const chapterLabel = settings.selectedChapter === 'all'
      ? 'All Chapters (1–5)'
      : `Matthew Chapter ${settings.selectedChapter}`;

    const newRecord: QuizResultRecord = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      chapter: chapterLabel,
      score: totalCorrect,
      totalQuestions: totalCount,
      percentage: percent,
      timeTakenSeconds: 0,
    };

    setRecords(prev => {
      const updated = [newRecord, ...prev].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setQuizStatus('completed');
  };

  const handleRetryMissed = (missedList: Question[]) => {
    startQuizWithQuestions(missedList);
  };

  const handleQuitQuiz = () => {
    if (window.confirm('Nais mo bang huminto at bumalik sa menu? / Do you want to quit the quiz?')) {
      setQuizStatus('idle');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Sigurado ka bang nais mong burahin ang lahat ng talaan ng iskor?')) {
      setRecords([]);
      localStorage.removeItem(STORAGE_KEY_RECORDS);
    }
  };

  // Total score calculation
  const currentScore = useMemo(() => {
    return userAnswers.filter(a => a.isCorrect).length;
  }, [userAnswers]);

  const latestResult = records[0] || null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      <Header
        currentMode={currentMode}
        onSelectMode={mode => {
          setCurrentMode(mode);
          if (mode !== 'quiz') {
            setQuizStatus('idle');
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 w-full pb-12">
        {/* Quiz Mode */}
        {currentMode === 'quiz' && (
          <>
            {quizStatus === 'idle' && (
              <QuizConfig
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onStartQuiz={handleStartNewQuiz}
                latestResult={latestResult}
              />
            )}

            {quizStatus === 'in_progress' && activeQuestions[currentQuestionIndex] && (
              <QuizCard
                question={activeQuestions[currentQuestionIndex]}
                currentIndex={currentQuestionIndex}
                totalQuestions={activeQuestions.length}
                currentScore={currentScore}
                currentStreak={currentStreak}
                onAnswer={handleAnswerQuestion}
                onNext={handleNextQuestion}
                onQuit={handleQuitQuiz}
                isLastQuestion={currentQuestionIndex === activeQuestions.length - 1}
              />
            )}

            {quizStatus === 'completed' && (
              <ScoreModal
                score={currentScore}
                totalQuestions={activeQuestions.length}
                questions={activeQuestions}
                userAnswers={userAnswers}
                onRetry={handleStartNewQuiz}
                onRetryMissed={handleRetryMissed}
                onBackToMenu={() => setQuizStatus('idle')}
                onOpenReviewer={() => {
                  setQuizStatus('idle');
                  setCurrentMode('reviewer');
                }}
              />
            )}
          </>
        )}

        {/* Study Flashcards Mode */}
        {currentMode === 'flashcards' && <FlashcardMode />}

        {/* Full Question and Answer Reviewer Notes */}
        {currentMode === 'reviewer' && <ReviewerList />}

        {/* Saved Scores History */}
        {currentMode === 'history' && (
          <ScoreHistory
            records={records}
            onClearHistory={handleClearHistory}
            onTakeNewQuiz={() => {
              setCurrentMode('quiz');
              setQuizStatus('idle');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white/60">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <p>
            Interactive Q&A Reviewer • Matthew Chapters 1 to 5 ({MATTHEW_QUESTIONS.length} Questions)
          </p>
          <div className="flex items-center gap-3">
            <span>KJV / Tagalog Reviewer</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentMode('reviewer');
                setQuizStatus('idle');
              }}
              className="text-amber-600 hover:underline font-semibold"
            >
              Buksan ang Lahat ng Tanong
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
