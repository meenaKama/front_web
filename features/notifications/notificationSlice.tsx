import { Notification } from "@/interface/notification.interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { userLoggedOut } from "../users/userSlice";
import { RootState } from "@/app/store";



interface notificationState {
    notification: Notification[];
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
};

const initialState: notificationState = {
    notification: [] as Notification[],
    status: "idle",
    error: null,
};



export const getNotification = createAsyncThunk("notification/requete", async (accesToken: string) => {

    if (!accesToken) {
        throw new Error("Access token not found. Cannot fetch notifications.");
    }

    const response = await api.get("/notification/", {
        headers: {
            Authorization: `Bearer ${accesToken}`
        },
        withCredentials: true
    })

    return response.data.data as Notification[]
});


export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            const exists = state.notification.some(n => n.id === action.payload.id);
            if (!exists) {
                state.notification.unshift(action.payload)
            }
        },

        markAllAsRead: (state) => {
            state.notification = state.notification.map(n => ({ ...n, read: true }));
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notification = state.notification.filter(n => n.id !== action.payload);
        },
        setNotificationRead: (state, action: PayloadAction<string>) => {
            const notif = state.notification.find(n => n.id === action.payload);
            if (notif) {
                notif.read = true
            }
        },
    },

    extraReducers: builder => {
        builder
            .addCase(getNotification.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getNotification.fulfilled, (state, action) => {
                state.status = "success";
                state.notification = action.payload;
            })
            .addCase(getNotification.rejected, (state, action) => {
                state.status = "failed";
                state.notification = [];
                state.error = action.error.message as string;
            })
            .addCase(userLoggedOut, () => {
                return initialState
            })
    }
});

export const selectNotification = (state: RootState) => state.notification.notification;
export const selectNotificationStatus = (state: { notification: { status: notificationState["status"]; }; }) => state.notification.status;
export const selectNotificationError = (state: { notification: { error: notificationState["error"]; }; }) => state.notification.error;

export const { addNotification, markAllAsRead, removeNotification, setNotificationRead } =
    notificationSlice.actions;


export default notificationSlice.reducer;