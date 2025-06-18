import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IBoard } from '../types';

export const boardsApi = createApi({
  reducerPath: 'boardsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://kanban-backend-b53c.onrender.com/api/',
  }),
  tagTypes: ['Boards'],
  endpoints: (builder) => ({
    getBoards: builder.query<IBoard[], void>({
      query: () => ({ url: '/boards', method: 'get' }),
    }),
    getBoard: builder.query<IBoard, string>({
      query: (id) => ({ url: `/boards/${id}`, method: 'get' }),
      providesTags: (_res, _err, id) => [{ type: 'Boards', id }],
    }),
    searchBoards: builder.query<IBoard[], string>({
      query: (q) => ({ url: `/boards/search?q=${q}`, method: 'get' }),
      providesTags: ['Boards'],
    }),
    createBoard: builder.mutation<IBoard, Partial<IBoard>>({
      query: (body) => ({ url: '/boards', method: 'post', body }),
      invalidatesTags: ['Boards'],
    }),
    updateBoard: builder.mutation<
      IBoard,
      { id: string; body: Partial<IBoard> }
    >({
      query: ({ id, body }) => ({
        url: `/boards/${id}`,
        method: 'put',
        data: body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Boards', id }],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({ url: `/boards/${id}`, method: 'delete' }),
      invalidatesTags: ['Boards'],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useSearchBoardsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardsApi;
