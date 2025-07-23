// src/components/AddListForm.jsx
import React, { useState } from 'react';

const AddListForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring"
        placeholder="List title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="w-full bg-softGreen/80 text-white py-2 rounded hover:bg-softGreen transition"
      >
        Create List
      </button>
    </form>
  );
};

export default AddListForm;
