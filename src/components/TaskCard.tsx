import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import type { TaskCardProps } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task._id,
      data: { status: task.status, index, task },
    });
  const style: React.CSSProperties = {
    willChange: 'transform',
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 150ms ease-out',
    marginBottom: '0.75rem',
    zIndex: isDragging ? 999 : 'auto',
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='bg-white p-4 rounded shadow relative cursor-grab'
    >
      <h3 className='font-semibold'>{task.title}</h3>
      {task.description && (
        <p className='text-sm text-gray-600 mt-1'>{task.description}</p>
      )}

      <div className='absolute top-2 right-2 flex space-x-1'>
        <button
          onPointerDown={stop}
          onClick={() => onEdit(task)}
          className='p-1 hover:bg-gray-200 rounded'
          aria-label='Edit'
        >
          <Pencil1Icon />
        </button>
        <button
          onPointerDown={stop}
          onClick={() => onDelete(task)}
          className='p-1 hover:bg-gray-200 rounded'
          aria-label='Delete'
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
