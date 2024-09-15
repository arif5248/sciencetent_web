import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl= "https://sciencetent-backend.vercel.app"


export const fetchRegisterStudent = createAsyncThunk(
  "student/fetchRegisterStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const config = {  withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/student/register`, studentData, config);
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


const studentSlice = createSlice({
  name: "student",
  initialState: {
    isLoading: false,
    isAuthenticated: false,
    student : null,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRegisterStudent.pending, (state) => {
      console.log(2)

      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(fetchRegisterStudent.fulfilled, (state, action) => {
      console.log(1)
      state.isLoading = false;
      state.isAuthenticated = true;
      state.student = action.payload.student;
      state.message = action.payload.message ? action.payload.message  : ""
      state.error = null;
    });
    builder.addCase(fetchRegisterStudent.rejected, (state, action) => {
      console.log(3)

      state.isLoading = false;
      
      state.isAuthenticated = false;
      state.error = action.payload || action.error.message; 
    });
  },
});
export default studentSlice.reducer;
