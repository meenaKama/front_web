import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/users/userSlice";
import { initializeApi } from '@/lib/api';
import storage from 'redux-persist/lib/storage'; // localStorage

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// 1. Configuration persist
const persistConfig = {
  key: 'root',    // clé dans localStorage
  storage,        // type de stockage (localStorage)
  whitelist: ['user'], // seuls les reducers listés ici seront persistés
};

// 2. Combiner les reducers
const rootReducer = combineReducers({
  user: userReducer,
  // ajoute d'autres reducers ici
});

// 3. Créer le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Créer le store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        // ⚡ Ici on ignore toutes les actions internes de redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  
});

// 5. Créer le persistor
export const persistor = persistStore(store);


// 🚀 INITIALISATION DE L'API APRÈS LA CRÉATION DU STORE
initializeApi(store.getState);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch