import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserUpdateProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userData) => {
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(`/api/v1/me/update`, userData, config);
    return data;
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
    // builder.addCase(fetchUserUpdateProfile.reset, (state) => {
    //   state.isUpdated = false;
    // });
  },
});
export const { reset } = userProfileSlice.actions;
export default userProfileSlice.reducer;
