import React, { Fragment, useState } from "react";
import "./resetPassword.css";
import Loader from "../layout/loader/loader";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/metaData/metaData";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import { fetchUpdatePass } from "../../slice/userProfileslice";

const ResetPassword = () => {
  const { isLoading } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState(""); // For error message if passwords don't match
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

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
        myForm.append("newPassword", newPassword);
        myForm.append("confirmPassword", confirmPassword);
        const result = await dispatch(fetchUpdatePass({token, myForm})).unwrap(); // Dispatch the delete batch action
        console.log(result)
        console.log("Password Reset successfully");
        navigate("/login"); 
      } catch (error) {
        console.error("Error password reset:", error);
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
          <MetaData title="Reset Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Reset Password</h2>
              <form className="updatePasswordForm" onSubmit={handleSubmit}>
                
                

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

export default ResetPassword;
