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
  const [paymentType, setPaymentType] = useState("Per Class");
  const [paymentAmount, setPaymentAmount] = useState();
  // const { user } = useSelector((state) => state.user);
  const { isLoading, error, course } = useSelector((state) => state.courses); // get batch state from Redux
  const [loading, setLoading] = useState(false);

  // Automatically generate branch code based on selected branch and year
//   useEffect(() => {
//     if (branchName && year) {
//       const branchInitial = branchName === "Cuet Branch" ? "CB" : "NB";
//       const yearCode = year.toString().slice(-2); // Get last two digits of the year
//       setBatchCode(`${branchInitial}${yearCode}`);
//     }
//   }, [branchName, year]);

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
        navigate("/dashboard"); // Navigate after success
      })
      .catch((err) => {
        console.error("Error creating batch:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title={`Create Batch`} />
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
                placeholder="Enter a amount as your Payment Type"
                  type="number"
                  id="paymentAmount"
                  className="form-control"
                  step="any"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </button>
            </form>
            {course && <p style={{ color: "green" }}>Course created successfully!</p>} {/* Success message */}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default CreateCourse;
