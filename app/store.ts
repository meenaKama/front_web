import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/users/userSlice";
import { initializeApi } from '@/lib/api';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// 🚀 INITIALISATION DE L'API APRÈS LA CRÉATION DU STORE
initializeApi(store.getState);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch