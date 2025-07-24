import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTodo } from './TodoContext';

const Task = ({ task, showListName = false }) => {
  const { actions } = useTodo();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex items-center gap-4 py-3 px-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-move select-none ${
        isDragging ? 'scale-95 shadow-lg' : 'hover:scale-[1.02]'
      }`}
    >
      <div
        className='w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform'
        style={{
          borderColor: actions.getCategoryColor(task.category),
          backgroundColor: task.completed
            ? actions.getCategoryColor(task.category)
            : 'transparent',
        }}
        onClick={(e) => {
          e.stopPropagation();
          actions.toggleTask(task.id);
        }}
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
              : 'text-gray-700'
          } font-medium`}
        >
          {task.text}
        </p>
        {showListName && (
          <p className="text-xs text-gray-500 mt-1">
            from "{task.listName}"
          </p>
        )}
      </div>

      <span className='text-sm text-gray-500 font-medium flex-shrink-0'>
        {task.time}
      </span>

      <div className='w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0'>
        <div className='w-4 h-4 rounded-full bg-gray-200'></div>
      </div>
    </div>
  );
};

export default Task;