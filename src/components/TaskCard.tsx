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
      <div className='flex flex-col gap-3 mb-10 rounded-b-xl'>
        <h3 className='font-semibold text-xl'>{task.title}</h3>
        {task.description && (
          <p className='text-lg text-gray-600 mt-1 truncate'>
            {task.description}
          </p>
        )}
      </div>

      <div className='absolute bottom-2 right-2 flex space-x-2 '>
        <button
          onPointerDown={stop}
          onClick={() => onEdit(task)}
          className='p-2 hover:bg-green-200 rounded-full'
          aria-label='Edit'
        >
          <Pencil1Icon height={24} width={24} />
        </button>
        <button
          onPointerDown={stop}
          onClick={() => onDelete(task)}
          className='p-2 hover:bg-green-200 rounded-full'
          aria-label='Delete'
        >
          <TrashIcon height={24} width={24} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
