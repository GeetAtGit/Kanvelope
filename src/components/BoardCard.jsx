// components/BoardCard.jsx
import React from 'react';

const BoardCard = ({ board, onClick }) => {
  if (!board) return null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold mb-1">{board.title}</h2>
      <p className="text-sm text-gray-500">
        Created on{' '}
        {board.createdAt?.seconds
          ? new Date(board.createdAt.seconds * 1000).toDateString()
          : 'Unknown'}
      </p>
    </div>
  );
};

export default BoardCard;
