import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
import type { ITask, TaskStatus } from '../types';
import ColumnContainer from '../components/ColumnContainer';

const BoardPage: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const { data: board, isLoading: bLoad } = useGetBoardQuery(boardId!);
  const { data: tasks = [], isLoading: tLoad } = useGetTasksQuery(boardId!);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [columns, setColumns] = useState<Record<TaskStatus, ITask[]>>({
    todo: [],
    in_progress: [],
    done: [],
  });

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | undefined>();

  useEffect(() => {
    if (tasks) {
      setColumns({
        todo: tasks.filter((t) => t.status === 'todo'),
        in_progress: tasks.filter((t) => t.status === 'in_progress'),
        done: tasks.filter((t) => t.status === 'done'),
      });
    }
  }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const src = active.data.current as {
      status: TaskStatus;
      index: number;
      task: ITask;
    };
    const dst = over.data.current as { status: TaskStatus; index: number };

    if (src.status === dst.status) {
      setColumns((cols) => {
        const col = Array.from(cols[src.status]);
        return { ...cols, [src.status]: arrayMove(col, src.index, dst.index) };
      });
    } else {
      await updateTask({
        id: src.task._id,
        data: { status: dst.status },
      }).unwrap();
    }
  };

  if (bLoad || tLoad) return <Loader size={24} />;
  if (!board) return <p>Board is not found</p>;

  const openCreate = () => {
    setActiveTask(undefined);
    setModalMode('create');
  };

  const openEdit = (task: ITask) => {
    setActiveTask(task);
    setModalMode('edit');
  };

  const handleDelete = async (task: ITask) => {
    await deleteTask({ taskId: task._id }).unwrap();
  };

  const handleConfirm = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    if (!boardId) return;
    if (modalMode === 'create') {
      await createTask({ boardId, ...data }).unwrap();
    } else if (modalMode === 'edit' && activeTask) {
      await updateTask({ id: activeTask._id, data }).unwrap();
    }
    setModalMode(null);
  };

  return (
    <>
      <div className='mx-auto p-4 min-w-11/12 '>
        <h1 className='text-3xl font-bold mb-6 text-center'>{board.title}</h1>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className='grid grid-cols-3 gap-8'>
            {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => (
              <SortableContext
                key={status}
                items={columns[status].map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <ColumnContainer status={status}>
                  <h2 className='text-2xl font-semibold mb-4'>
                    {status === 'todo'
                      ? 'To Do'
                      : status === 'in_progress'
                      ? 'In Progress'
                      : 'Done'}
                  </h2>
                  {columns[status].map((task, idx) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      index={idx}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  {status === 'todo' && <AddTaskCard onClick={openCreate} />}
                </ColumnContainer>
              </SortableContext>
            ))}
          </div>
        </DndContext>
      </div>

      {modalMode && (
        <TaskModal
          open
          onOpenChange={(open) => !open && setModalMode(null)}
          title={modalMode === 'create' ? 'Create task' : 'Edit task'}
          initialData={modalMode === 'edit' ? activeTask : undefined}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default BoardPage;
