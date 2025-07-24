import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Edit2, Trash2 } from 'lucide-react';
import { useTodo } from './TodoContext';
import Task from './Task';

const TodoList = ({ list, isDroppable = false }) => {
  const { activeListId, overId, actions } = useTodo();
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');

  const startEditingList = (listId, currentName) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };

  const saveListName = () => {
    if (editingListName.trim()) {
      actions.updateListName(editingListId, editingListName);
    }
    setEditingListId(null);
    setEditingListName('');
  };

  const cancelEditingList = () => {
    setEditingListId(null);
    setEditingListName('');
  };

  if (isDroppable) {
    return (
      <div
        className={`group flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-3 rounded-lg hover:bg-gray-50 cursor-pointer relative transition-all ${
          activeListId === list.id ? 'bg-purple-50 border-l-2 sm:border-l-4 border-purple-500' : ''
        } ${overId === list.id ? 'bg-purple-100 border-2 border-purple-400 border-dashed scale-[1.02] sm:scale-105' : ''}`}
        onClick={() => actions.setActiveList(list.id)}
      >
        <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-400 flex-shrink-0'></div>
        
        {editingListId === list.id ? (
          <input
            type='text'
            value={editingListName}
            onChange={(e) => setEditingListName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') saveListName();
              if (e.key === 'Escape') cancelEditingList();
            }}
            onBlur={saveListName}
            className='flex-1 px-1 py-0 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none min-w-0'
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className='text-gray-700 flex-1 text-sm sm:text-base truncate min-w-0'>{list.name}</span>
        )}
        
        <span className='text-xs text-gray-500 bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 min-w-[20px] text-center'>
          {list.tasks.length}
        </span>
        
        {editingListId !== list.id && (
          <div className='hidden group-hover:flex gap-0.5 sm:gap-1 flex-shrink-0'>
            <Edit2 
              className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-blue-600 transition-colors' 
              onClick={(e) => {
                e.stopPropagation();
                startEditingList(list.id, list.name);
              }}
            />
            <Trash2 
              className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-red-600 transition-colors' 
              onClick={(e) => {
                e.stopPropagation();
                actions.deleteList(list.id);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-3 sm:space-y-4 w-[95%] sm:w-[95%] lg:w-[95%] mx-auto px-2 sm:px-0'>
      {list.tasks.length === 0 ? (
        <div className='text-center py-8 sm:py-12 text-white opacity-75'>
          <p className='text-base sm:text-lg mb-1 sm:mb-2'>No tasks yet!</p>
          <p className='text-xs sm:text-sm'>Add a task above to get started.</p>
        </div>
      ) : (
        <SortableContext items={list.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-2 sm:space-y-3'>
            {list.tasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export default TodoList;