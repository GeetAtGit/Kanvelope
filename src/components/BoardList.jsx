import React from 'react';
import BoardCard from './BoardCard';

const BoardList = ({ boards, onBoardClick }) => {
  if (!boards || boards.length === 0) {
    return <p className="text-gray-600">No boards found. Create one above!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards
        .filter(Boolean) // Remove null/undefined entries just in case
        .map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onClick={() => onBoardClick(board.id)}
          />
        ))}
    </div>
  );
};

export default BoardList;
