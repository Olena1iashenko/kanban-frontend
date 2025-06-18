import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBoardQuery } from '../redux/boardsApi';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../redux/tasksApi';
import Loader from '../components/Loader';
import TaskCard from '../components/TaskCard';
import AddTaskCard from '../components/AddTaskButton';
import TaskModal from '../components/TaskModal';
import type { IBoard, ITask } from '../types';

const BoardPage: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const { data: board = {} as IBoard, isLoading: boardLoading } =
    useGetBoardQuery(boardId!);
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery(
    boardId!
  );

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  if (boardLoading || tasksLoading) return <Loader size={24} />;

  const columns: Record<ITask['status'], ITask[]> = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const openCreate = () => {
    setActiveTask(null);
    setModalMode('create');
  };

  const openEdit = (task: ITask) => {
    setActiveTask(task);
    setModalMode('edit');
  };

  const handleDelete = async (task: ITask) => {
    if (confirm('Видалити задачу?')) {
      await deleteTask({ taskId: task._id }).unwrap();
    }
  };

  const handleConfirm = async (data: {
    title: string;
    description: string;
    status: ITask['status'];
  }) => {
    if (!boardId) return;

    if (modalMode === 'create') {
      await createTask({
        boardId,
        title: data.title,
        description: data.description,
        status: data.status,
      }).unwrap();
    } else if (modalMode === 'edit' && activeTask) {
      await updateTask({
        id: activeTask._id,
        data,
      }).unwrap();
    }

    setModalMode(null);
  };

  return (
    <div className='max-w-5xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>{board.title}</h1>
      <div className='grid grid-cols-3 gap-6'>
        {(['todo', 'in_progress', 'done'] as ITask['status'][]).map(
          (status) => (
            <div key={status} className='bg-gray-100 p-4 rounded flex flex-col'>
              <h2 className='text-xl font-semibold mb-4'>
                {status === 'todo'
                  ? 'To Do'
                  : status === 'in_progress'
                  ? 'In Progress'
                  : 'Done'}
              </h2>
              <ul className='space-y-3 flex-1 overflow-auto'>
                {columns[status].map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={() => openEdit(task)}
                    onDelete={() => handleDelete(task)}
                  />
                ))}
              </ul>
              {status === 'todo' && (
                <div className='mt-4'>
                  <AddTaskCard onClick={openCreate} />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {modalMode && (
        <TaskModal
          open
          onOpenChange={(open) => !open && setModalMode(null)}
          title={modalMode === 'create' ? 'Нова задача' : 'Редагування задачі'}
          initialData={modalMode === 'edit' ? activeTask! : undefined}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default BoardPage;
