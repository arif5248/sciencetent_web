import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

export const fetchCreateOtp = createAsyncThunk(
  "batch/fetchCreateOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/createOtp`, otpData, config);
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
const otpSlice = createSlice({
  name: "otp",
  initialState: {
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;  // Reset error state
      })
      .addCase(fetchCreateOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;  // Clear any previous errors
      })
      .addCase(fetchCreateOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;  // Use custom error message if available
      })

  },
});

export default otpSlice.reducer;
