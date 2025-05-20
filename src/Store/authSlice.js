import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    role: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
        }
    }
});


export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;