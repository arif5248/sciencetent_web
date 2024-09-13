import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionCourse.css";
import { fetchDeleteCourse, fetchEditCourse } from "../../slice/courseSlice";

function PopupForEditDetailsDelete({ content, onClose }) {
  const [courseName, setCourseName] = useState(content.course?.name || "");
  const [courseCode, setCourseCode] = useState(content.course?.courseCode || "");
  const [paymentType, setPaymentType] = useState(content.course?.paymentType || "");
  const [paymentAmount, setPaymentAmount] = useState(content.course?.paymentAmount || "");

  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch(); // Add useDispatch hook

  const handleEdit = async () => {
    
    try {
        setLoading(true); // Set loading to true while processing
        
        const courseData = {
            name : courseName,
            courseCode : courseCode,
            paymentType : paymentType,
            paymentAmount : paymentAmount
        }
        await dispatch(fetchEditCourse({ courseId: content.course._id, courseData: courseData})).unwrap(); // Dispatch the delete course action
        console.log("Course Edited successfully:", content.course._id);
      } catch (error) {
        console.error("Error editing course:", error); // Handle any errors during deletion
      } finally {
        setLoading(false); // Set loading to false after deletion completes
        onClose(); // Close the popup after deletion
      }
  };

  const handleDelete = async () => {
    try {
      setLoading(true); // Set loading to true while processing
      await dispatch(fetchDeleteCourse(content.course._id)).unwrap(); // Dispatch the delete course action
      console.log("Course deleted successfully:", content.course._id);
    } catch (error) {
      console.error("Error deleting course:", error); // Handle any errors during deletion
    } finally {
      setLoading(false); // Set loading to false after deletion completes
      onClose(); // Close the popup after deletion
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
            <h3>Course Details</h3>
            <table className="courseDetailTable">
              <tbody>
                <tr>
                  <td>Course Code</td>
                  <td>{content.course.courseCode}</td>
                </tr>
                <tr>
                  <td>Course Name</td>
                  <td>{content.course.name}</td>
                </tr>
                <tr>
                  <td>Payment Type</td>
                  <td>{content.course.paymentType}</td>
                </tr>
                <tr>
                  <td>Payment Amount</td>
                  <td>{content.course.paymentAmount}</td>
                </tr>
                <tr>
                  <td>Created By</td>
                  <td>
                    ID: {content.course.createdBy.user}
                    <br />
                    Name: {content.course.createdBy.name}
                  </td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>
                    Time: {new Date(content.course.createdAt)
                      .toTimeString()
                      .split(" ")[0]}
                    <br />
                    Date: {new Date(content.course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )}

        {content.type === "edit" && (
          <Fragment>
            <h3>Edit Course Name</h3>
            <div className="editDataBox">
                <label>Course Code : </label>
                <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                />
                <label>Course Name : </label>
                <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                />
                <label>Payment Type : </label>
                <input
                type="text"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                />
                <label>Payment Amount : </label>
                <input
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                />
            </div>
            
            <button style={{marginTop: "5px"}} className="btn btn-primary" onClick={handleEdit} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </Fragment>
        )}

        {content.type === "delete" && (
          <Fragment>
            <h3 style={{fontSize: "20px"}}>Are you sure to delete "{content.course.name}" course?</h3>
            <div className="deleteBtnGroup">
                <button style={{width:'45%'}} className="btn btn-danger" onClick={onClose} disabled={loading}>
                Cancel
                </button>
                <button style={{width:'45%'}} className="btn btn-success" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "OK"}
                </button>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForEditDetailsDelete;
