import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Header from "./component/layout/header/header.js";
import Home from "./component/Home/home.js";
import LoginSignUp from "./component/user/loginSignUp.js";
import Profile from "./component/user/profile.js";
import UpdateProfile from "./component/user/updateProfile";
import ProtectedRoute from "./component/ProtectedRoute";
import { fetchLoadUser } from "./slice/userSlice";
import Loader from "./component/layout/loader/loader";

import "./App.css"
import MainDashBoard from "./component/dashBoard/mainDash.js";

function App() {
  const dispatch = useDispatch();
  // const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    dispatch(fetchLoadUser()).then(() => {
      setAppLoading(false);
    });
  }, [dispatch]);

  if (appLoading) {
    return <Loader />; // Show a loader until fetchLoadUser is complete
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route
          exact
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/me/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route exact path="/login" Component={LoginSignUp} />
      </Routes>
    </Router>
  );
}

export default App;
