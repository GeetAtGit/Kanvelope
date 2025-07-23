// src/pages/BoardPage.jsx
import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
import ListModal  from '../components/ListModal';
import BoardModal from '../components/BoardModal';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Pencil, Plus, X } from 'lucide-react';

const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [modalBoard, setModalBoard] = useState(null);

  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({});
  const [modalCard, setModalCard] = useState(null);
  const [modalList, setModalList] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rename this board
const handleSaveBoard = async (updated) => {
  await updateDoc(doc(db, 'boards', updated.id), { title: updated.title });
  fetchBoardAndLists();
  setModalBoard(null);
};

// Delete this board (and its lists/cards)
const handleDeleteBoard = async (boardId) => {
  // delete all lists + cards under the board
  const listsSnap = await getDocs(query(collection(db,'lists'), where('boardId','==',boardId)));
  await Promise.all(listsSnap.docs.map(l => deleteDoc(doc(db,'lists',l.id))));
  const cardsSnap = await getDocs(query(collection(db,'cards'), where('boardId','==',boardId)));
  await Promise.all(cardsSnap.docs.map(c => deleteDoc(doc(db,'cards',c.id))));
  // delete the board itself
  await deleteDoc(doc(db, 'boards', boardId));
  // redirect back to dashboard
  window.location.href = '/dashboard'; 
};



  // ← new: controls Add-List modal visibility
  const [showAddListModal, setShowAddListModal] = useState(false);

  useEffect(() => {
    fetchBoardAndLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBoardAndLists = async () => {
    setLoading(true);
    try {
      // 1) Load board
      const boardRef = doc(db, 'boards', id);
      const boardSnap = await getDoc(boardRef);
      if (!boardSnap.exists()) {
        setBoard(null);
        return;
      }
      setBoard({ id: boardSnap.id, ...boardSnap.data() });

      // 2) Load lists
      const listSnap = await getDocs(
        query(collection(db, 'lists'), where('boardId', '==', id))
      );
      const fetchedLists = listSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.position - b.position);

      // 3) Load profiles for assignee names
      const profilesSnap = await getDocs(collection(db, 'profiles'));
      const userMap = {};
      profilesSnap.docs.forEach(d => {
        userMap[d.id] = d.data().name;
      });

      // 4) Load cards
      const cardSnap = await getDocs(
        query(collection(db, 'cards'), where('boardId', '==', id))
      );
      const grouped = {};
      cardSnap.docs.forEach(d => {
        const raw = d.data();
        const card = {
          id: d.id,
          content: raw.content,
          listId: raw.listId,
          boardId: raw.boardId,
          position: raw.position,
          createdAt: raw.createdAt,
          description:    raw.description  ?? '',
          assignedTo:     raw.assignedTo   ?? '',
          assignedToName: userMap[raw.assignedTo] || '',
          dueDate:        raw.dueDate      ?? null,
          attachments:    raw.attachments  ?? [],
        };
        if (!grouped[card.listId]) grouped[card.listId] = [];
        grouped[card.listId].push(card);
      });
      Object.values(grouped).forEach(arr =>
        arr.sort((a, b) => a.position - b.position)
      );

      setLists(fetchedLists);
      setCardsByList(grouped);
    } catch (err) {
      console.error('Error fetching board data:', err);
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

  const handleAddCard = async (listId, cardData) => {
    const listCards = cardsByList[listId] || [];
    await addDoc(collection(db, 'cards'), {
      listId,
      boardId: id,
      position: listCards.length,
      createdAt: new Date(),
      content:     cardData.content,
      description: cardData.description,
      assignedTo:  cardData.assignedTo,
      dueDate:     cardData.dueDate,
      attachments: cardData.attachments,
    });
    fetchBoardAndLists();
  };

  const handleSaveCard = async (updatedCard) => {
    await updateDoc(doc(db, 'cards', updatedCard.id), {
      content:     updatedCard.content,
      description: updatedCard.description,
      assignedTo:  updatedCard.assignedTo,
      dueDate:     updatedCard.dueDate,
      attachments: updatedCard.attachments,
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
      const newOrder = [...lists];
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      setLists(newOrder);
      await Promise.all(
        newOrder.map((lst, idx) =>
          updateDoc(doc(db, 'lists', lst.id), { position: idx })
        )
      );
      return;
    }

    // card reordering
    const from = source.droppableId;
    const to   = destination.droppableId;
    const start = [...(cardsByList[from] || [])];
    const end   = from === to ? start : [...(cardsByList[to] || [])];
    const [movedCard] = start.splice(source.index, 1);
    end.splice(destination.index, 0, movedCard);

    setCardsByList({ ...cardsByList, [from]: start, [to]: end });

    await Promise.all(
      end.map((card, idx) =>
        updateDoc(doc(db, 'cards', card.id), {
          position: idx,
          listId: to,
        })
      )
    );
  };

  if (loading) return <p className="p-6">Loading board...</p>;
  if (!board)  return <p className="p-6 text-red-600">Board not found</p>;

  // Save an edited list title
const handleSaveList = async (updatedList) => {
  await updateDoc(
    doc(db, 'lists', updatedList.id),
    { title: updatedList.title }
  );
  fetchBoardAndLists();
};

// Delete a list *and* all its cards
const handleDeleteList = async (listId) => {
  // 1) delete the list
  await deleteDoc(doc(db, 'lists', listId));

  // 2) delete cards in that list
  const cardSnap = await getDocs(
    query(collection(db, 'cards'), where('listId', '==', listId))
  );
  await Promise.all(
    cardSnap.docs.map(d => deleteDoc(doc(db, 'cards', d.id)))
  );

  fetchBoardAndLists();
};

const borderClasses = [
  'border-red-400/50',
  'border-green-400/50',
  'border-blue-400/50',
  'border-yellow-400/50',
  'border-purple-400/50',
];


  return (
    <div className="px-2 sm:px-6 py-4">
      {/* ——— Header with Add-List button ——— */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
    {board.title}
    <button
      onClick={() => setModalBoard(board)}
      className="text-gray-500 hover:text-gray-700 p-1"
      title="Edit board"
    >
      <Pencil size={18} />
    </button>
  </h1>

        
        <button
          onClick={() => setShowAddListModal(true)}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          aria-label="Add new list"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* ——— Kanban board ——— */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="list" direction="horizontal">
          {(provided) => (
            <div
              className="flex flex-col sm:flex-row gap-4 w-full overflow-x-auto justify-center"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, idx) => (
                <Draggable key={list.id} draggableId={list.id} index={idx}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                    className={`w-full sm:min-w-[18rem] sm:w-64 flex-shrink-0 bg-white p-4 rounded shadow border-2 ${borderClasses[idx % borderClasses.length]}`}
                    >
                     <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">{list.title}</h2>

                
               <button
                 onClick={() => setModalList(list)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                 title="Edit list"
                >
                  <Pencil size={16}/>
                </button>

                <ListModal
                  isOpen={!!modalList}
                  list={modalList}
                  onClose={() => setModalList(null)}
                  onSave={handleSaveList}
                  onDelete={handleDeleteList}
                />

              </div>

                      <Droppable droppableId={list.id} type="card">
                        {(prov2) => (
                          <div ref={prov2.innerRef} {...prov2.droppableProps}>
                            {(cardsByList[list.id] || []).map((card, cidx) => (
                              <Draggable key={card.id} draggableId={card.id} index={cidx}>
                                {(prov3) => (
                                  <div
                                    ref={prov3.innerRef}
                                    {...prov3.draggableProps}
                                    {...prov3.dragHandleProps}
                                    className="bg-gray-100 p-2 mb-2 rounded text-sm shadow-sm relative group cursor-pointer"
                                    onClick={() => setModalCard(card)}
                                  >
                                    <p className="font-medium">{card.content}</p>
                                    {card.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {card.description}
                                      </p>
                                    )}
                                    {card.dueDate && (
                                      <p className="text-xs text-red-500">
                                        Due{' '}
                                        {new Date(
                                          card.dueDate.seconds * 1000
                                        ).toLocaleDateString()}
                                      </p>
                                    )}
                                    {card.assignedToName && (
                                      <p className="text-xs text-gray-700">
                                        Assigned: {card.assignedToName}
                                      </p>
                                    )}
                                    {card.attachments.length > 0 && (
                                      <ul className="text-xs text-blue-500 list-disc list-inside">
                                        {card.attachments.map(a => (
                                          <li key={a.id} className="truncate">{a.name}</li>
                                        ))}
                                      </ul>
                                    )}

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
                            {prov2.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <AddCardForm onAdd={(cardData) => handleAddCard(list.id, cardData)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* ——— Existing CardModal for editing cards ——— */}
      <CardModal
        isOpen={!!modalCard}
        card={modalCard}
        onClose={() => setModalCard(null)}
        onSave={(updated) => {
          setModalCard(null);
          handleSaveCard(updated);
        }}
        onDelete={(id) => {
          setModalCard(null);
          handleDeleteCard(id);
        }}
      />

      <BoardModal
        isOpen={!!modalBoard}
        board={modalBoard}
        onClose={() => setModalBoard(null)}
        onSave={handleSaveBoard}
        onDelete={handleDeleteBoard}
      />

      

      

      

      {/* ——— New: Add List Modal using Headless UI ——— */}
      <Transition appear show={showAddListModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowAddListModal(false)}
        >
          {/* backdrop */}
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
              {/* panel */}
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
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-medium">
                      Add New List
                    </Dialog.Title>
                    <button
                      onClick={() => setShowAddListModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <AddListForm
                    onAdd={(title) => {
                      handleAddList(title);
                      setShowAddListModal(false);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BoardPage;
