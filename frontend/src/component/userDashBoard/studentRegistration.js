import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
// import { useNavigate } from "react-router-dom";
import "./studentRegistration.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchAllCoursesForReg } from "../../slice/courseSlice";
import { fetchRegisterStudent } from "../../slice/studentSlice";

function StudentRegistration() {
//   const navigate = useNavigate();
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
  const [collegeName, setCollegeName] = useState("");
  const [batch, setBatch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [guardianName, setGuardianName] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");
  const [guardianRelationWithStudent, setGuardianRelationWithStudent] = useState("");
  const [guardianSignature, setGuardianSignature] = useState("");
  const [admissionFeeRef, setAdmissionFeeRef] = useState("");
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]); // Store fetched courses
  const [batchOptions, setBatchOptions] = useState([]); // Store fetched batches
 
  useEffect(() => {
    // Fetch batches and handle errors
    dispatch(fetchAllBatchForReg())
      .then((response) => {
        if (response.error) {
          setBatchError("Failed to load batches. Please try again.");
        } else {
          setBatchOptions(response.payload.batches);
          setBatchError(null); // Clear any previous errors
        }
      })
      .catch(() => setBatchError("Failed to load batches. Please try again."));
  
    // Fetch courses and handle errors
    dispatch(fetchAllCoursesForReg())
      .then((response) => {
        if (response.error) {
          setCourseError("Failed to load courses. Please try again.");
        } else {
          setCourseOptions(response.payload.courses);
          setCourseError(null); // Clear any previous errors
        }
      })
      .catch(() => setCourseError("Failed to load courses. Please try again."));
  }, [dispatch]);
  

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setSuccessMessage("Registration successful! Please wait for the admin's approval");
      setTimeout(() => {
        setSuccessMessage(null); // Clear error message after 5 seconds
      }, 5000);
    }

    if (!isLoading && error) {
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage(null); // Clear error message after 5 seconds
      }, 10000);
    }

    setLoading(isLoading);
  }, [isLoading, isAuthenticated, error]);
  // Handle form submission
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Prepare FormData
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("fatherName", fatherName);
    myForm.append("motherName", motherName);
    myForm.append("whatsappNumber", whatsappNumber);
    myForm.append("dateOfBirth", dateOfBirth);
    myForm.append("address", address);
    myForm.append("collegeName", collegeName);
    myForm.append("batch", batch);
    myForm.append("enrolledCourses", JSON.stringify(enrolledCourses));
    myForm.append("guardianName", guardianName);
    myForm.append("guardianMobile", guardianMobile);
    myForm.append("guardianRelationWithStudent", guardianRelationWithStudent);
    myForm.append("admissionFeeRef", admissionFeeRef);
  
    if (guardianSignature) {
      myForm.append("guardianSignature", guardianSignature);
    }
    // for (let pair of myForm.entries()) {
    //     console.log(pair[0] + ": " + pair[1]);
    //   }
    // // Dispatch the async thunk
    dispatch(fetchRegisterStudent(myForm));
  };
  
  
  const UpdateSignatureDataChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setGuardianSignature(file); // Set the avatar state to the file object
  
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setSignaturePreview(reader.result); // Set the preview to base64 for UI display
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle checkbox for enrolled courses
  const handleCourseChange = (e) => {
    const courseID = e.target.value; // Only get the ID as a string
  
    if (e.target.checked) {
      // Add the courseID object to the array if it is checked
      setEnrolledCourses((prev) => [...prev, { courseID }]);
    } else {
      // Remove the courseID object from the array if it is unchecked
      setEnrolledCourses((prev) =>
        prev.filter((course) => course.courseID !== courseID)
      );
    }
  };
  
  
  

  return (
    <Fragment>
      <MetaData title="Student Registration" />
      <div className="studentRegistrationSection">
        <h2>Student Registration</h2>

        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Father's Name:</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Number:</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>College Name:</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Batch:</label>
                <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    required
                    className="form-control"
                >
                    <option value="">Select Batch</option>
                    {batchOptions.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                        {batch.name}
                    </option>
                    ))}
                </select>
                {batchError && <p style={{ color: "red" }}>{batchError}</p>} {/* Display batch error */}
            </div>


            <div className="form-group">
                <label>Enroll Your Courses:</label>
                <div className="course-list">
                    {courseOptions.length > 0 ? (
                    courseOptions.map((course) => (
                        <div key={course._id} className="course-item">
                        <input
                            type="checkbox"
                            value={course._id}
                            onChange={handleCourseChange}
                            checked={enrolledCourses.some((enrolled) => enrolled.courseID === course._id)}
                        />
                        <label>{course.name}</label>
                        </div>
                    ))
                    ) : (
                    <p>Loading courses...</p>
                    )}
                </div>
                {courseError && <p style={{ color: "red" }}>{courseError}</p>} {/* Display course error */}
            </div>


              <div className="form-group">
                <label>Guardian Name:</label>
                <input
                  type="text"
                  value={guardianName}     
                  onChange={(e) => setGuardianName(e.target.value )}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Guardian Mobile:</label>
                <input
                  type="text"
                  value={guardianMobile}
                  onChange={(e) =>
                    setGuardianMobile(e.target.value)
                  }
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Relation with Student:</label>
                <input
                  type="text"
                  value={guardianRelationWithStudent}
                  onChange={(e) =>
                    setGuardianRelationWithStudent(e.target.value)
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Admission Fee Ref.</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setAdmissionFeeRef(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Guardian Signature:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={UpdateSignatureDataChange}
                  className="form-control"
                />
                {signaturePreview && (
                  <img
                  style={{width: "150px"}}
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="img-preview"
                  />
                )}
              </div>

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>
            </form>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default StudentRegistration;
