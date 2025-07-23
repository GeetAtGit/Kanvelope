// src/components/BoardForm.jsx
import React, { useEffect, useRef } from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';

export default function BoardForm({
  title,
  setTitle,
  onAdd,           // called with no args for new board
  onUpdate,        // called with updated title when editing
  onDelete,        // called when delete button clicked
  onCancel,        // called to cancel edit
  editingBoard,    // the board object you’re editing (or null)
}) {
  const inputRef = useRef(null);

  // autofocus when switching into edit/add
  useEffect(() => {
    inputRef.current?.focus();
  }, [editingBoard]);

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    if (editingBoard) {
      onUpdate({ ...editingBoard, title: trimmed });
    } else {
      onAdd(trimmed);
    }
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex items-center max-w-lg mx-auto space-x-2"
    >
      {/* Input */}
      <div className="relative flex-grow">
        <label htmlFor="board-title" className="sr-only">
          {editingBoard ? 'Edit board title' : 'New board title'}
        </label>
        <Plus
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          id="board-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={
            editingBoard ? 'Edit board name…' : 'Create new board…'
          }
          className="
            w-full pl-10 pr-4 py-2 
            border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-1 focus:ring-gray-400
            placeholder-gray-400
          "
        />
      </div>

      {/* Buttons */}
      {editingBoard ? (
        <>
          {/* Save */}
          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            title="Save changes"
          >
            <Check size={16} />
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => {
              onCancel();
              setTitle('');
            }}
            className="p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
            title="Cancel"
          >
            <X size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(editingBoard.id)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            title="Delete board"
          >
            <Trash2 size={16} />
          </button>
        </>
      ) : (
        <button
          type="submit"
          disabled={!title.trim()}
          className={`
            flex items-center gap-2 px-4 py-2 
            bg-softGreen/80 text-white font-medium rounded-lg
            hover:bg-softGreen transition
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Plus size={16} />
          Add Board
        </button>
      )}
    </form>
  );
}
