import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "http://localhost:5000";
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new batch
export const fetchCreateBatch = createAsyncThunk(
  "batch/fetchCreateBatch",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/admin/batch/new`, userData, config);
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

// Batch Slice
const batchSlice = createSlice({
  name: "batch",
  initialState: {
    isLoading: false,
    batch: null,  // Store the batch data
    isAuthenticated: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateBatch.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.error = null;  // Reset error state
      })
      .addCase(fetchCreateBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.batch = action.payload.batch;  // Store batch data from the response
        state.error = null;  // Clear any previous errors
      })
      .addCase(fetchCreateBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.batch = null;
        state.error = action.payload || action.error.message;  // Use custom error message if available
      });
  },
});

export default batchSlice.reducer;
