import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./createCourse.css";
import { fetchCreateCourse } from "../../slice/courseSlice";

function CreateCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const { isLoading, error, course } = useSelector((state) => state.courses); // Get course state from Redux
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Local state for error message
  const [successMessage, setSuccessMessage] = useState(null); // Local state for success message

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const myForm = new FormData();
    myForm.set("name", courseName);
    myForm.set("courseCode", courseCode);
    myForm.set("paymentType", paymentType);
    myForm.set("paymentAmount", paymentAmount);

    dispatch(fetchCreateCourse(myForm))
      .unwrap()
      .then(() => {
        setSuccessMessage("Course created successfully!"); // Show success message
        setTimeout(() => {
          setSuccessMessage(null); // Clear success message after 5 seconds
          navigate("/dashboard"); // Navigate after success
        }, 5000);
      })
      .catch((err) => {
        console.error("Error creating course:", err);
        setErrorMessage(err); // Show error message
        setTimeout(() => {
          setErrorMessage(null); // Clear error message after 5 seconds
        }, 5000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title={`Create Course`} />
      <div className="createCourseSection">
        <h2>Create Course</h2>

        {isLoading || loading ? (
          <Loader />
        ) : (
          <Fragment>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="courseName">Course Name</label>
                <input
                  placeholder="Enter a Course Name"
                  type="text"
                  id="courseName"
                  className="form-control"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="courseCode">Course Code</label>
                <input
                  placeholder="Enter a Course Code"
                  type="text"
                  id="courseCode"
                  className="form-control"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentType">Payment Type</label>
                <select
                  id="paymentType"
                  className="form-control"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="perClass">Per Class</option>
                  <option value="perMonth">Per Month</option>
                  <option value="perCourse">Per Course</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="paymentAmount">Payment Amount</label>
                <input
                  placeholder="Enter an amount as your Payment Type"
                  type="number"
                  id="paymentAmount"
                  className="form-control"
                  step="any"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error */}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* Display success */}

              <button style={{marginTop: "5px"}} type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </button>
            </form>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default CreateCourse;
