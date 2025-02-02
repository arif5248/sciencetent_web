import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingClasses } from "../../slice/classSlice";
import "./pendingClass.css"; // Importing the custom CSS file
import PopupForApproveCancel from "./actionClass";

function PendingClasses() {
  const dispatch = useDispatch();
  const [PendingClasses, setPendingClasses] = useState([]); 
  const [loading, setLoading] = useState(false);

   const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
  const closePopup = () => setShowPopup(false) || setPopupContent(null);

  const formattedDateString = (date)=>{
    const formattedDate = new Date(date);

    // Format the date using Intl.DateTimeFormat
    const options = {
      weekday: "long", // Day of the week (e.g., "Friday")
      year: "numeric", // Full year (e.g., "2025")
      month: "long", // Full month name (e.g., "January")
      day: "numeric", // Day of the month (e.g., "31")
    };
    const formattedDateString = new Intl.DateTimeFormat("en-GB", options).format(formattedDate);
    return(formattedDateString)
  }
    
  

  useEffect(() => {
    setLoading(true)
    dispatch(fetchPendingClasses())
        .then((response) => {
            if (response.error) {
                setErrorMessage(response.error);
            } else {
            setPendingClasses(response.payload.data);
            setErrorMessage(null);
            }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [dispatch]);

  const handleReject = (student) => {
    openPopup({
      type: "reject",
      student,
    });
  };

  const handleApprove = (pendingClass) => {
    openPopup({
      type: "approve",
      pendingClass,
    });
  };

  const handleStatusChange = (pendingClass, statusTo) => {
    if (statusTo === 'approve'){


    }else{
      
    }
  };

  

  return (
    <div className="pending-classes-container">
      <h2 className="pending-classes-title">Pending Classes</h2>
      
      {PendingClasses && PendingClasses.map((pendingClass, index) => (
        <div key={index+pendingClass.batchDetails.batchCode} className="batch-item">
          <div className="batch-header">
            <h3>{pendingClass.batchDetails.name}</h3>
            <p>{pendingClass.batchDetails.branch} - Final Year: {pendingClass.batchDetails.finalYear}</p>
          </div>

          <div className="dateBox">
            <h5>{formattedDateString(pendingClass.date)}</h5>
          </div>

          {pendingClass.classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <div className="class-info">
                <div className="info-item"><strong>{cls.courseName} <em>({cls.courseCode})</em>:</strong> {cls.startingTime} - {cls.finishingTime} [{cls.teacherName}] </div>
              </div>
            </div>
          ))}
           <div className="class-actions">

             <button
                className="cancel-btn"
                onClick={() => handleStatusChange(pendingClass, "cancel")}
            >
                Cancel
            </button>     
            <button
                className="approve-btn"
                onClick={() => handleApprove(pendingClass)}
            >
                Approve
            </button>
              </div>
        </div>
      ))}
      {showPopup && <PopupForApproveCancel content={popupContent} onClose={closePopup} />}
    </div>
  );
}

export default PendingClasses;
