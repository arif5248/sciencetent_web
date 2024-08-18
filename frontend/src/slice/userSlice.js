import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserRegister = createAsyncThunk(
  "user/fetchUserRegistration",
  async (userData) => {
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`/api/v1/register`, userData, config);
    return data;
  }
);

export const fetchUserLogin = createAsyncThunk(
  "user/fetchUserLogin",
  async ({ email, password }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `/api/v1/login`,
        { email, password },
        config
      );
      return data;
    } catch (error) {
      throw error.response.data; 
    }
  }
);

export const fetchUserLogout = createAsyncThunk(
  "user/fetchLogout",
  async () => {
    await axios.get(`/api/v1/logout`);
  }
);

export const fetchLoadUser = createAsyncThunk("user/fetchUser", async () => {
  const { data } = await axios.get(`/api/v1/me`);
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    user: {},
    isAuthenticated: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserLogin.pending, (state) => {
      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(fetchUserLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(fetchUserLogin.rejected, (state, action) => {
      console.log("=======================================", action);
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.error.message;
    });

    builder.addCase(fetchUserLogout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(fetchUserLogout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchLoadUser.pending, (state) => {
      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(fetchLoadUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(fetchLoadUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.error.message;
    });

    builder.addCase(fetchUserRegister.pending, (state) => {
      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(fetchUserRegister.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user; // Assuming 'user' is a property in the payload
      state.error = null;
    });
    builder.addCase(fetchUserRegister.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
