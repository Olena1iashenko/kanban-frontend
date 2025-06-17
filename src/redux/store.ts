import { configureStore } from '@reduxjs/toolkit';
import { boardsApi } from '../redux/boardsApi';
import { tasksApi } from '../redux/tasksApi';

export const store = configureStore({
  reducer: {
    [boardsApi.reducerPath]: boardsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(boardsApi.middleware)
      .concat(tasksApi.middleware),
});
