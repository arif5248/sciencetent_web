import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl= process.env.base_url ? process.env.base_url : "http://localhost:5000"
// const baseUrl= "https://sciencetent-backend.vercel.app"


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

export const fetchAllPendingStudents = createAsyncThunk("student/fetchAllPendingStudents", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/admin/pending-students`, config);
  return data;
});

export const fetchApproveStudent = createAsyncThunk(
  "student/fetchApproveStudent",
  async (studentID, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/approve/students/${studentID}`, {}, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    isLoading: false,
    isAuthenticated: false,
    student : null,
    allPendingStudents : null,
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
    })

    .addCase(fetchAllPendingStudents.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchAllPendingStudents.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.allPendingStudents = action.payload.students;
      state.error = null;
    })
    .addCase(fetchAllPendingStudents.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.allBatch = null;
      state.error = action.error.message;
    })

    .addCase(fetchApproveStudent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchApproveStudent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allPendingStudents = state.allPendingStudents.filter(student => student._id !== action.meta.arg);
      state.error = null;
    })
    .addCase(fetchApproveStudent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    })
  },
});
export default studentSlice.reducer;
