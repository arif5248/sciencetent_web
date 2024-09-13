import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./allCourse.css";
import PopupForEditDetailsDelete from "./actionCourse";
import { fetchAllCourses } from "../../slice/courseSlice";

function AllCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, allCourses } = useSelector((state) => state.courses);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllCourses())
      .unwrap()
      .catch((err) => console.error("Error fetching course:", err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (allCourses) {
      setFilteredCourses(
        allCourses.filter((course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allCourses]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
  const closePopup = () => setShowPopup(false) || setPopupContent(null);

  const handleEdit = (course) => {
    openPopup({
      type: "edit",
      course,
    });
  };

  const handleDelete = (course) => {
    openPopup({
      type: "delete",
      course,
    });
  };

  const handleDetails = (course) => {
    openPopup({
      type: "details",
      course,
    });
  };

  return (
    <Fragment>
      <MetaData title={`All Course`} />
      <div className="allCourseSection">
        <h2>All Course</h2>

        <input
          type="text"
          placeholder="Search Course Name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchBox"
        />

        {isLoading || loading ? (
          <Loader />
        ) : (
          <Fragment>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table className="courseTable">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Payment Type</th>
                  <th>Payment Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseCode}</td>
                      <td>{course.name}</td>
                      <td>{course.paymentType}</td>
                      <td>{course.paymentAmount}</td>
                      <td>
                        <div className="three-dot-container">
                          <button className="three-dot-btn">...</button>
                          <div className="action-popup">
                            <button onClick={() => handleEdit(course)}>Edit</button>
                            <button onClick={() => handleDelete(course)}>Delete</button>
                            <button onClick={() => handleDetails(course)}>Details</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>

      {showPopup && <PopupForEditDetailsDelete content={popupContent} onClose={closePopup} />}
    </Fragment>
  );
}

export default AllCourse;
