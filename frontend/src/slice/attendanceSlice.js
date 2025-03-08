import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new Exam
export const fetchCreateAttendance = createAsyncThunk(
  "exam/fetchCreateAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/student/createAttendance`, attendanceData, config);
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

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCreateAttendance.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(fetchCreateAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        })
        .addCase(fetchCreateAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An unexpected error occurred";
        })

        
    }
});

export default attendanceSlice.reducer;
