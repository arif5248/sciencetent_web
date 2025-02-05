import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import userProfileslice from "./slice/userProfileslice";
import batchSlice from "./slice/batchSlice";
import courseSlice from "./slice/courseSlice";
import permissionSlice from "./slice/permissionSlice";
import studentSlice from "./slice/studentSlice";
import examSlice from "./slice/examSlice";
import classSlice from "./slice/classSlice"

const Store = configureStore({
  reducer: {
    user: userSlice,
    profile: userProfileslice,
    batch: batchSlice,
    courses: courseSlice,
    permissions : permissionSlice,
    student : studentSlice,
    exam : examSlice,
    class : classSlice,
  },
});
export default Store;
