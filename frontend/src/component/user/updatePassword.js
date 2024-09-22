import React, { Fragment, useState } from "react";
import "./updatePassword.css";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/metaData/metaData";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import { fetchUpdatePass } from "../../slice/userProfileslice";

const UpdatePassword = () => {
  const { isLoading } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState(""); // For error message if passwords don't match
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return; // Prevent dispatch
    }

    // Clear the error if passwords match
    setError("");

    try {
        setLoading(true); // Set loading to true while processing
        const myForm = new FormData();
        myForm.append("oldPassword", oldPassword);
        myForm.append("newPassword", newPassword);
        myForm.append("confirmPassword", confirmPassword);
        const result = await dispatch(fetchUpdatePass(myForm)).unwrap(); // Dispatch the delete batch action
        console.log(result)
        console.log("Password updated successfully");
        navigate("/account"); 
      } catch (error) {
        console.error("Error password update:", error);
        setError(error) // Handle any errors during deletion
      } finally {
        setLoading(false); // Set loading to false after deletion completes
        // Close the popup after deletion
      }
     // Navigate to the account page on success
  };

  return (
    <Fragment>
      {isLoading || loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Password</h2>
              <form className="updatePasswordForm" onSubmit={handleSubmit}>
                
                {/* Old Password */}
                <div className="inputGroup">
                  <label htmlFor="oldPassword">Old Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="oldPassword"
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="eyeIcon"
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div className="inputGroup">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="eyeIcon"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="inputGroup">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="passwordWrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="eyeIcon"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Error message if passwords don't match */}
                {error && <p className="errorMessage">{error}</p>}

                <button type="submit" className="updatePasswordBtn">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
