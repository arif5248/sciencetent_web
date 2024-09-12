import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionBatch.css";
import { fetchDeleteBatch } from "../../slice/batchSlice";

function PopupForEditDetailsDelete({ content, onClose }) {
  const [batchName, setBatchName] = useState(content.batch?.name || "");
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch(); // Add useDispatch hook

  const handleEdit = () => {
    // Dispatch the edit action here (implement as needed)
    alert("Edit functionality is under development");
    console.log("Edit dispatched for:", content.batch._id);
    onClose(); // Close the popup after editing
  };

  const handleDelete = async () => {
    try {
      setLoading(true); // Set loading to true while processing
      await dispatch(fetchDeleteBatch(content.batch._id)).unwrap(); // Dispatch the delete batch action
      console.log("Batch deleted successfully:", content.batch._id);
    } catch (error) {
      console.error("Error deleting batch:", error); // Handle any errors during deletion
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
            <h3>Batch Details</h3>
            <table className="batchDetailTable">
              <tbody>
                <tr>
                  <td>Batch Code</td>
                  <td>{content.batch.batchCode}</td>
                </tr>
                <tr>
                  <td>Batch Name</td>
                  <td>{content.batch.name}</td>
                </tr>
                <tr>
                  <td>Branch</td>
                  <td>{content.batch.branch}</td>
                </tr>
                <tr>
                  <td>Batch ID</td>
                  <td>{content.batch._id}</td>
                </tr>
                <tr>
                  <td>Created By</td>
                  <td>
                    ID: {content.batch.createdBy.user}
                    <br />
                    Name: {content.batch.createdBy.name}
                  </td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>
                    Time: {new Date(content.batch.createdAt)
                      .toTimeString()
                      .split(" ")[0]}
                    <br />
                    Date: {new Date(content.batch.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )}

        {content.type === "edit" && (
          <Fragment>
            <h3>Edit Batch Name</h3>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
            <button onClick={handleEdit}>Save</button>
          </Fragment>
        )}

        {content.type === "delete" && (
          <Fragment>
            <h3>Are you sure you want to delete this batch?</h3>
            <button onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "OK"}
            </button>
            <button onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForEditDetailsDelete;
