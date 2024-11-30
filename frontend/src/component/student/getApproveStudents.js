import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./getApproveStudents.css";
import { fetchAllApproveStudents } from "../../slice/studentSlice";
import PopupForDetailsApproveReject from "./actionStudent";

function AllApproveStudents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, allApproveStudents } = useSelector((state) => state.student);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllApproveStudents())
      .unwrap()
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (allApproveStudents) {
      setFilteredStudents(
        allApproveStudents.filter((student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allApproveStudents]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
  const closePopup = () => setShowPopup(false) || setPopupContent(null);

//   const handleReject = (student) => {
//     openPopup({
//       type: "reject",
//       student,
//     });
//   };

//   const handleApprove = (student) => {
//     openPopup({
//       type: "approve",
//       student,
//     });
//   };

  const handleDetails = (student) => {
    openPopup({
      type: "details",
      student,
    });
  };

  return (
    <Fragment>
      <MetaData title={`All Pending Students`} />
      <div className="allStudentsSection">
        <h2>All Pending Students</h2>

        <input
          type="text"
          placeholder="Search Student Name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchBox"
        />

        {isLoading || loading ? (
          <Loader />
        ) : (
          <Fragment>
            { error && <p style={{ color: "red" }}>{error}</p>}
            <table className="studentTable">
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>Enrolled Course</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id} onClick={() => handleDetails(student)}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.batchDetails.batchCode}</td>
                      <td>{student.enrolledCourses.map(course =>( course.name+","))}</td>
                      {/* <td>
                        <div className="three-dot-container">
                          <button className="three-dot-btn">...</button>
                          <div className="action-popup">
                            <button onClick={() => handleDetails(student)}>Details</button>
                          </div>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Students Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>

      {showPopup && <PopupForDetailsApproveReject content={popupContent} onClose={closePopup} />}
    </Fragment>
  );
}

export default AllApproveStudents;
