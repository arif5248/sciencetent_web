import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionBatch.css";
import { fetchDeleteBatch, fetchEditBatch } from "../../slice/batchSlice";

function PopupForEditDetailsDelete({ content, onClose }) {
  const [batchName, setBatchName] = useState(content.batch?.name || "");
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch(); // Add useDispatch hook

  const handleEdit = async () => {
    
    try {
        setLoading(true); // Set loading to true while processing
        const myForm = new FormData();
        myForm.append("name", batchName);
        await dispatch(fetchEditBatch({ batchId: content.batch._id, batchData: { name: batchName }})).unwrap(); // Dispatch the delete batch action
        console.log("Batch Edited successfully:", content.batch._id);
      } catch (error) {
        console.error("Error editing batch:", error); // Handle any errors during deletion
      } finally {
        setLoading(false); // Set loading to false after deletion completes
        onClose(); // Close the popup after deletion
      }
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
            <button className="btn btn-primary" onClick={handleEdit} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          </Fragment>
        )}

        {content.type === "delete" && (
          <Fragment>
            <h3 style={{fontSize: "20px"}}>Are you sure to delete "{content.batch.name}" batch?</h3>
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
