import { PlusIcon } from '@radix-ui/react-icons';

const AddTaskCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className='group not-[]:w-full h-24 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-green-400 transition '
    aria-label='Add task'
  >
    <PlusIcon className='h-8 w-8 group-hover:text-green-500' />
  </button>
);

export default AddTaskCard;
