import React, { Fragment, useEffect, useState } from "react";
import "./updateProfile.css";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/metaData/metaData";
import { fetchUserUpdateProfile, reset } from "../../slice/userProfileslice";
import { fetchLoadUser } from "../../slice/userSlice";
import ProfilePng from "../../images/user.png";

const UpdateProfile = () => {
  const { user, isLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { error, isUpdated } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);  // Changed to null initially
  const [avatarPreview, setAvatarPreview] = useState(ProfilePng);

  const updateProfileSubmit = (e) => {
    e.preventDefault();
  
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("email", email);
  
    if (avatar) {
      myForm.append("avatar", avatar);
    }
  
    // Log the FormData contents
    // for (let pair of myForm.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
  
    dispatch(fetchUserUpdateProfile(myForm));
  };
  
  
  const UpdateProfileDataChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setAvatar(file); // Set the avatar state to the file object
  
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // Set the preview to base64 for UI display
        }
      };
      reader.readAsDataURL(file);
    }
  };
  

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url || ProfilePng);
    }
    if (error) {
      console.error(error);
    }

    if (isUpdated) {
      dispatch(fetchLoadUser());
      navigate("/account");
      dispatch(reset());
    }
  }, [dispatch, user, error, navigate, isUpdated]);

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          {!isAuthenticated ? (
            navigate("/login")
          ) : (
            <Fragment>
              <MetaData title="Update Profile" />
              <div className="updateProfileContainer">
                <div className="updateProfileBox">
                  {error && (
                    <div className="error-message update-error-message">
                      <p>
                        Failed to update your profile. Please try again with an image size less than 1MB or contact Admin.
                      </p>
                      <div className="btn btn-danger close-btn">X</div>
                    </div>
                  )}
                  <h2 className="updateProfileHeading">Update Profile</h2>
                  <form
                    className="updateProfileForm"
                    encType="multipart/form-data"
                    onSubmit={updateProfileSubmit}
                  >
                    <div className="updateProfileName">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="updateProfileEmail">
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div id="updateProfileImage">
                      <img src={avatarPreview} alt="Avatar Preview" />
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={UpdateProfileDataChange}
                      />
                    </div>

                    <input
                      type="submit"
                      value="Update"
                      className="updateProfileBtn"
                    />
                  </form>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
