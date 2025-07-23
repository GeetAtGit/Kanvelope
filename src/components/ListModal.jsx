// src/components/ListModal.jsx
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, Loader2 } from 'lucide-react';

export default function ListModal({ isOpen, list, onClose, onSave, onDelete }) {
  const [title, setTitle]               = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!list) return;
    setTitle(list.title);
    setConfirmDelete(false);
  }, [list]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({ ...list, title: title.trim() });
    setSaving(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onDelete(list.id);
    setDeleting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen && !!list} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={closeBtnRef}
        onClose={() => {
          if (!saving && !deleting) onClose();
        }}
      >
        {/* —— backdrop exactly as in CardModal —— */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xs" />
        </Transition.Child>

        {/* modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {/* header */}
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    {confirmDelete ? 'Delete List?' : 'Edit List'}
                  </Dialog.Title>
                  <button
                    ref={closeBtnRef}
                    onClick={onClose}
                    disabled={saving || deleting}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>

                {confirmDelete ? (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      Are you sure you want to delete “{list.title}” and all its cards?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        className={`flex items-center gap-2 px-3 py-1 text-white rounded ${
                          deleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {deleting && <Loader2 className="animate-spin" size={16} />}
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium mb-1">List Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
                    />

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setConfirmDelete(true)}
                        disabled={saving}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-white text-sm ${
                          saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {saving
                          ? <Loader2 className="animate-spin" size={16} />
                          : 'Save'}
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
