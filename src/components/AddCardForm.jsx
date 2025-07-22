import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddCardForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content);
    setContent('');
    setIsOpen(false);
  };

  return (
    <div className="mt-2">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1"
        >
          <Plus size={14} /> Add Card
        </button>
      )}

      {/* Animated Card Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.form
            key="card-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded text-sm resize-none"
              placeholder="Enter card content..."
              autoFocus
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setContent('');
                }}
                className="text-gray-600 hover:text-red-500"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCardForm;
