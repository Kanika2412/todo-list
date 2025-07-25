import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useTodo } from './TodoContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const TodoList = () => {
  const { actions, activeId, setActiveId, setOverId } = useTodo();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    setOverId(over.id);

    const activeItem = actions.findTaskById(active.id);
    if (!activeItem) return;

    const { listId: activeListId } = activeItem;

    const overList = actions.getListById?.(over.id);
    if (overList && activeListId !== over.id) {
      actions.moveTaskBetweenLists(active.id, activeListId, over.id);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const activeItem = actions.findTaskById(active.id);
    const overItem = actions.findTaskById(over.id);

    if (!activeItem) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const { listId: activeListId } = activeItem;

    if (overItem && activeListId === overItem.listId) {
      const list = actions.getListById(activeListId);
      const oldIndex = list.tasks.findIndex((task) => task.id === active.id);
      const newIndex = list.tasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex) {
        actions.reorderTasksInList(activeListId, oldIndex, newIndex);
      }
    }

    setActiveId(null);
    setOverId(null);
  };

  const activeTask = activeId ? actions.findTaskById(activeId)?.task : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative overflow-hidden'>
        {/* Decorative elements - responsive positioning */}

        <div className='absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-400 rounded-full opacity-60 -translate-x-16 sm:-translate-x-24 lg:-translate-x-32 translate-y-16 sm:translate-y-24 lg:translate-y-32' />
        <div className='absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-yellow-400 rounded-full opacity-70 translate-x-12 sm:translate-x-16 lg:translate-x-20' />

        <div className='pt-[50px] sm:pt-[60px] lg:pt-[70px] container mx-auto p-3 sm:p-4 lg:p-6 relative z-10 max-w-7xl'>
          <div className='rounded-2xl shadow-lg flex flex-col lg:flex-row border-2 sm:border-4 border-white relative min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-140px)]'>
            <div className='w-full lg:w-auto lg:flex-shrink-0'>
              <Sidebar />
            </div>

            <div className='flex-1 lg:flex-grow'>
              <MainContent />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className='flex items-center gap-2 sm:gap-4 py-2 sm:py-3 px-3 sm:px-4 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg opacity-90 max-w-[90vw] sm:max-w-none'>
              <div
                className='w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0'
                style={{
                  borderColor: actions.getCategoryColor(activeTask.category),
                  backgroundColor: activeTask.completed
                    ? actions.getCategoryColor(activeTask.category)
                    : 'transparent',
                }}
              >
                {activeTask.completed && (
                  <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full'></div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <p
                  className={`${
                    activeTask.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'
                  } font-medium text-sm sm:text-base truncate`}
                >
                  {activeTask.text}
                </p>
              </div>
              <span className='text-xs sm:text-sm text-gray-500 font-medium flex-shrink-0'>
                {activeTask.time}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default TodoList;
