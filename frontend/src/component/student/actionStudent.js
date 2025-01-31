import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionStudent.css";
import { fetchApproveStudent, fetchRejectStudent } from "../../slice/studentSlice";

function PopupForDetailsApproveReject({ content, onClose }) {
  const [loading, setLoading] = useState(false); // Add loading state
  const [note, setNote] = useState("");
  const dispatch = useDispatch(); // Add useDispatch hook
  const [rejectPopUp, setRejectPopUp] = useState(0)
  const [successMessage, setSuccessMessage] = useState(null);
  
 
  const handleRejectPopUp = async () => {
    setRejectPopUp((prev) => prev + 1);
    // setRejectPopUp(false)
    content.type = 'reject'
  };
  const handleApprovePopUp = async () => {
    setRejectPopUp((prev) => prev + 1);
    // setRejectPopUp(false)
    content.type = 'approve'
  };
  // console.log(content.student)
  const handleApprove = async () => {
    try {
      setLoading(true); // Set loading to true while processing
      await dispatch(fetchApproveStudent(content.student._id)).unwrap(); // Dispatch the delete batch action
      console.log("Batch deleted successfully:", content.batch._id);
    } catch (error) {
      console.error("Error deleting batch:", error); // Handle any errors during deletion
    } finally {
      setLoading(false); // Set loading to false after deletion completes
      onClose(); // Close the popup after deletion
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true); // Set loading to true while processing
      await dispatch(fetchRejectStudent({studentID : content.student._id, correctionNote : {note : note}})).unwrap(); // Dispatch the delete batch action
      // console.log("Batch deleted successfully:", content.batch._id);

    } catch (error) {
      console.error("Error deleting batch:", error); // Handle any errors during deletion
    } finally {
      setLoading(false); // Set loading to false after deletion completes
      onClose(); // Close the popup after deletion
      setSuccessMessage("Successfully rejected the form")
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {content.type === "details" && (
          <Fragment>
            <h3 className="popup-title">Student Details</h3>
            <div className="student-details">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{content.student.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Father's Name:</span>
                <span className="value">{content.student.fatherName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mother's Name:</span>
                <span className="value">{content.student.motherName}</span>
              </div>
              <div className="detail-row">
                <span className="label">WhatsApp Number:</span>
                <span className="value">{content.student.whatsappNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date of Birth:</span>
                <span className="value">
                  {new Date(content.student.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">College Name:</span>
                <span className="value">{content.student.collegeName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Address:</span>
                <span className="value">{content.student.address}</span>
              </div>
              <div className="detail-row">
                <span className="label">Batch Code:</span>
                <span className="value">{content.student.batchDetails.batchCode}</span>
              </div>
              <div className="detail-row">
                <span className="label">Enrolled Courses:</span>
                <ul className="value courses-list">
                  {content.student.enrolledCourses.map((course, index) => (
                    <li key={index}>{course.name}</li>
                  ))}
                </ul>
              </div>
              <div className="guardian-info-container">
                <h2>Guardian Information</h2>
                <div className="guardian-info">
                  <p>
                    <strong>Guardian Name:</strong> {content.student.guardianInfo.name}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {content.student.guardianInfo.mobile}
                  </p>
                  <p>
                    <strong>Relation with Student:</strong> {content.student.guardianInfo.relationWithStudent}
                  </p>
                  <div className="guardian-signature-container">
                    <p>
                      <strong>Signature:</strong>
                    </p>
                    <img
                      className="guardian-signature"
                      src={content.student.guardianInfo.signature.url}
                      alt="Guardian Signature"
                    />
                  </div>
                </div>
              </div>
              <div className="detail-row">
                <span className="label">Admission Fee Reference:</span>
                <span className="value">{content.student.admissionFeeRef}</span>
              </div>

              {content.student.status === 'pending' && (
              <div className="button-group">
                <button
                  className="btn-approve"
                  onClick={handleApprovePopUp}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Approve"}
                </button>
                <button
                  className="btn-reject"
                  onClick={handleRejectPopUp}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Reject"}
                </button>
              </div>)}
            </div>
             
          </Fragment>
        )}

        {content.type === "approve" && (
          <Fragment>
            <h3 style={{ fontSize: "20px" }}>
              Are you sure to Approve "{content.student.name}"?
            </h3>
            <div className="deleteBtnGroup">
              <button
                style={{ width: "45%" }}
                className="btn btn-danger"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                style={{ width: "45%" }}
                className="btn btn-success"
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? "Processing..." : "OK"}
              </button>
            </div>
          </Fragment>
        )}

        {content.type === "reject" && (
          <Fragment>
            <h3 style={{ fontSize: "20px" }}>
              Are you sure to reject "{content.student.name}"?
            </h3>
            <div className="detail-row">
                <span className="label">Note:</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            <div className="deleteBtnGroup">
              <button
                style={{ width: "45%" }}
                className="btn btn-danger"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                style={{ width: "45%" }}
                className="btn btn-success"
                onClick={handleReject}
                disabled={loading}
              >
                {loading ? "Processing..." : "OK"}
              </button>
            </div>
          </Fragment>
        )}

        
      </div>
    </div>
  );
}

export default PopupForDetailsApproveReject;
