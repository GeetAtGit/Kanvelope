// BoardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import AddListForm from '../components/AddListForm';
import AddCardForm from '../components/AddCardForm';
import CardModal from '../components/CardModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2 } from 'lucide-react';

const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({});
  const [modalCard, setModalCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoardAndLists();
  }, [id]);

  const fetchBoardAndLists = async () => {
    setLoading(true);
    try {
      const boardRef = doc(db, 'boards', id);
      const boardSnap = await getDoc(boardRef);
      if (!boardSnap.exists()) return;
      setBoard({ id: boardSnap.id, ...boardSnap.data() });

      const listQuery = query(collection(db, 'lists'), where('boardId', '==', id));
      const listSnapshot = await getDocs(listQuery);
      const fetchedLists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedLists.sort((a, b) => a.position - b.position);

      const cardQuery = query(collection(db, 'cards'), where('boardId', '==', id));
      const cardSnapshot = await getDocs(cardQuery);
      const grouped = {};
      cardSnapshot.docs.forEach(doc => {
        const card = { id: doc.id, ...doc.data() };
        if (!grouped[card.listId]) grouped[card.listId] = [];
        grouped[card.listId].push(card);
      });
      Object.keys(grouped).forEach(listId => grouped[listId].sort((a, b) => a.position - b.position));

      setLists(fetchedLists);
      setCardsByList(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (title) => {
    await addDoc(collection(db, 'lists'), {
      title,
      boardId: id,
      position: lists.length,
      createdAt: new Date(),
    });
    fetchBoardAndLists();
  };

  const handleAddCard = async (listId, content) => {
    const listCards = cardsByList[listId] || [];
    await addDoc(collection(db, 'cards'), {
      content,
      listId,
      boardId: id,
      position: listCards.length,
      createdAt: new Date(),
    });
    fetchBoardAndLists();
  };

  const handleSaveCard = async (updatedCard) => {
    await updateDoc(doc(db, 'cards', updatedCard.id), {
      content: updatedCard.content,
    });
    fetchBoardAndLists();
  };

  const handleDeleteCard = async (cardId) => {
    await deleteDoc(doc(db, 'cards', cardId));
    fetchBoardAndLists();
  };

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'list') {
      const newListOrder = [...lists];
      const [moved] = newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, moved);

      setLists(newListOrder);
      await Promise.all(newListOrder.map((list, i) => updateDoc(doc(db, 'lists', list.id), { position: i })));
      return;
    }

    const startList = source.droppableId;
    const endList = destination.droppableId;
    const startCards = [...(cardsByList[startList] || [])];
    const endCards = startList === endList ? startCards : [...(cardsByList[endList] || [])];

    const [movedCard] = startCards.splice(source.index, 1);
    endCards.splice(destination.index, 0, movedCard);

    const newCardsByList = { ...cardsByList, [startList]: startCards, [endList]: endCards };
    setCardsByList(newCardsByList);

    const reordered = endCards.map((card, idx) => ({ ...card, position: idx, listId: endList }));
    await Promise.all(reordered.map(card => updateDoc(doc(db, 'cards', card.id), { position: card.position, listId: card.listId })));
  };

  if (loading) return <p className="p-6">Loading board...</p>;
  if (!board) return <p className="p-6 text-red-600">Board not found</p>;

  return (
    <div className="px-2 sm:px-6 py-4">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        {board.title}
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="list" direction="horizontal">
          {(provided) => (
            <div
              className="flex flex-col sm:flex-row gap-4 w-full overflow-x-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, listIndex) => (
                <Draggable draggableId={list.id} index={listIndex} key={list.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full sm:min-w-[16rem] sm:w-64 flex-shrink-0 bg-white p-4 rounded shadow"
                    >
                      <h2 className="font-semibold text-lg mb-2">{list.title}</h2>

                      <Droppable droppableId={list.id} type="card">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {(cardsByList[list.id] || []).map((card, cardIndex) => (
                              <Draggable draggableId={card.id} index={cardIndex} key={card.id}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-gray-100 p-2 mb-2 rounded text-sm shadow-sm relative group cursor-pointer"
                                    onClick={() => setModalCard(card)}
                                  >
                                    <p>{card.content}</p>
                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setModalCard(card);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <AddCardForm onAdd={(content) => handleAddCard(list.id, content)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              <div className="w-full sm:min-w-[16rem] sm:w-64 flex-shrink-0">
                <AddListForm onAdd={handleAddList} />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CardModal
        isOpen={!!modalCard}
        card={modalCard}
        onClose={() => setModalCard(null)}
        onSave={(updatedCard) => {
          setModalCard(null);
          handleSaveCard(updatedCard);
        }}
        onDelete={(id) => {
          setModalCard(null);
          handleDeleteCard(id);
        }}
      />
    </div>
  );
};

export default BoardPage;
