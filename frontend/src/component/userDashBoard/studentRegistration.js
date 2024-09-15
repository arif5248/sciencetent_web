import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./studentRegistration.css";

function StudentRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]); // Store fetched courses
  const [batchOptions, setBatchOptions] = useState([]); // Store fetched batches


  const [guardianInfo, setGuardianInfo] = useState({
    name: "",
    mobile: "",
    relationWithStudent: "",
    signature: { public_id: "", url: "" },
  });
 

  useEffect(() => {
    // Dispatch to fetch batches and courses
    dispatch(fetchBatches()).then((response) => setBatchOptions(response.payload));
    dispatch(fetchCourses()).then((response) => setCourseOptions(response.payload));
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const studentData = {
      name,
      fatherName,
      motherName,
      whatsappNumber,
      dateOfBirth,
      address,
      collegeName,
      batch,
      enrolledCourses: enrolledCourses.map((courseID) => ({ courseID })),
      gua,
    };
    dispatch(registerStudent(studentData));
  };

  // Handle image upload and preview
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignaturePreview(reader.result);
      setGuardianInfo((prev) => ({
        ...prev,
        signature: { public_id: "dummy_id", url: reader.result },
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle checkbox for enrolled courses
  const handleCourseChange = (e) => {
    const courseID = e.target.value;
    if (e.target.checked) {
      setEnrolledCourses((prev) => [...prev, courseID]);
    } else {
      setEnrolledCourses((prev) => prev.filter((id) => id !== courseID));
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
              </div>

              <div className="form-group">
                <label>Enrolled Courses:</label>
                <div className="course-list">
                  {courseOptions.length > 0 ? (
                    courseOptions.map((course) => (
                      <div key={course._id} className="course-item">
                        <input
                          type="checkbox"
                          value={course._id}
                          onChange={handleCourseChange}
                          checked={enrolledCourses.includes(course._id)}
                        />
                        <label>{course.name}</label>
                      </div>
                    ))
                  ) : (
                    <p>Loading courses...</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Guardian Name:</label>
                <input
                  type="text"
                  value={guardianInfo.name}
                  onChange={(e) =>
                    setGuardianInfo({ ...guardianInfo, name: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Guardian Mobile:</label>
                <input
                  type="text"
                  value={guardianInfo.mobile}
                  onChange={(e) =>
                    setGuardianInfo({ ...guardianInfo, mobile: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Relation with Student:</label>
                <input
                  type="text"
                  value={guardianInfo.relationWithStudent}
                  onChange={(e) =>
                    setGuardianInfo({
                      ...guardianInfo,
                      relationWithStudent: e.target.value,
                    })
                  }
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Guardian Signature:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="form-control"
                />
                {signaturePreview && (
                  <img
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
