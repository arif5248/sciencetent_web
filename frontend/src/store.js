import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import userProfileslice from "./slice/userProfileslice";
import batchSlice from "./slice/batchSlice";
import courseSlice from "./slice/courseSlice";
import permissionSlice from "./slice/permissionSlice";
import studentSlice from "./slice/studentSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    profile: userProfileslice,
    batch: batchSlice,
    courses: courseSlice,
    permissions : permissionSlice,
    student : studentSlice
  },
});
export default Store;
