import { RootState } from "@/app/store";
import { User } from "@/interface/user.interface";
import { createSlice } from "@reduxjs/toolkit";


interface userState{
    user: User | null;
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
};

const initialState: userState = {
    user: null,
    status: "idle",
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
});


export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: { user: { status: userState["status"]; }; }) => state.user.status;
export const selectUserError = (state: { user: { error: userState["error"]; }; }) => state.user.error;



export default userSlice.reducer;