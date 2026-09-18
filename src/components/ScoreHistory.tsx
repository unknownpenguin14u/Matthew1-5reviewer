import React from 'react';
import { QuizResultRecord } from '../types';
import { Leaderboard } from './Leaderboard';

interface ScoreHistoryProps {
  records: QuizResultRecord[];
  onClearHistory: () => void;
  onTakeNewQuiz: () => void;
  onDeleteRecord?: (id: string) => void;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  records,
  onClearHistory,
  onTakeNewQuiz,
  onDeleteRecord = () => {},
}) => {
  return (
    <Leaderboard
      records={records}
      onClearHistory={onClearHistory}
      onDeleteRecord={onDeleteRecord}
      onTakeNewQuiz={onTakeNewQuiz}
    />
  );
};

