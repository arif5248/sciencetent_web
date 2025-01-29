import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new Exam
export const fetchCreateClass = createAsyncThunk(
  "exam/fetchCreateClass",
  async (classData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/admin/newClass`, classData, config);
      return data;
    } catch (error) {
      // Handle error response, including HTTP 409 Conflict
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message); // Provide custom error message from backend
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);




// Course Slice

const classSlice = createSlice({
  name: "class",
  initialState: {
    isLoading: false,
    class: null,  // Store the course data
    error: null,
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCreateClass.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(fetchCreateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.class = action.payload.class;
        state.error = null;
        })
        .addCase(fetchCreateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.class = null;
        state.error = action.payload || "An unexpected error occurred";
        })

    }
});

export default classSlice.reducer;
