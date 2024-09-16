import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./getPendingStudents.css";
import { fetchAllPendingStudents } from "../../slice/studentSlice";
// import PopupForEditDetailsDelete from "./actionBatch";

function AllPendingStudents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, allPendingStudents } = useSelector((state) => state.student);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllPendingStudents())
      .unwrap()
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (allPendingStudents) {
      setFilteredStudents(
        allPendingStudents.filter((student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allPendingStudents]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
  const closePopup = () => setShowPopup(false) || setPopupContent(null);

  const handleEdit = (batch) => {
    openPopup({
      type: "edit",
      batch,
    });
  };

  const handleDelete = (batch) => {
    openPopup({
      type: "delete",
      batch,
    });
  };

  const handleDetails = (batch) => {
    openPopup({
      type: "details",
      batch,
    });
  };

  return (
    <Fragment>
      <MetaData title={`All Pending Students`} />
      <div className="allStudentsSection">
        <h2>All Pending Students</h2>

        <input
          type="text"
          placeholder="Search Batch Name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchBox"
        />

        {isLoading || loading ? (
          <Loader />
        ) : (
          <Fragment>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table className="studentTable">
              <thead>
                <tr>
                  <th>Batch Code</th>
                  <th>Batch Name</th>
                  <th>Branch</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr key={batch._id}>
                      <td>{batch.batchCode}</td>
                      <td>{batch.name}</td>
                      <td>{batch.branch}</td>
                      <td>{batch.createdBy.name}</td>
                      <td>
                        <div className="three-dot-container">
                          <button className="three-dot-btn">...</button>
                          <div className="action-popup">
                            <button onClick={() => handleEdit(batch)}>Edit</button>
                            <button onClick={() => handleDelete(batch)}>Delete</button>
                            <button onClick={() => handleDetails(batch)}>Details</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No batches found</td>
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

export default AllPendingStudents;
