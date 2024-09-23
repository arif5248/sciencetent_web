import React, { Fragment, useState } from "react";
import "./forgotPassword.css";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/metaData/metaData";
import { fetchForgotPass } from "../../slice/userSlice";

const ForgotPassword = () => {
  const { isLoading } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false); 
  const [email, setEmail] = useState("");
  
  const [error, setError] = useState(""); // For error message if passwords don't match
  const [showsuccess, setShowSuccess] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();

    setError("");
    setShowSuccess("");

    try {
        setLoading(true); // Set loading to true while processing
        const result = await dispatch(fetchForgotPass({"email" : email})).unwrap(); // Dispatch the delete batch action
        console.log(result)
        console.log("Reset Email sent successfully");
        setShowSuccess(result.message)
        // navigate("/account"); 
      } catch (error) {
        console.error("Error :", error);
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
          <MetaData title="Forgot Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Forgot Password</h2>
              <form className="updatePasswordForm" onSubmit={handleSubmit}>
                
                {/* Old Password */}
                <div className="inputGroup">
                  <label htmlFor="email">Enter your Email</label>
                  <div className="passwordWrapper">
                    <input
                      type= "email"
                      id="email"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                

                {/* Error message if passwords don't match */}
                {error && <p className="errorMessage">{error}</p>}
                {showsuccess && <p className="successMessage">{showsuccess}</p>}

                <button type="submit" className="updatePasswordBtn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
