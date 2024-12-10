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

export const fetchGetAllExamBatchWise = createAsyncThunk(
  "exam/fetchGetAllExamBatchWise",
  async (batchId, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.get(`${baseUrl}/api/v1/admin/getAllExamBatchWise/${batchId}`, config);
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

export const fetchBatchWiseMarksInput = createAsyncThunk(
  "exam/fetchBatchWiseMarksInput",
  async (marksData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/admin/bachWiseMarksInput/${marksData.examId}`, {allMarks:marksData.allMarks}, config);
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

const examSlice = createSlice({
  name: "exam",
  initialState: {
    isLoading: false,
    exam: null,  // Store the course data
    error: null,
    allExamBatchWise: null
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCreateExam.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(fetchCreateExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exam = action.payload.exam;
        state.error = null;
        })
        .addCase(fetchCreateExam.rejected, (state, action) => {
        state.isLoading = false;
        state.exam = null;
        state.error = action.payload || "An unexpected error occurred";
        })

        .addCase(fetchGetAllExamBatchWise.pending, (state) => {
          state.isLoading = true;
          })
          .addCase(fetchGetAllExamBatchWise.fulfilled, (state, action) => {
          state.isLoading = false;
          state.allExamBatchWise = action.payload.exams;
          state.error = null;
          })
          .addCase(fetchGetAllExamBatchWise.rejected, (state, action) => {
          state.isLoading = false;
          state.allExamBatchWise = null;
          state.error = action.payload || "An unexpected error occurred";
          })

          .addCase(fetchBatchWiseMarksInput.pending, (state) => {
            state.isLoading = true;
            })
            .addCase(fetchBatchWiseMarksInput.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            })
            .addCase(fetchBatchWiseMarksInput.rejected, (state, action) => {
            state.isLoading = false;
            state.exam = null;
            state.error = action.payload || "An unexpected error occurred";
            })
    }
});

export default examSlice.reducer;
