import { RootState } from "@/app/store";
import { User } from "@/interface/user.interface";
import { Url } from "@/lib/Url";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


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

export const whoIsLog = createAsyncThunk("user/login", async (): Promise<User> => {
    
    const userLoged: { data: User } =
        await axios.get(Url.whoIsLog, {
        withCredentials: true,
    });

    return userLoged.data;
})

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
                state.user = action.payload;
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