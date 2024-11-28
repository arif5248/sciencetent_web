import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl= "https://sciencetent-backend.vercel.app"

export const fetchUserRegister = createAsyncThunk(
  "user/fetchUserRegistration",
  async (userData) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/register`, userData, config);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const fetchUserLogin = createAsyncThunk(
  "user/fetchUserLogin",
  async ({ email, password }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/login`,
        { email, password },
        config
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const fetchUserLogout = createAsyncThunk(
  "user/fetchLogout",
  async () => {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
    await axios.get(`${baseUrl}/api/v1/logout`, config);
  }
);

export const fetchLoadUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const config = { withCredentials: true };
    const { data } = await axios.get(`${baseUrl}/api/v1/me`, config);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
  
});
export const fetchSingleUser = createAsyncThunk("user/fetchSingleUser", async (userName) => {
  const config =  { withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/admin/getSingleUser/${userName}`, config);
  return data;
});
export const fetchForgotPass = createAsyncThunk(
  "user/fetchForgotPass",
  async (userData, { rejectWithValue }) => {
    try {
      // const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/password/forgot`, userData);
      return data;
    } catch (error) {
      // Handle error response, including HTTP 409 Conflict
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message); // Provide custom error message from backend
      }
      return rejectWithValue(error.message); // Fallback for other errors
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    user: null,  // Ensure consistency in initializing and resetting user state
    isAuthenticated: false,
    error: null,
    singleUser: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogin.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(fetchUserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(fetchUserLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchUserLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLoadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(fetchLoadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(fetchUserRegister.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(fetchUserRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(fetchSingleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleUser = action.payload.user;
        state.error = null;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.singleUser = null;
        state.error = action.error.message;
      })

      .addCase(fetchForgotPass.pending, (state) => {
        state.isLoading = true;
        state.error = null;  // Reset error state
      })
      .addCase(fetchForgotPass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;  // Clear any previous errors
      })
      .addCase(fetchForgotPass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;  // Use custom error message if available
      })
  },
});

export default userSlice.reducer;
