import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import ProfilePng from "../../images/user.png";
import { Link, useNavigate } from "react-router-dom";

import "./profile.css";

function Profile() {
  const navigate = useNavigate();

  const { user, isLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );
// console.log('======== is authenticated======', isAuthenticated)
  // useEffect(() => {
  //   // if (!isLoading && !isAuthenticated) {
  //   //   console.log("login....")
  //   //   navigate("/login");
  //   // }
  // }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  // if (!isAuthenticated) {
  //   return null; // Prevent the component from rendering anything before redirecting
  // }

  return (
    <Fragment>
      <MetaData title={`${user.name}'s Profile`} />

      <div className="container profile-container">
        <div>
          <h1>My Profile</h1>
          <img
            src={user.avatar.url === "" ? ProfilePng : user.avatar.url}
            alt={user.name}
          />
          <Link to="/me/update">Edit Profile</Link>
        </div>

        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>

          <div>
            <h4>Email</h4>
            <p>{user.email}</p>
          </div>

          <div>
            <h4>Joined On</h4>
            <p>{String(user.createdAt).substr(0, 10)}</p>
          </div>

          <div>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Profile;
