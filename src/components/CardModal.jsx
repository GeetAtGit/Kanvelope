import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';

const CardModal = ({ isOpen, card, onClose, onSave, onDelete }) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (card) {
      setContent(card.content);
      setConfirmingDelete(false);
    }
  }, [card]);

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed === card.content) return;

    setSaving(true);
    await onSave({ ...card, content: trimmed });

    // 👇 Delay to allow animation to show
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 800);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    await onDelete(card.id);

    // 👇 Delay to allow animation to show
    setTimeout(() => {
      setLoadingDelete(false);
      onClose();
    }, 800);
  };

  return (
    <Transition appear show={isOpen && !!card} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !saving && !loadingDelete && onClose()}>
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
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    {confirmingDelete ? 'Delete Card?' : 'Edit Card'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                {confirmingDelete ? (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      Are you sure you want to delete this card?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setConfirmingDelete(false)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        disabled={loadingDelete}
                        className={`px-3 py-1 text-sm text-white rounded flex items-center gap-2 ${
                          loadingDelete
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {loadingDelete && <Loader2 className="animate-spin" size={16} />}
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      rows={4}
                      className="w-full border rounded px-3 py-2 text-sm resize-none"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Edit your card content"
                    />

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => setConfirmingDelete(true)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 size={20} /> 
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-4 py-1.5 rounded text-sm text-white flex items-center justify-center gap-2 ${
                            saving
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        >
                        {saving ? (
                            <>
                            <Loader2 className="animate-spin" size={16} strokeWidth={2.5} /> Saving...
                            </>
                        ) : (
                            'Save'
                        )}
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
};

export default CardModal;
