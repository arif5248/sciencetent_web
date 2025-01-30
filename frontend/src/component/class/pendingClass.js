import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pendingClass.css"; // Importing the custom CSS file
import { fetchPendingClasses } from "../../slice/classSlice";

function PendingClasses (){
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        // Fetch data on component mount
        dispatch(fetchPendingClasses)
        .unwrap()
        .then(() => {
        // setSuccessMessage("Class created successfully!");
        // setTimeout(() => {
        //     setSuccessMessage(null);
        // }, 20000);
        })
        .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
            setErrorMessage(null);
        }, 20000);
        })
        .finally(() => setLoading(false));
    }, []);

  const handleStatusChange = (batchId, classId, status) => {
    // Update the status of the class
    axios
      .patch(`/your-api-endpoint/${batchId}/class/${classId}`, {
        status: status,
      })
      .then((response) => {
        // Update the batchData state after successful update
        setBatchData((prevData) =>
          prevData.map((batch) =>
            batch.batchDetails._id === batchId
              ? {
                  ...batch,
                  classes: batch.classes.map((cls) =>
                    cls._id === classId ? { ...cls, status } : cls
                  ),
                }
              : batch
          )
        );
      })
      .catch((error) => {
        console.error("Error updating class status:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="batch-list-container">
      <h2>Batch List</h2>
      {batchData.map((batch) => (
        <div key={batch.batchDetails._id} className="batch-item">
          <div className="batch-header">
            <h3>{batch.batchDetails.name}</h3>
            <p>{batch.batchDetails.branch} - Final Year: {batch.batchDetails.finalYear}</p>
          </div>

          {batch.classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <div className="class-info">
                <div className="info-item"><strong>Date:</strong> {new Date(cls.date).toLocaleDateString()}</div>
                <div className="info-item"><strong>Course Name:</strong> {cls.courseName}</div>
                <div className="info-item"><strong>Course Code:</strong> {cls.courseCode}</div>
                <div className="info-item"><strong>Time:</strong> {cls.startingTime} - {cls.finishingTime}</div>
                <div className="info-item"><strong>Teacher:</strong> {cls.teacherName}</div>
              </div>

              <div className="class-actions">
                {cls.status === "pending" ? (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange(batch.batchDetails._id, cls._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleStatusChange(batch.batchDetails._id, cls._id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <p>Status: {cls.status}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PendingClasses;
