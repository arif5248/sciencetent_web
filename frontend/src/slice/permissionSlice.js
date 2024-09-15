import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchSingleUser } from "./userSlice"; // Import the thunk from userSlice

// const baseUrl = "http://localhost:5000";
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for fetching all permissions
export const fetchAllPermissions = createAsyncThunk(
  "permissions/fetchAllPermissions",
  async () => {
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
    const { data } = await axios.get(`${baseUrl}/api/v1/masterAdmin/permissions`, config);
    return data;
  }
);

// Thunk for assigning permissions
export const fetchAssignPermissions = createAsyncThunk(
  "permissions/fetchAssignPermissions",
  async (permissionData, { rejectWithValue, dispatch }) => {
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/masterAdmin/permission/assign`, permissionData, config);
      
      // Dispatch the fetchSingleUser thunk to update user details
      dispatch(fetchSingleUser(permissionData.userName)); // Adjust based on how you provide user info
      
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Slice for permissions
const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    isLoading: false,
    allPermissions: [],  // Ensure it's an array
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPermissions = action.payload.permissions || [];
        state.error = null;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAssignPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignPermissions.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAssignPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default permissionSlice.reducer;
