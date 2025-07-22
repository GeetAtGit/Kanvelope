// components/BoardForm.jsx
import React from 'react';

const BoardForm = ({ title, setTitle, handleAddBoard }) => (
  <form onSubmit={handleAddBoard} className="mb-6 flex gap-4">
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="New board title"
      className="px-4 py-2 border rounded w-full"
    />
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
      Add Board
    </button>
  </form>
);

export default BoardForm;
