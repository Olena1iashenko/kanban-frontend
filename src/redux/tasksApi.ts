import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ITask, TaskStatus } from '../types';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://kanban-backend-b53c.onrender.com/api/',
  }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasks: builder.query<ITask[], string>({
      query: (boardId) => ({ url: `/boards/${boardId}/tasks`, method: 'get' }),
      providesTags: (tasks = [], _error, boardId) => [
        { type: 'Tasks' as const, id: `LIST-${boardId}` },
        ...tasks.map((t) => ({ type: 'Tasks' as const, id: t._id })),
      ],
    }),
    getTask: builder.query<ITask, string>({
      query: (id) => ({ url: `tasks/${id}`, method: 'get' }),
      providesTags: (_res, _err, id) => [{ type: 'Tasks', id }],
    }),
    createTask: builder.mutation<
      ITask,
      {
        boardId: string;
        title: string;
        description?: string;
        status: TaskStatus;
      }
    >({
      query: ({ boardId, title, description, status }) => ({
        url: `boards/${boardId}/tasks`,
        method: 'POST',
        body: { title, description, status },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: 'Tasks' as const, id: `LIST-${boardId}` },
      ],
    }),
    updateTask: builder.mutation<ITask, { id: string; data: Partial<ITask> }>({
      query: ({ id, data }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Tasks', id }],
    }),
    deleteTask: builder.mutation<{ message: string }, { taskId: string }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { taskId }) => [{ type: 'Tasks', id: taskId }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
