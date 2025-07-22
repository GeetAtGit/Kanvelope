// src/components/AddCardForm.jsx
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';

const AddCardForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);

  // core fields
  const [content, setContent]         = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo]   = useState('');
  const [dueDate, setDueDate]         = useState(null);
  const [newFiles, setNewFiles]       = useState([]);

  // dropdown options
  const [users, setUsers] = useState([]);

  // fetch your team/user list
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) return;

    // 1) Upload attachments, if any
    const uploaded = await Promise.all(
      newFiles.map(async file => {
        const id = `${Date.now()}_${file.name}`;
        const fileRef = ref(storage, `card_attachments/temp/${id}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        return { id, name: file.name, url };
      })
    );

    // 2) Build cardData payload
    const cardData = {
      content,
      description,
      assignedTo,
      dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
      attachments: uploaded,
    };

    // 3) Delegate up
    onAdd(cardData);

    // 4) Reset
    setContent('');
    setDescription('');
    setAssignedTo('');
    setDueDate(null);
    setNewFiles([]);
    setIsOpen(false);
  };

  return (
    <div className="mt-2">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1 rounded"
        >
          <Plus size={14} /> Add Card
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            key="add-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-2 p-2 bg-white rounded shadow"
          >
            {/* Title */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={1}
              className="w-full p-2 border rounded text-sm resize-none"
              placeholder="Card title…"
              autoFocus
            />

            {/* Description */}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded text-sm resize-none"
              placeholder="Description (optional)"
            />

            {/* Assignee */}
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">— Assign to —</option>
              {users.map(u => (
                <option key={u.uid} value={u.uid}>{u.name}</option>
              ))}
            </select>

            {/* Due Date */}
            <DatePicker
              selected={dueDate}
              onChange={date => setDueDate(date)}
              placeholderText="Select due date…"
              className="w-full p-2 border rounded text-sm"
            />

            {/* Attachments */}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            {newFiles.length > 0 && (
              <ul className="text-xs">
                {newFiles.map(f => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}

            {/* Actions */}
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
                  setDescription('');
                  setAssignedTo('');
                  setDueDate(null);
                  setNewFiles([]);
                }}
                className="text-gray-600 hover:text-red-500"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AddCardForm;
