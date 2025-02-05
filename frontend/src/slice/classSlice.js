import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl = "https://sciencetent-backend.vercel.app";

// Thunk for creating a new Exam
export const fetchCreateClass = createAsyncThunk(
  "class/fetchCreateClass",
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

export const fetchPendingClasses = createAsyncThunk(
  "class/fetchPendingClasses",
  async (_, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.get(`${baseUrl}/api/v1/admin/getPendingClassesGroupedByDate`, config);
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

export const fetchPendingClassesToApprove = createAsyncThunk(
  "class/fetchPendingClassesToApprove",
  async (apiData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/pendingClassesToApprove`, apiData, config);
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

export const fetchUpdateClassMessageReport = createAsyncThunk(
  "class/fetchUpdateClassMessageReport",
  async (apiData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/updateClassMessageReport`, apiData, config);
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
    pendingClasses: []
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

        .addCase(fetchPendingClasses.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchPendingClasses.fulfilled, (state, action) => {
          state.isLoading = false;
          state.pendingClasses = action.payload.data;
          state.error = null;
        })
        .addCase(fetchPendingClasses.rejected, (state, action) => {
          state.isLoading = false;
          state.pendingClasses = [];
          state.error = action.payload || "An unexpected error occurred";
        })

        .addCase(fetchPendingClassesToApprove.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchPendingClassesToApprove.fulfilled, (state, action) => {
          // console.log(payload)
          state.isLoading = false;
          state.class = action.payload.approveAndReportInserted;
          // state.pendingClasses = pendingClasses.filter(classItem => classItem.date !== )
          state.error = null;
        })
        .addCase(fetchPendingClassesToApprove.rejected, (state, action) => {
          state.isLoading = false;
          state.pendingClasses = [];
          state.error = action.payload || "An unexpected error occurred";
        })

        .addCase(fetchUpdateClassMessageReport.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchUpdateClassMessageReport.fulfilled, (state, action) => {
          // console.log(payload)
          state.isLoading = false;
          state.class = action.payload.approveAndReportInserted;
          // state.pendingClasses = pendingClasses.filter(classItem => classItem.date !== )
          state.error = null;
        })
        .addCase(fetchUpdateClassMessageReport.rejected, (state, action) => {
          state.isLoading = false;
          state.pendingClasses = [];
          state.error = action.payload || "An unexpected error occurred";
        })

    }
});

export default classSlice.reducer;
