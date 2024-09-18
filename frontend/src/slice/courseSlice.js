import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new course
export const fetchCreateCourse = createAsyncThunk(
  "course/fetchCreateCourse",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.post(`${baseUrl}/api/v1/admin/newCourse`, userData, config);
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

export const fetchAllCourses = createAsyncThunk("course/fetchAllCourses", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/admin/courses`, config);
  return data;
});
export const fetchAllCoursesForReg = createAsyncThunk("course/fetchAllCoursesForReg", async () => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.get(`${baseUrl}/api/v1/user/coursesForReg`, config);
  return data;
});
export const fetchDeleteCourse = createAsyncThunk("course/fetchDeleteCourse", async (courseId) => {
  const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  const { data } = await axios.delete(`${baseUrl}/api/v1/admin/deleteCourse/${courseId}`, config);
  return data;
});
export const fetchEditCourse = createAsyncThunk(
  "course/fetchEditCourse",
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/editCourse/${courseId}`, courseData, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);


// Course Slice
const courseSlice = createSlice({
  name: "course",
  initialState: {
    isLoading: false,
    course: null,  // Store the course data
    isAuthenticated: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateCourse.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.error = null;  // Reset error state
      })
      .addCase(fetchCreateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.course = action.payload.course;  // Store course data from the response
        state.error = null;  // Clear any previous errors
      })
      .addCase(fetchCreateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.course = null;
        state.error = action.payload || action.error.message;  // Use custom error message if available
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.allCourses = action.payload.courses;
        state.error = null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.allCourses = null;
        state.error = action.error.message;
      })


      .addCase(fetchAllCoursesForReg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCoursesForReg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCoursesForReg = action.payload.courses;
        state.error = null;
      })
      .addCase(fetchAllCoursesForReg.rejected, (state, action) => {
        state.isLoading = false;
        state.allCoursesForReg = null;
        state.error = action.error.message;
      })
      .addCase(fetchDeleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCourses = state.allCourses.filter(course => course._id !== action.meta.arg);
        state.error = null;
      })
      .addCase(fetchDeleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchEditCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEditCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the course data in the state
        const updatedCourse = action.payload.course;
        console.log('update course', action.payload)
        state.allCourses = state.allCourses.map(course =>
          course._id === updatedCourse._id ? updatedCourse : course
        );
        state.error = null;
      })
      .addCase(fetchEditCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default courseSlice.reducer;
