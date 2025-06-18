import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import type { ITask } from '../types';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (task: ITask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => (
  <div className='bg-white p-4 rounded shadow relative'>
    <h3 className='font-semibold'>{task.title}</h3>
    {task.description && (
      <p className='text-sm text-gray-600 mt-1'>{task.description}</p>
    )}

    <div className='absolute top-2 right-2 flex space-x-1'>
      <button
        onClick={() => onEdit(task)}
        className='p-1 hover:bg-gray-200 rounded'
        aria-label='Edit task'
      >
        <Pencil1Icon />
      </button>
      <button
        onClick={() => onDelete(task)}
        className='p-1 hover:bg-gray-200 rounded'
        aria-label='Delete task'
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

export default TaskCard;
