import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import "./studentRegistration.css";
import { fetchAllBatchForExReg } from "../../slice/batchSlice";
import { fetchAllCoursesForReg } from "../../slice/courseSlice";
import { fetchRegisterExStudent, fetchRegisterStudent } from "../../slice/studentSlice";

function ExStudentRegistration() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { isLoading, isAuthenticated, error } = useSelector((state) => state.student);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const [batchError, setBatchError] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [batch, setBatch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [courseOptions, setCourseOptions] = useState([]); 
  const [batchOptions, setBatchOptions] = useState([]); 

  useEffect(() => {
    dispatch(fetchAllBatchForExReg())
      .then((response) => {
        if (response.error) {
          setBatchError("Failed to load batches. Please try again.");
        } else {
          setBatchOptions(response.payload.batches);
          setBatchError(null);
        }
      })
      .catch(() => setBatchError("Failed to load batches. Please try again."));

    dispatch(fetchAllCoursesForReg())
      .then((response) => {
        if (response.error) {
          setCourseError("Failed to load courses. Please try again.");
        } else {
          setCourseOptions(response.payload.courses);
          setCourseError(null);
        }
      })
      .catch(() => setCourseError("Failed to load courses. Please try again."));
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setSuccessMessage("Registration successful! Stay with Science Tent");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }

    if (!isLoading && error) {
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 20000);
    }

    setLoading(isLoading);
  }, [isLoading, isAuthenticated, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("fatherName", fatherName);
    myForm.append("motherName", motherName);
    myForm.append("whatsappNumber", whatsappNumber);
    myForm.append("dateOfBirth", dateOfBirth);
    myForm.append("address", address);
    myForm.append("batch", batch);
    myForm.append("enrolledCourses", JSON.stringify(enrolledCourses));

    

    dispatch(fetchRegisterExStudent(myForm));
  };


  const handleCourseChange = (e) => {
    const courseID = e.target.value;

    if (e.target.checked) {
      setEnrolledCourses((prev) => [...prev, { courseID }]);
    } else {
      setEnrolledCourses((prev) =>
        prev.filter((course) => course.courseID !== courseID)
      );
    }
  };

  return (
    <Fragment>
      <MetaData title="Student Registration" />
      <div className="studentRegistrationSection">
        <h2 className="form-title">Student Registration</h2>

        {loading ? (
          <Loader />
        ) : (
          <form className="registration-form" onSubmit={handleSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="form-group animated">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group animated">
              <label>Father's Name</label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
            </div>

            <div className="form-group animated">
              <label>Mother's Name</label>
              <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} required />
            </div>

            <div className="form-group animated">
              <label>Mobile Number</label>
              <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} required />
            </div>

            <div className="form-group animated">
              <label>Date of Birth</label>
              <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
            </div>

            <div className="form-group animated">
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

           

            <div className="form-group animated">
              <label>Batch</label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)} required>
                <option value="">Select Batch</option>
                {batchOptions.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
              {batchError && <p className="error">{batchError}</p>}
            </div>

            <div className="form-group animated" >
              <label>Enrolled Courses</label>
              <div className="course-list">
                {courseOptions.length > 0 ? (
                  courseOptions.map((course) => (
                    <div key={course._id} className="course-item">
                      <input type="checkbox" value={course._id} onChange={handleCourseChange} />
                      <label>{course.name}</label>
                    </div>
                  ))
                ) : (
                  <p>Loading courses...</p>
                )}
              </div>
              {courseError && <p className="error">{courseError}</p>}
            </div>


            <button className="submit-button" type="submit">
              Register Student
            </button>

            
          </form>
        )}
      </div>
    </Fragment>
  );
}

export default ExStudentRegistration;
