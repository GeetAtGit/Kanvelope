// src/components/CardModal.jsx
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// **Use the exact VITE_ env keys you defined in .env.local**
const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CardModal = ({ isOpen, card, onClose, onSave, onDelete }) => {

   console.log('Cloudinary config:', { CLOUD_NAME, UPLOAD_PRESET });
 
  const [content, setContent]         = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo]   = useState('');
  const [dueDate, setDueDate]         = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [newFiles, setNewFiles]       = useState([]);
  const [users, setUsers]             = useState([]);
  const [saving, setSaving]           = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [loadingDelete, setLoadingDelete]       = useState(false);

  useEffect(() => {
    if (!card) return;
    setContent(card.content);
    setDescription(card.description  ?? '');
    setAssignedTo(card.assignedTo    ?? '');
    setDueDate(card.dueDate ? card.dueDate.toDate() : null);
    setAttachments(card.attachments  ?? []);
    setNewFiles([]);
    setConfirmingDelete(false);
  }, [card]);

  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'profiles'));
      setUsers(snap.docs.map(d => ({ uid: d.id, name: d.data().name })));
    }
    fetchUsers();
  }, []);

  const handleFileChange = e => {
    setNewFiles(Array.from(e.target.files));
  };

  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('folder', `docs/kanban/${card.id}`);
    form.append('resource_type', 'auto');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: form }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error('Cloudinary error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }
    return { id: data.public_id, name: file.name, url: data.secure_url };
  };

  const handleSave = async () => {
    setSaving(true);

    // Upload any new files
    let uploaded = [];
    if (newFiles.length) {
      uploaded = await Promise.all(newFiles.map(uploadToCloudinary));
    }

    const updatedAttachments = [...attachments, ...uploaded];

    // Build payload, avoiding undefined
    const dataToUpdate = {
      content,
      description,
      assignedTo,
      attachments: updatedAttachments,
      dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
    };

    const cardRef = doc(db, 'cards', card.id);
    await updateDoc(cardRef, dataToUpdate);

    onSave({ ...card, ...dataToUpdate });

    setSaving(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    await onDelete(card.id);
    setLoadingDelete(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen && !!card} as={Fragment}>
      <Dialog onClose={() => { if (!saving && !loadingDelete) onClose(); }} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    {confirmingDelete ? 'Delete Card?' : 'Edit Card'}
                  </Dialog.Title>
                  <button onClick={onClose} disabled={saving || loadingDelete} className="text-gray-500 hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                {confirmingDelete ? (
                  <>
                    <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete this card?</p>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setConfirmingDelete(false)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Cancel</button>
                      <button onClick={handleConfirmDelete} disabled={loadingDelete}
                        className={`px-3 py-1 text-sm text-white rounded flex items-center gap-2 ${
                          loadingDelete ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}>
                        {loadingDelete && <Loader2 className="animate-spin" size={16} />}Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <textarea rows={1} value={content} onChange={e => setContent(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm resize-none mb-3" />

                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm resize-none mb-3" />

                    <label className="block text-sm font-medium mb-1">Assign To</label>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm mb-3">
                      <option value="">— unassigned —</option>
                      {users.map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
                    </select>

                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <DatePicker selected={dueDate} onChange={setDueDate}
                      placeholderText="Select due date…" className="w-full border rounded px-3 py-2 text-sm mb-3" />

                    <label className="block text-sm font-medium mb-1">Attachments</label>
                    <ul className="mb-2 space-y-1 text-xs">
                      {attachments.map(a => (
                        <li key={a.id}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="underline">
                            {a.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <input type="file" multiple onChange={handleFileChange} className="w-full text-sm mb-4" />
                    {newFiles.length > 0 && (
                      <ul className="mb-3 space-y-1 text-xs">
                        {newFiles.map(f => <li key={f.name}>{f.name}</li>)}
                      </ul>
                    )}

                    <div className="flex justify-between items-center">
                      <button onClick={() => setConfirmingDelete(true)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm">
                        <Trash2 size={18} /> Delete
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className={`px-4 py-1.5 rounded text-sm text-white flex items-center gap-2 ${
                          saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}>
                        {saving
                          ? <><Loader2 className="animate-spin" size={16} strokeWidth={2.5}/> Saving...</>
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
};

export default CardModal;
