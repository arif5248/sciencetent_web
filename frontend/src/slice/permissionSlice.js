import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "http://localhost:5000";
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new batch
// export const fetchCreateBatch = createAsyncThunk(
//   "batch/fetchCreateBatch",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
//       const { data } = await axios.post(`${baseUrl}/api/v1/admin/batch/new`, userData, config);
//       return data;
//     } catch (error) {
//       // Handle error response, including HTTP 409 Conflict
//       if (error.response && error.response.data.message) {
//         return rejectWithValue(error.response.data.message); // Provide custom error message from backend
//       }
//       return rejectWithValue(error.message); // Fallback for other errors
//     }
//   }
// );

export const fetchAllPermissions = createAsyncThunk("permissions/fetchAllPermissions", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/masterAdmin/permissions`, config);
  return data;
});


export const fetchAssignPermissions = createAsyncThunk(
  "permissions/fetchAssignPermissions",
  async ( permissionData , { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/masterAdmin/permission/assign`, permissionData, config);
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
const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    isLoading: false,
    permission: null,  // Store the batch data
    isAuthenticated: false,
    error: null,
    allPermissions: null
  },
  extraReducers: (builder) => {
    builder
    //   .addCase(fetchCreateBatch.pending, (state) => {
    //     state.isLoading = true;
    //     state.isAuthenticated = false;
    //     state.error = null;  // Reset error state
    //   })
    //   .addCase(fetchCreateBatch.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.isAuthenticated = true;
    //     state.batch = action.payload.batch;  // Store batch data from the response
    //     state.error = null;  // Clear any previous errors
    //   })
    //   .addCase(fetchCreateBatch.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isAuthenticated = false;
    //     state.batch = null;
    //     state.error = action.payload || action.error.message;  // Use custom error message if available
    //   })

      .addCase(fetchAllPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.allPermissions = action.payload.permissions;
        state.error = null;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.allPermissions = null;
        state.error = action.error.message;
      })

      
      .addCase(fetchAssignPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the batch data in the state
        const updatedBatch = action.payload.batch;
        state.allBatch = state.allBatch.map(batch =>
          batch._id === updatedBatch._id ? updatedBatch : batch
        );
        state.error = null;
      })
      .addCase(fetchAssignPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default permissionSlice.reducer;
