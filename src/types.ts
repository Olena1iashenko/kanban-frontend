export interface IBoard {
  _id: string;
  title: string;
  background?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  board: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}
