import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new Exam
export const fetchCreateExam = createAsyncThunk(
  "exam/fetchCreateExam",
  async (examData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/admin/newExam`, examData, config);
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


// export const fetchAllCourses = createAsyncThunk("course/fetchAllCourses", async () => {
//   const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
//   const { data } = await axios.get(`${baseUrl}/api/v1/admin/courses`, config);
//   return data;
// });
// export const fetchAllCoursesForReg = createAsyncThunk("course/fetchAllCoursesForReg", async () => {
//   const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
//   const { data } = await axios.get(`${baseUrl}/api/v1/user/coursesForReg`, config);
//   return data;
// });
// export const fetchDeleteCourse = createAsyncThunk("course/fetchDeleteCourse", async (courseId) => {
//   const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
//   const { data } = await axios.delete(`${baseUrl}/api/v1/admin/deleteCourse/${courseId}`, config);
//   return data;
// });
// export const fetchEditCourse = createAsyncThunk(
//   "course/fetchEditCourse",
//   async ({ courseId, courseData }, { rejectWithValue }) => {
//     try {
//       const config = { withCredentials: true };
//       const { data } = await axios.put(`${baseUrl}/api/v1/admin/editCourse/${courseId}`, courseData, config);
//       return data;
//     } catch (error) {
//       if (error.response && error.response.data.message) {
//         return rejectWithValue(error.response.data.message);
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );


// Course Slice

const examSlice = createSlice({
  name: "exam",
  initialState: {
    isLoading: false,
    exam: null,  // Store the course data
    error: null,
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCreateExam.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(fetchCreateExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.allApproveStudents = action.payload.students;
        state.error = null;
        })
        .addCase(fetchCreateExam.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.allApproveStudents = null;
        state.error = action.payload || "An unexpected error occurred";
        })
    }
});

export default examSlice.reducer;
