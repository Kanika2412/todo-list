import { useState } from 'react';
import { Calendar, Settings, Filter, Plus, Menu, X } from 'lucide-react';
import { useTodo } from './TodoContext';
import TodoList from './TodoList';

const Sidebar = () => {
  const { todoLists, categories, actions } = useTodo();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addNewList = () => {
    if (newListName.trim()) {
      actions.addList(newListName);
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const MobileSidebarContent = () => (
    <>
      {/* Mobile Header */}
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'>
          <img
            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'
            alt='Profile'
            className='w-full h-full object-cover'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className='w-full h-full bg-gray-800 rounded-full items-center justify-center text-white font-medium hidden text-xs'>
            HM
          </div>
        </div>
        <div className='min-w-0 flex-1'>
          <p className='font-semibold text-gray-800 text-sm truncate'>Do-it</p>
          <p className='text-gray-400 text-sm font-medium truncate'>Hamza mameri</p>
        </div>
        <button
          onClick={closeMobileMenu}
          className='p-1 text-gray-500 hover:text-gray-700'
        >
          <X className='w-5 h-5' />
        </button>
      </div>

      <div className='border-b border-gray-200 w-[80%] mx-auto mb-3'></div>

      {/* Mobile Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='space-y-4'>
          {/* Todo Lists */}
          <div>
            <div className='flex items-center justify-between py-2 px-3 text-gray-700'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 flex-shrink-0' />
                <span className='font-medium text-sm'>Todo Lists</span>
              </div>
              <Plus 
                className='w-4 h-4 cursor-pointer hover:text-purple-600 flex-shrink-0' 
                onClick={() => setIsAddingList(true)}
              />
            </div>

            {/* Add New List Input */}
            {isAddingList && (
              <div className='mb-3 px-3'>
                <input
                  type='text'
                  placeholder='Enter list name'
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addNewList();
                    if (e.key === 'Escape') setIsAddingList(false);
                  }}
                  className='w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500'
                  autoFocus
                />
                <div className='flex gap-1 mt-1'>
                  <button
                    onClick={addNewList}
                    className='px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors'
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className='px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Todo Lists */}
            <div className='space-y-1 mb-4'>
              {todoLists.map((list) => (
                <div key={list.id} onClick={closeMobileMenu}>
                  <TodoList list={list} isDroppable={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className='space-y-1 mb-4'>
            <div className='text-xs text-gray-500 font-medium px-3 mb-2'>CATEGORIES</div>
            {categories.map((category) => (
              <div
                key={category.id}
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                onClick={closeMobileMenu}
              >
                <div
                  className='w-3 h-3 rounded-full flex-shrink-0'
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className='text-gray-700 flex-1 text-sm truncate'>{category.name}</span>
              </div>
            ))}

            <div className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-500 mt-3 transition-colors'>
              <Filter className='w-4 h-4 flex-shrink-0' />
              <span className='text-sm'>Add filter</span>
            </div>
          </div>

          {/* Scheduled Tasks */}
          <div className='mb-2'>
            <div className='flex items-center gap-2 py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors' onClick={closeMobileMenu}>
              <Calendar className='w-4 h-4 flex-shrink-0' />
              <span className='font-medium text-sm'>Scheduled tasks</span>
            </div>
          </div>

          {/* Settings */}
          <div>
            <div className='flex items-center gap-2 py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors' onClick={closeMobileMenu}>
              <Settings className='w-4 h-4 flex-shrink-0' />
              <span className='font-medium text-sm'>Settings</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200'
      >
        <Menu className='w-5 h-5 text-gray-600' />
      </button>

      <div className='hidden lg:block w-72 h-full p-6 bg-white border-r border-gray-100 relative'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden'>
            <img
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'
              alt='Profile'
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className='w-full h-full bg-gray-800 rounded-full items-center justify-center text-white font-medium hidden'>
              HM
            </div>
          </div>
          <div>
            <p className='font-semibold text-gray-800'>Do-it</p>
            <p className='text-gray-400 text-lg font-medium'>Hamza mameri</p>
          </div>
        </div>
        <div className='border-b-2 border-gray-200 w-[80%] mx-auto'></div>

        {/* Todo Lists Section */}
        <div className='flex gap-8 justify-items-center pt-4'>
          <div className='flex py-3 px-3 text-gray-700'>
            <Calendar className='w-4 h-4' />
          </div>
          <div>
            <div className=''>
              <div className='flex items-center justify-between py-3 px-3 text-gray-700'>
                <span className='font-medium'>Todo Lists</span>
                <Plus 
                  className='w-4 h-4 cursor-pointer hover:text-purple-600' 
                  onClick={() => setIsAddingList(true)}
                />
              </div>
            </div>

            {/* Add New List Input */}
            {isAddingList && (
              <div className='mb-3 px-3'>
                <input
                  type='text'
                  placeholder='Enter list name'
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addNewList();
                    if (e.key === 'Escape') setIsAddingList(false);
                  }}
                  className='w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500'
                  autoFocus
                />
                <div className='flex gap-1 mt-1'>
                  <button
                    onClick={addNewList}
                    className='px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600'
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className='px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Todo Lists */}
            <div className='space-y-1 mb-6'>
              {todoLists.map((list) => (
                <TodoList key={list.id} list={list} isDroppable={true} />
              ))}
            </div>

            {/* Categories */}
            <div className='space-y-1 mb-6'>
              <div className='text-xs text-gray-500 font-medium px-3 mb-2'>CATEGORIES</div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer'
                >
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className='text-gray-700 flex-1'>{category.name}</span>
                </div>
              ))}

              <div className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-500 mt-3'>
                <Filter className='w-4 h-4' />
                <span>Add filter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className='mb-'>
          <div className='flex items-center gap-10 py-3 px-3 text-gray-700'>
            <Calendar className='w-4 h-4' />
            <span className='font-medium pl-3'>Scheduled tasks</span>
          </div>
        </div>

        {/* Settings */}
        <div className=''>
          <div className='flex items-center gap-10 py-3 px-3 text-gray-700'>
            <Settings className='w-4 h-4' />
            <span className='font-medium pl-3'>Settings</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className='lg:hidden fixed inset-0 z-40 flex'>
          {/* Backdrop */}
          <div 
            className='fixed inset-0 bg-black bg-opacity-50'
            onClick={closeMobileMenu}
          ></div>
          
          {/* Mobile Sidebar */}
          <div className='relative w-80 max-w-[85vw] h-full p-4 bg-white shadow-xl flex flex-col'>
            <MobileSidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;