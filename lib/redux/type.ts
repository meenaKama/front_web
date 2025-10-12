import { store } from '@/app/store'; // Temporairement pour déduire les types

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Note: Vous devrez peut-être déplacer cette déduction après avoir créé le store
// Si la déduction cause le blocage, vous pouvez définir ces types manuellement si nécessaire.