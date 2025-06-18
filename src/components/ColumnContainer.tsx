import { useDroppable } from '@dnd-kit/core';
import type { TaskStatus } from '../types';

interface ColumnProps {
  status: TaskStatus;
  children: React.ReactNode;
}

const ColumnContainer: React.FC<ColumnProps> = ({ status, children }) => {
  const { setNodeRef } = useDroppable({ id: status, data: { status } });

  return (
    <div
      ref={setNodeRef}
      className='bg-gray-100 p-4 rounded flex flex-col min-h-[200px]'
    >
      {children}
    </div>
  );
};

export default ColumnContainer;
