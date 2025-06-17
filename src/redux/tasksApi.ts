import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ITask } from '../types';

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
        ...tasks.map((t) => ({ type: 'Tasks' as const, id: t.id })),
      ],
    }),
    getTask: builder.query<ITask, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'get' }),
      providesTags: (_res, _err, id) => [{ type: 'Tasks', id }],
    }),
    createTask: builder.mutation<
      ITask,
      { boardId: string; data: Partial<ITask> }
    >({
      query: ({ boardId, data }) => ({
        url: `/boards/${boardId}/tasks`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    updateTask: builder.mutation<ITask, { id: string; data: Partial<ITask> }>({
      query: ({ id, data }) => ({ url: `/tasks/${id}`, method: 'put', data }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Tasks', id }],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'delete' }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
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
