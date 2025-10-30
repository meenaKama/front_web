/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/app/store";
import { User } from "@/interface/user.interface";
import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { UserSecret } from "@/interface/userSecret.interface";


interface userState{
    user: User | null;
    userSecret:UserSecret|null,
    accessToken: string;
    status: "idle" | "loading" | "success" | "failed";
    ready:boolean,
    error: string | null;
};

const initialState: userState = {
    user: null,
    userSecret:null,
    accessToken: "",
    status: "idle",
    ready: false,
    error: null,
};

export const userLoggedOut = createAction('user/globalLogout');


export const whoIsLog = createAsyncThunk<{user:User,userSecret:UserSecret}, string | undefined, { state: RootState }>(
    "user/whoIsLog", 
    // Ajout de getState dans les arguments du thunk
    async (tokenOverride: string | undefined, { rejectWithValue, getState }) => {
    
        // 1. Détermine le token à utiliser :
        //    - Utilise tokenOverride (passé lors du callback OAuth)
        //    - OU utilise le token déjà présent dans le store (pour les appels de vérification)
        let currentToken = tokenOverride || getState().user.accessToken;

        let attempts = 0;
        while (!currentToken && attempts < 5) {
            await new Promise(res => setTimeout(res, 150)); // 150ms
            currentToken = getState().user.accessToken;
            attempts++;
        }
        
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
                },
                withCredentials:true,
            });
            
            //  Vérifie si le backend a bien renvoyé 200 et un vrai utilisateur
            if (response.status !== 200 || !response.data || response.data.message) {
                return rejectWithValue("Session invalide ou expirée.");
            }
            // 3. Vérification des données et typage
            const rawUser = response.data.data ; 
            
            if (!rawUser || !rawUser.user.id) {
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
    async (_, { dispatch,rejectWithValue}) => {
       try {
      // 1️⃣ Appeler l'API de logout (qui supprimera les cookies côté serveur)
      await api.get('/logout', { withCredentials: true });

      // 2️⃣ Nettoyage Redux après succès
      dispatch(userSlice.actions.logout());
    } catch (error: any) {
      console.error("Erreur lors du logout :", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Erreur de déconnexion");
    }
    }
);


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string | { accessToken: string }>) => {
            // Si on reçoit un objet { accessToken: "..." }, on extrait la valeur
            if (typeof action.payload === "object" && "accessToken" in action.payload) {
                state.accessToken = action.payload.accessToken;
            } else {
            // Sinon on prend la string directement
                state.accessToken = action.payload;
            }
        },
        logout: (state) => {
            state.user = null;
            state.userSecret = null;
            state.accessToken = "";
            state.status = "idle";
            state.error = null;
            state.ready = true;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        setUserSecret: (state, action: PayloadAction<UserSecret>) => {
            state.userSecret = action.payload
        },
        
    },

    extraReducers: builder => {
        builder
            .addCase(whoIsLog.pending, state => {
                state.status = "loading";
                state.error = null;
                state.ready = false;
            })
            .addCase(whoIsLog.fulfilled, (state, action) => {
                state.status = "success";
                state.user = action.payload.user;
                state.userSecret = action.payload.userSecret;
                state.ready = true;
            })
            .addCase(whoIsLog.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.accessToken = "";
                state.error = action.error.message as string;
                state.ready = true;
            });
    }
});


export const selectUser = (state: RootState) => state.user.user;
export const selectUserSecret = (state: RootState) => state.user.userSecret;
export const selectUserStatus = (state: { user: { status: userState["status"]; }; }) => state.user.status;
export const selectUserError = (state: { user: { error: userState["error"]; }; }) => state.user.error;
export const selectAccessToken = (state: RootState) => state.user.accessToken;;
export const { setAccessToken,logout,setUser,setUserSecret } = userSlice.actions;



export default userSlice.reducer;