import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BoardList from '../components/BoardList';
import BoardForm from '../components/BoardForm';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    const q = query(collection(db, 'boards'), where('ownerId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const fetchedBoards = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setBoards(fetchedBoards);
  };

  const handleAddBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(collection(db, 'boards'), {
      title,
      ownerId: user.uid,
      createdAt: new Date()
    });
    setTitle('');
    fetchBoards();
  };

  const handleBoardClick = (id) => {
    navigate(`/boards/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Boards</h1>
      <BoardForm title={title} setTitle={setTitle} handleAddBoard={handleAddBoard} />
      <BoardList boards={boards} onBoardClick={handleBoardClick} />
    </div>
  );
};

export default Dashboard;
