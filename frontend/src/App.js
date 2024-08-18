import "./App.css";
import React from "react";
import WebFont from "webfontloader";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignUp from "./component/user/loginSignUp.js";
import Store from "./store";
import Profile from "./component/user/profile.js";
import UpdateProfile from "./component/user/updateProfile";
import { fetchLoadUser } from "./slice/userSlice";
import Home from "./component/Home/home.js";
import { useSelector } from "react-redux";
import Header from "./component/layout/header/header.js";

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    Store.dispatch(fetchLoadUser());
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated}
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/account" Component={Profile} />
        <Route exact path="/me/update" Component={UpdateProfile} />

        <Route exact path="/login" Component={LoginSignUp} />
      </Routes>
    </Router>
  );
}

export default App;
