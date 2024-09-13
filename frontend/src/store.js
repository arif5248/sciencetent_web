import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import userProfileslice from "./slice/userProfileslice";
import batchSlice from "./slice/batchSlice";
import courseSlice from "./slice/courseSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    profile: userProfileslice,
    batch: batchSlice,
    courses: courseSlice
  },
});
export default Store;
