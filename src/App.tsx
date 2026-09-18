import { useState, useEffect, useMemo } from 'react';
import { Header, AppMode } from './components/Header';
import { QuizConfig } from './components/QuizConfig';
import { QuizCard } from './components/QuizCard';
import { ScoreModal } from './components/ScoreModal';
import { FlashcardMode } from './components/FlashcardMode';
import { ReviewerList } from './components/ReviewerList';
import { ScoreHistory } from './components/ScoreHistory';
import { NameEditorModal } from './components/NameEditorModal';
import { GodCenteredBackground } from './components/GodCenteredBackground';
import { Question, UserAnswer, QuizSettings, QuizResultRecord } from './types';
import { MATTHEW_QUESTIONS } from './data/questions';
import { soundManager } from './utils/audio';

const STORAGE_KEY_RECORDS = 'matthew_quiz_records_v1';
const STORAGE_KEY_SETTINGS = 'matthew_quiz_settings_v1';
const STORAGE_KEY_PLAYER_NAME = 'matthew_quiz_player_name_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('quiz');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastRecordId, setLastRecordId] = useState<string>('');

  // Determine if player name is already saved.
  // If saved, ignore automatically (do not pop up).
  // If not saved (empty/null), make the name editor appear when web is opened.
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(() => {
    try {
      const savedPlayer = localStorage.getItem(STORAGE_KEY_PLAYER_NAME);
      return !savedPlayer || savedPlayer.trim().length === 0;
    } catch {
      return false;
    }
  });

  const [isInitialPrompt, setIsInitialPrompt] = useState<boolean>(() => {
    try {
      const savedPlayer = localStorage.getItem(STORAGE_KEY_PLAYER_NAME);
      return !savedPlayer || savedPlayer.trim().length === 0;
    } catch {
      return false;
    }
  });

  // Settings
  const [settings, setSettings] = useState<QuizSettings>(() => {
    let savedPlayer = '';
    try {
      savedPlayer = localStorage.getItem(STORAGE_KEY_PLAYER_NAME) || '';
    } catch {
      // ignore
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          selectedChapter: parsed.selectedChapter || 'all',
          questionCount: parsed.questionCount || 10,
          shuffle: parsed.shuffle ?? true,
          soundEnabled: parsed.soundEnabled ?? true,
          playerName: parsed.playerName || savedPlayer || '',
        };
      }
    } catch {
      // ignore
    }
    return {
      selectedChapter: 'all',
      questionCount: 10,
      shuffle: true,
      soundEnabled: true,
      playerName: savedPlayer || '',
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
        if (partial.playerName !== undefined) {
          localStorage.setItem(STORAGE_KEY_PLAYER_NAME, partial.playerName);
        }
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

    const newRecordId = String(Date.now());
    const finalPlayerName = settings.playerName.trim() || 'Anonymous';

    const newRecord: QuizResultRecord = {
      id: newRecordId,
      playerName: finalPlayerName,
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

    setLastRecordId(newRecordId);

    setRecords(prev => {
      const updated = [newRecord, ...prev].slice(0, 100); // Keep last 100
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setQuizStatus('completed');
  };

  const handleUpdateRecordPlayerName = (recordId: string, newName: string) => {
    const cleanName = newName.trim() || 'Anonymous';

    setRecords(prev => {
      const updated = prev.map(r => (r.id === recordId ? { ...r, playerName: cleanName } : r));
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Update settings so subsequent quizzes retain the name
    handleUpdateSettings({ playerName: cleanName });
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== recordId);
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
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
    if (window.confirm('Sigurado ka bang nais mong burahin ang lahat ng talaan ng iskor sa Leaderboard?')) {
      setRecords([]);
      localStorage.removeItem(STORAGE_KEY_RECORDS);
    }
  };

  // Total score calculation
  const currentScore = useMemo(() => {
    return userAnswers.filter(a => a.isCorrect).length;
  }, [userAnswers]);

  const latestResult = records[0] || null;

  // Modal actions
  const handleSavePlayerNameFromModal = (newName: string) => {
    const cleanName = newName.trim() || 'Anonymous';
    handleUpdateSettings({ playerName: cleanName });
    setIsNameModalOpen(false);
    setIsInitialPrompt(false);
  };

  const handleOpenNameEditor = () => {
    setIsInitialPrompt(false);
    setIsNameModalOpen(true);
  };

  // Top scorer calculation across all records
  const topScorer = useMemo(() => {
    if (records.length === 0) return null;
    return [...records].sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.score - a.score;
    })[0] || null;
  }, [records]);

  return (
    <GodCenteredBackground>
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
        playerName={settings.playerName}
        onOpenNameEditor={handleOpenNameEditor}
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
                topScorer={topScorer}
                onViewLeaderboard={() => setCurrentMode('history')}
                onOpenNameEditor={handleOpenNameEditor}
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
                playerName={settings.playerName}
                recordId={lastRecordId}
                onUpdatePlayerName={handleUpdateRecordPlayerName}
                onRetry={handleStartNewQuiz}
                onRetryMissed={handleRetryMissed}
                onBackToMenu={() => setQuizStatus('idle')}
                onOpenReviewer={() => {
                  setQuizStatus('idle');
                  setCurrentMode('reviewer');
                }}
                onOpenLeaderboard={() => {
                  setQuizStatus('idle');
                  setCurrentMode('history');
                }}
              />
            )}
          </>
        )}

        {/* Study Flashcards Mode */}
        {currentMode === 'flashcards' && <FlashcardMode />}

        {/* Full Question and Answer Reviewer Notes */}
        {currentMode === 'reviewer' && <ReviewerList />}

        {/* Saved Scores / Leaderboard */}
        {currentMode === 'history' && (
          <ScoreHistory
            records={records}
            onClearHistory={handleClearHistory}
            onDeleteRecord={handleDeleteRecord}
            onTakeNewQuiz={() => {
              setCurrentMode('quiz');
              setQuizStatus('idle');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-5 border-t border-amber-900/10 text-center text-xs text-slate-600 bg-amber-50/40 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-serif">
            Interactive Q&A Reviewer • Matthew Chapters 1 to 5 ({MATTHEW_QUESTIONS.length} Questions)
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentMode('history');
                setQuizStatus('idle');
              }}
              className="text-amber-800 hover:underline font-bold flex items-center gap-1"
            >
              Leaderboard & Pinakamataas na Iskor
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentMode('reviewer');
                setQuizStatus('idle');
              }}
              className="text-amber-800 hover:underline font-bold"
            >
              Buksan ang Lahat ng Tanong
            </button>
          </div>
        </div>
      </footer>

      {/* Name Editor Modal */}
      <NameEditorModal
        isOpen={isNameModalOpen}
        currentName={settings.playerName}
        onSaveName={handleSavePlayerNameFromModal}
        onClose={() => setIsNameModalOpen(false)}
        isInitialPrompt={isInitialPrompt}
      />
    </GodCenteredBackground>
  );
}
