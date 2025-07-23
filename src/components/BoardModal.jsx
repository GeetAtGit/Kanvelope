// src/components/BoardModal.jsx
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition }       from '@headlessui/react';
import { X, Trash2, Loader2 }       from 'lucide-react';

export default function BoardModal({
  isOpen,
  board,
  onClose,
  onSave,
  onDelete,
}) {
  const [title, setTitle]             = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading]         = useState(false);
  const closeRef                       = useRef(null);

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setConfirmDelete(false);
    }
  }, [board]);

  const save = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onSave({ ...board, title: title.trim() });
    setLoading(false);
    onClose();
  };

  const doDelete = async () => {
    setLoading(true);
    await onDelete(board.id);
    setLoading(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen && !!board} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={closeRef}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => { if (!loading) onClose(); }}
      >
        {/* backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* modal panel */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium">
                  {confirmDelete ? 'Delete Board?' : 'Edit Board'}
                </Dialog.Title>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  disabled={loading}
                  className="text-gray-500 hover:text-red-500 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {confirmDelete ? (
                <>
                  <p className="mb-4 text-gray-700">
                    Are you sure you want to delete “{board.title}”?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={loading}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={doDelete}
                      disabled={loading}
                      className={`flex items-center gap-1 px-3 py-1 text-white rounded ${
                        loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {loading && <Loader2 className="animate-spin" size={16} />}
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="edit-board-title" className="sr-only">
                    Board Title
                  </label>
                  <input
                    id="edit-board-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setConfirmDelete(true)}
                      disabled={loading}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                    <button
                      onClick={save}
                      disabled={loading}
                      className={`flex items-center gap-1 px-4 py-1.5 text-white rounded ${
                        loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
