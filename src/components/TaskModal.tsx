import { useState, type ReactNode, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import type { ITask, TaskStatus } from '../types';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialData?: Partial<ITask>;
  children?: ReactNode;
  onConfirm: (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onOpenChange,
  title,
  initialData,
  onConfirm,
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'todo',
      });
    } else {
      setForm({ title: '', description: '', status: 'todo' });
    }
  }, [initialData, open]);

  const handleConfirm = () => {
    onConfirm(form);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className='fixed inset-0 bg-black opacity-80' />
      <Dialog.Content className='fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg'>
        <div className='flex justify-between items-center mb-4'>
          <Dialog.Title className='text-2xl font-semibold'>
            {title}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              aria-label='Close'
              className='p-2 hover:bg-green-200 rounded-full'
            >
              <Cross1Icon width={20} height={20} />
            </button>
          </Dialog.Close>
        </div>
        <div className='space-y-4'>
          <label className='block'>
            <span className='text-xl font-medium'>Title</span>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className='mt-1 block w-full p-2 border rounded-lg text-md'
            />
          </label>
          <label className='block'>
            <span className='text-xl font-medium'>Description</span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className='mt-1 block w-full p-2 border rounded-lg text-md'
            />
          </label>
          <label className='block'>
            <span className='text-xl font-medium'>Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as any }))
              }
              className='mt-1 block w-full p-2 border rounded-lg text-md'
            >
              <option value='todo'>To Do</option>
              <option value='in_progress'>In Progress</option>
              <option value='done'>Done</option>
            </select>
          </label>
        </div>
        <div className='mt-6 flex justify-end'>
          <Dialog.Close asChild>
            <button
              onClick={handleConfirm}
              className='px-4 py-2 bg-green-600 hover:bg-white text-white hover:text-black hover:border-1 rounded-xl'
            >
              Confirm
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TaskModal;
