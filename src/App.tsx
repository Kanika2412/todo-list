import { useState } from 'react';
import { Search, Calendar, Settings, Filter } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([
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
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'personal', name: 'Personal', color: '#FF6B9D' },
    { id: 'freelance', name: 'Freelance', color: '#4ECDC4' },
    { id: 'work', name: 'Work', color: '#FFD93D' },
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : '#FF6B9D';
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        category: 'personal',
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTaskCountByCategory = (categoryId) => {
    return tasks.filter((task) => task.category === categoryId).length;
  };

  return (
    <div className='  min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 left-[220px] z-[99] w-32 h-32 bg-cyan-400 rounded-full'></div>
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full opacity-60 -translate-x-32 translate-y-32'></div>
      <div className='absolute bottom-20 right-0 w-40 h-40 bg-yellow-400 rounded-full opacity-70 translate-x-20'></div>

      <div className=' pt-10 container mx-auto p-6 relative z-10 max-w-6xl '>
        {/* White container wrapping both sidebar and main content */}
        <div className=' rounded-2xl shadow-lg flex overflow-hidden border-4'>
          {/* Sidebar */}
          <div className='w-72 p-6 bg-white border-r border-gray-100 relative'>
            {/* <div className="absolute top-[-20px] left-[220px] z-30 w-32 h-32 bg-cyan-400 rounded-full"></div> */}

            {/* Profile Section */}
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
                <p className='text-gray-500 text-sm'>Hamza mameri</p>
              </div>
            </div>

            {/* Today tasks */}
            <div className='mb-6'>
              <div className='flex items-center gap-2 py-3 px-3 text-gray-700'>
                <Calendar className='w-4 h-4' />
                <span className='font-medium'>Today tasks</span>
              </div>
            </div>

            {/* Categories */}
            <div className='space-y-1 mb-6'>
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
                  <span className='text-gray-400 text-sm'>
                    {getTaskCountByCategory(category.id)}
                  </span>
                </div>
              ))}

              <div className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-500 mt-3'>
                <Filter className='w-4 h-4' />
                <span>Add filter</span>
              </div>
            </div>

            {/* Scheduled Tasks */}
            <div className='mb-8'>
              <div className='flex items-center gap-2 py-3 px-3 text-gray-700'>
                <Calendar className='w-4 h-4' />
                <span className='font-medium'>Scheduled tasks</span>
              </div>
            </div>

            {/* Settings */}
            <div className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600'>
              <Settings className='w-4 h-4' />
              <span>Settings</span>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 bg-transparent p-8 pl-[100px] pr-[50px]'>
            {/* Header */}
            <div className='mb-8 text-white '>
              <h1 className='text-xl font-bold '>Today main focus</h1>
              <h2 className='text-2xl font-extrabold '>Design team meeting</h2>
            </div>

            {/* Search/Add Task Bar */}
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

            {/* Tasks */}
            <div className='space-y-4'>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className='flex items-center gap-4 py-2 px-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow'
                >
                  <div
                    className='w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center flex-shrink-0'
                    style={{
                      borderColor: getCategoryColor(task.category),
                      backgroundColor: task.completed
                        ? getCategoryColor(task.category)
                        : 'transparent',
                    }}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed && (
                      <div className='w-2 h-2 bg-white rounded-full'></div>
                    )}
                  </div>

                  <div className='flex-1'>
                    <p
                      className={`${
                        task.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-500'
                      } font-bold  `}
                    >
                      {task.text}
                    </p>
                  </div>

                  <span className='text-sm text-gray-500 font-bold flex-shrink-0'>
                    {task.time}
                  </span>

                  <div className='w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0'>
                    <div className='w-4 h-4 rounded-full bg-gray-200'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
