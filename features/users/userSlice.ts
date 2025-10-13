import { RootState } from "@/app/store";
import { User } from "@/interface/user.interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";


interface userState{
    user: User | null;
    accessToken: string | null;
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
};

const initialState: userState = {
    user: null,
    accessToken:null,
    status: "idle",
    error: null,
};

export const whoIsLog = createAsyncThunk<User, string | undefined, { state: RootState }>(
    "user/whoIsLog", 
    // Ajout de getState dans les arguments du thunk
    async (tokenOverride: string | undefined, { rejectWithValue, getState }) => {
    
        // 1. Détermine le token à utiliser :
        //    - Utilise tokenOverride (passé lors du callback OAuth)
        //    - OU utilise le token déjà présent dans le store (pour les appels de vérification)
        const currentToken = tokenOverride || getState().user.accessToken;

        if (!currentToken) {
            // Si aucun token n'est disponible (ni override, ni dans le store), rejeter.
            // Cela se produit si l'utilisateur n'est pas connecté.
            return rejectWithValue("Access Token est manquant pour la vérification."); 
        }
        
        try {
            // 2. Appel API sécurisé
            const response = await api.get('/connected', {
                headers: {
                    // Utilise le currentToken garanti non-null
                    Authorization: `Bearer ${currentToken}`
                }
            }); 
            
            // 3. Vérification des données et typage
            const rawUser = response.data as User; 
            
            if (!rawUser || !rawUser.id) {
                // Si l'API renvoie 200 mais un corps vide/invalide, rejetez.
                return rejectWithValue("Les données utilisateur sont vides.");
            }
                
            // 4. Succès : renvoie l'objet User
            return rawUser; 

        } catch (error: any) {
            // 5. Échec : Gère la réponse d'erreur de l'API
            const errorMessage = error.response?.data?.message || error.message || "Erreur de validation de session.";
            return rejectWithValue(errorMessage);
        }
    }
);

// Déconnexion et invalidation du token serveur
export const logoutAndInvalidate = createAsyncThunk<void, void, { state: RootState }>(
    'user/logoutAndInvalidate',
    async (_, { dispatch}) => {
       
         // 1. Nettoyage local forcé via l'action Redux simple
        // Cela vide state.user et state.accessToken, forçant redux-persist à vider le LocalStorage.
        dispatch(userSlice.actions.logout()); 
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
        state.accessToken = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.status = "idle";
            state.error = null;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(whoIsLog.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(whoIsLog.fulfilled, (state, action) => {
                state.status = "success";
                state.user = action.payload!;
            })
            .addCase(whoIsLog.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = null;
                state.error = action.error.message as string;
            });
    }
});


export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: { user: { status: userState["status"]; }; }) => state.user.status;
export const selectUserError = (state: { user: { error: userState["error"]; }; }) => state.user.error;
export const { setAccessToken,logout } = userSlice.actions;



export default userSlice.reducer;