
import { useState, createContext, useContext, useEffect } from 'react';

const TodoContext = createContext();

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

const STORAGE_KEY = 'todoApp_data';

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

const defaultData = {
  todoLists: [
    {
      id: 'list-1',
      name: 'Today Tasks',
      tasks: [
        {
          id: '1',
          text: 'Work out',
          completed: false,
          time: '8:00 am',
          category: 'personal',
        },
        {
          id: '2',
          text: 'Design team meeting',
          completed: false,
          time: '2:30 pm',
          category: 'work',
        },
        {
          id: '3',
          text: 'Hand off the project',
          completed: false,
          time: '7:00 pm',
          category: 'freelance',
        },
        {
          id: '4',
          text: 'Read 5 pages of "Sprint"',
          completed: false,
          time: '10:30 pm',
          category: 'personal',
        },
      ]
    }
  ],
  activeListId: 'list-1',
  categories: [
    { id: 'personal', name: 'Personal', color: '#FF6B9D' },
    { id: 'freelance', name: 'Freelance', color: '#4ECDC4' },
    { id: 'work', name: 'Work', color: '#FFD93D' },
  ]
};

export const TodoProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedData = loadFromLocalStorage();
    return storedData || defaultData;
  });
  
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const actions = {
    addList: (name) => {
      const newList = {
        id: `list-${Date.now()}`,
        name: name.trim(),
        tasks: []
      };
      setState(prev => ({
        ...prev,
        todoLists: [...prev.todoLists, newList],
        activeListId: newList.id
      }));
    },

    deleteList: (listId) => {
      setState(prev => {
        if (prev.todoLists.length <= 1) return prev;
        
        const updatedLists = prev.todoLists.filter(list => list.id !== listId);
        const newActiveId = prev.activeListId === listId 
          ? updatedLists[0]?.id || prev.activeListId
          : prev.activeListId;

        return {
          ...prev,
          todoLists: updatedLists,
          activeListId: newActiveId
        };
      });
    },

    updateListName: (listId, newName) => {
      if (!newName.trim()) return;
      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list =>
          list.id === listId ? { ...list, name: newName.trim() } : list
        )
      }));
    },

    setActiveList: (listId) => {
      setState(prev => ({ ...prev, activeListId: listId }));
    },

    addTask: (text, category = 'personal') => {
      if (!text.trim()) return;
      
      const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        category,
      };

      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list =>
          list.id === prev.activeListId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        )
      }));
    },

    toggleTask: (taskId) => {
      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }))
      }));
    },

    updateTask: (taskId, updates) => {
      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        }))
      }));
    },

    deleteTask: (taskId) => {
      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list => ({
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        }))
      }));
    },

    moveTaskBetweenLists: (taskId, sourceListId, targetListId) => {
      setState(prev => {
        const sourceList = prev.todoLists.find(list => list.id === sourceListId);
        const taskToMove = sourceList?.tasks.find(task => task.id === taskId);
        
        if (!taskToMove) return prev;

        return {
          ...prev,
          todoLists: prev.todoLists.map(list => {
            if (list.id === sourceListId) {
              return {
                ...list,
                tasks: list.tasks.filter(task => task.id !== taskId)
              };
            }
            if (list.id === targetListId) {
              return {
                ...list,
                tasks: [...list.tasks, taskToMove]
              };
            }
            return list;
          })
        };
      });
    },

    reorderTasksInList: (listId, oldIndex, newIndex) => {
      setState(prev => ({
        ...prev,
        todoLists: prev.todoLists.map(list => {
          if (list.id === listId) {
            const newTasks = [...list.tasks];
            const [reorderedItem] = newTasks.splice(oldIndex, 1);
            newTasks.splice(newIndex, 0, reorderedItem);
            return { ...list, tasks: newTasks };
          }
          return list;
        })
      }));
    },

    setSearchTerm: (term) => {
      setSearchTerm(term);
    },

    getFilteredTasks: () => {
      if (!searchTerm.trim()) {
        const activeList = state.todoLists.find(list => list.id === state.activeListId);
        return activeList ? activeList.tasks : [];
      }

      const allTasks = [];
      const searchLower = searchTerm.toLowerCase();
      
      state.todoLists.forEach(list => {
        list.tasks.forEach(task => {
          if (task.text.toLowerCase().includes(searchLower)) {
            allTasks.push({
              ...task,
              listName: list.name,
              listId: list.id
            });
          }
        });
      });
      
      return allTasks;
    },

    findTaskById: (taskId) => {
      for (const list of state.todoLists) {
        const task = list.tasks.find(task => task.id === taskId);
        if (task) return { task, listId: list.id };
      }
      return null;
    },

    getListById: (listId) => {
      return state.todoLists.find(list => list.id === listId);
    },

    getActiveList: () => {
      return state.todoLists.find(list => list.id === state.activeListId) || state.todoLists[0];
    },

    getCategoryColor: (categoryId) => {
      const category = state.categories.find(c => c.id === categoryId);
      return category ? category.color : '#FF6B9D';
    },

    clearAllData: () => {
      setState(defaultData);
      localStorage.removeItem(STORAGE_KEY);
    },

    exportData: () => {
      return JSON.stringify(state, null, 2);
    },

    importData: (jsonData) => {
      try {
        const importedData = JSON.parse(jsonData);
        if (importedData.todoLists && importedData.categories && importedData.activeListId) {
          setState(importedData);
          return { success: true, message: 'Data imported successfully' };
        } else {
          return { success: false, message: 'Invalid data format' };
        }
      } catch (error) {
        return { success: false, message: 'Failed to parse JSON data' };
      }
    }
  };

  const contextValue = {
    ...state,
    actions,
    activeId,
    setActiveId,
    overId,
    setOverId,
    searchTerm,
    setSearchTerm: actions.setSearchTerm
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};