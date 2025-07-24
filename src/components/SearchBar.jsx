import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTodo } from './TodoContext';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useTodo();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className='mb-6'>
      <div className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
        isSearchFocused ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
      }`}>
        <Search className='w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Search tasks across all lists...'
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className='flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400'
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className='w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-full h-full' />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className='mt-2 text-sm text-purple-600'>
          Searching for: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;