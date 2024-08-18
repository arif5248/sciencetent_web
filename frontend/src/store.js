import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import userProfileslice from "./slice/userProfileslice";

const Store = configureStore({
  reducer: {
    user: userSlice,
    profile: userProfileslice,
  },
});
export default Store;
