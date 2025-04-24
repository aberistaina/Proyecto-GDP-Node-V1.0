import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';


const initialState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const token = action.payload;
            state.token = token;
            state.isAuthenticated = true;
            state.user = jwtDecode(token);
            localStorage.setItem("token", token);
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.clear();
        },
        setAuthFromStorage: (state) => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const now = Date.now() / 1000;
                    if (decoded.exp > now) {
                        state.token = token;
                        state.isAuthenticated = true;
                        state.user = decoded;
                    } else {
                        localStorage.clear();
                    }
                } catch (err) {
                    localStorage.clear();
                }
            }
        },
    },
});

export const { loginSuccess, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
