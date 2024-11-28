import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl= "http://localhost:5000"
const baseUrl= "https://sciencetent-backend.vercel.app"

export const fetchUserUpdateProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userData) => {
    console.log('user data', userData);
    const config = { withCredentials: true }; // No need for Content-Type
    const { data } = await axios.put(`${baseUrl}/api/v1/me/update`, userData, config);
    return data;
  }
);

export const fetchUpdatePass = createAsyncThunk(
  "user/fetchUpdatePass",
  async (apiData, { rejectWithValue }) => {
    
    try {
      const config = { withCredentials: true };
      const { data } = await axios.put(`${baseUrl}/api/v1/password/reset/:${apiData.token}`, apiData.myForm, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);


const userProfileSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    isUpdated: false,
    error: null,
  },
  reducers: {
    reset: (state) => {
      // Reset your slice's state here
      state.isUpdated = false; // Replace 'initialState' with your initial state
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserUpdateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserUpdateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isUpdated = action.payload.success;
      state.error = null;
    });
    builder.addCase(fetchUserUpdateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchUpdatePass.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUpdatePass.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchUpdatePass.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    // builder.addCase(fetchUserUpdateProfile.reset, (state) => {
    //   state.isUpdated = false;
    // });
  },
});
export const { reset } = userProfileSlice.actions;
export default userProfileSlice.reducer;
