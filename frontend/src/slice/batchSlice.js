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

export const fetchAllBatch = createAsyncThunk("batch/fetchAllBatch", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/admin/batches`, config);
  return data;
});
export const fetchAllBatchForReg = createAsyncThunk("batch/fetchAllBatchForReg", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/user/batchesForStudentReg`, config);
  return data;
});

export const fetchDeleteBatch = createAsyncThunk("batch/fetchDeleteBatch", async (batchId) => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.delete(`${baseUrl}/api/v1/admin/deleteBatch/${batchId}`, config);
  return data;
});
export const fetchEditBatch = createAsyncThunk(
  "batch/fetchEditBatch",
  async ({ batchId, batchData }, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/editBatch/${batchId}`, batchData, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
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
      })
      .addCase(fetchAllBatch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.allBatch = action.payload.batches;
        state.error = null;
      })
      .addCase(fetchAllBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.allBatch = null;
        state.error = action.error.message;
      })


      .addCase(fetchAllBatchForReg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBatchForReg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBatchForReg = action.payload.batches;
        state.error = null;
      })
      .addCase(fetchAllBatchForReg.rejected, (state, action) => {
        state.isLoading = false;
        state.allBatchForReg = null;
        state.error = action.error.message;
      })
      .addCase(fetchDeleteBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeleteBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBatch = state.allBatch.filter(batch => batch._id !== action.meta.arg);
        state.error = null;
      })
      .addCase(fetchDeleteBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchEditBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEditBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the batch data in the state
        const updatedBatch = action.payload.batch;
        state.allBatch = state.allBatch.map(batch =>
          batch._id === updatedBatch._id ? updatedBatch : batch
        );
        state.error = null;
      })
      .addCase(fetchEditBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default batchSlice.reducer;
