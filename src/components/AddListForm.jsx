import React, { useState } from 'react';

const AddListForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-64 min-w-[16rem] bg-white p-4 rounded shadow"
    >
      <input
        type="text"
        className="w-full px-2 py-1 border rounded mb-2"
        placeholder="New list title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
      >
        Add List
      </button>
    </form>
  );
};

export default AddListForm;
