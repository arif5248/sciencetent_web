import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import userProfileslice from "./slice/userProfileslice";
import batchSlice from "./slice/batchSlice";
import courseSlice from "./slice/courseSlice";
import permissionSlice from "./slice/permissionSlice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    profile: userProfileslice,
    batch: batchSlice,
    courses: courseSlice,
    permissions : permissionSlice
  },
});
export default Store;
