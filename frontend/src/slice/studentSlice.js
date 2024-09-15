import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl= "https://sciencetent-backend.vercel.app"

export const fetchRegisterStudent = createAsyncThunk(
  "student/fetchRegisterStudent",
  async (studentData) => {
    const config = { withCredentials: true }; // No need for Content-Type
    const { data } = await axios.post(`${baseUrl}/api/v1/me/update`, studentData, config);
    return data;
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
      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(fetchRegisterStudent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.student = action.payload.student;
      state.error = null;
    });
    builder.addCase(fetchRegisterStudent.rejected, (state, action) => {
      state.isLoading = false;
      
      state.isAuthenticated = false;
      state.error =  action.payload || action.error.message;
    });
  },
});
export default studentSlice.reducer;
