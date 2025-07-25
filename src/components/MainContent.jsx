import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTodo } from './TodoContext';
import Task from './Task';
import SearchBar from './SearchBar';
import TodoItems from './TodoItems';

const MainContent = () => {
  const { actions, searchTerm } = useTodo();
  const [newTaskText, setNewTaskText] = useState('');

  const activeList = actions.getActiveList();
  const filteredTasks = actions.getFilteredTasks();
  const isSearching = searchTerm.trim() !== '';

  const addTask = () => {
    if (newTaskText.trim()) {
      actions.addTask(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <div className='flex-1 bg-transparent p-8 pl-[100px] pr-[50px]'>
      {/* Header */}
      <div className='mb-8 text-white'>
        <h1 className='text-xl font-bold'>Today main focus</h1>
        <h2 className='text-2xl font-extrabold'>
          {isSearching
            ? `Search Results (${filteredTasks.length})`
            : activeList?.name || 'No List Selected'}
        </h2>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Add Task Bar */}
      <div className='relative mb-8'>
        <div className='flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50'>
          <div className='flex gap-2'>
            <div className='w-3 h-3 bg-red-400 rounded-full'></div>
            <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
            <div className='w-3 h-3 bg-green-400 rounded-full'></div>
          </div>
          <input
            type='text'
            placeholder='What is your next task?'
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className='flex-1 bg-transparent focus:outline-none text-gray-600'
          />
          <div className='flex gap-3'>
            <Search className='w-5 h-5 text-gray-400' />
            <div className='w-5 h-5 bg-gray-300 rounded'></div>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      {isSearching ? (
        <div className='space-y-4 w-[95%] mx-auto'>
          {filteredTasks.length === 0 ? (
            <div className='text-center py-12 text-white opacity-75'>
              <p className='text-lg'>No tasks found matching "{searchTerm}"</p>
              <p className='text-sm'>Try a different search term</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Task
                key={`${task.listId}-${task.id}`}
                task={task}
                showListName={true}
              />
            ))
          )}
        </div>
      ) : (
        <TodoItems list={activeList} />
      )}
    </div>
  );
};

export default MainContent;
