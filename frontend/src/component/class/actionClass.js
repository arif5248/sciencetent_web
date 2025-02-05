import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionClass";
import { fetchApproveStudent, fetchRejectStudent } from "../../slice/studentSlice";
import { fetchPendingClassesToApprove } from "../../slice/classSlice";

function PopupForApproveCancel({ content, onClose }) {
  const [loading, setLoading] = useState(false); // Add loading state
  const [note, setNote] = useState("");
  const dispatch = useDispatch(); // Add useDispatch hook
  const [rejectPopUp, setRejectPopUp] = useState(0)
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [showBoxOne, setShowBoxOne] = useState(true)
  const [showBoxTwo, setShowBoxTwo] = useState(false)
  const [showBoxThree, setShowBoxThree] = useState(false)

  const [progress, setProgress] = useState(0);
  const [sendStatus, setSendStatus] = useState({ sent: 0, failed: 0 });
 
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
    const batchId = content.pendingClass.batchDetails._id
    const pendingClassesId = content.pendingClass.classes.map(classItem => classItem._id)
      
    try {
      setLoading(true); 
      await dispatch(fetchPendingClassesToApprove({pendingClassesId, batchId})).unwrap(); 

      console.log("Class approved successfully:");
      setShowBoxOne(false)
      setShowBoxThree(false)
      setShowBoxTwo(true)
    } catch (error) {
      console.error("Error approving class", error); 
    } finally {
      setLoading(false); 
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

  const sendScheduleToStudents = async () => {
    setShowBoxOne(false)
    setShowBoxThree(true)
    setShowBoxTwo(false)

    let allReports= [
                    {
                        "studentId": "NB2601",
                        "studentName": "Nadira Ahmed Disha",
                        "studentNumber": "01323234835",
                        "status": "notExecute",
                        "message": "Dear Nadira Ahmed Disha\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa3"
                    },
                    {
                        "studentId": "NB2602",
                        "studentName": "Sheikh Rakibul Hassan",
                        "studentNumber": "01847754389",
                        "status": "notExecute",
                        "message": "Dear Sheikh Rakibul Hassan\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa4"
                    },
                    {
                        "studentId": "NB2603",
                        "studentName": "Prome Ghosh",
                        "studentNumber": "01849512682",
                        "status": "notExecute",
                        "message": "Dear Prome Ghosh\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa5"
                    },
                    {
                        "studentId": "NB2604",
                        "studentName": "Piuli Baidya",
                        "studentNumber": "01883619311",
                        "status": "notExecute",
                        "message": "Dear Piuli Baidya\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa6"
                    },
                    {
                        "studentId": "NB2605",
                        "studentName": "Jannatul Noor Hossen Mim",
                        "studentNumber": "01851263869",
                        "status": "notExecute",
                        "message": "Dear Jannatul Noor Hossen Mim\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa7"
                    },
                    {
                        "studentId": "NB2606",
                        "studentName": "Sayed Anowar Riyad ",
                        "studentNumber": "01815920523",
                        "status": "notExecute",
                        "message": "Dear Sayed Anowar Riyad \nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa8"
                    },
                    {
                        "studentId": "NB2607",
                        "studentName": "Nusrat Jahan Niha",
                        "studentNumber": "01540513887",
                        "status": "notExecute",
                        "message": "Dear Nusrat Jahan Niha\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faa9"
                    },
                    {
                        "studentId": "NB2608",
                        "studentName": "Md Fayez ",
                        "studentNumber": "01937153554",
                        "status": "notExecute",
                        "message": "Dear Md Fayez \nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faaa"
                    },
                    {
                        "studentId": "NB2609",
                        "studentName": "Fatema Hossain ",
                        "studentNumber": "01613446702",
                        "status": "notExecute",
                        "message": "Dear Fatema Hossain \nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faab"
                    },
                    {
                        "studentId": "NB2610",
                        "studentName": "Sadiya Hossen ",
                        "studentNumber": "01852117824",
                        "status": "notExecute",
                        "message": "Dear Sadiya Hossen \nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faac"
                    },
                    {
                        "studentId": "NB2611",
                        "studentName": "Abid",
                        "studentNumber": "01869512511",
                        "status": "notExecute",
                        "message": "Dear Abid\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faad"
                    },
                    {
                        "studentId": "NB2612",
                        "studentName": "Sadia Tanjina Karin",
                        "studentNumber": "01882670023",
                        "status": "notExecute",
                        "message": "Dear Sadia Tanjina Karin\nFriday 31 January 2025\nPhysics: 4:00pm-5:00pm\nPhysics: 5:00pm-6:00pm\nScience Tent",
                        "_id": "679fb040bd455dea60a3faae"
                    }
                ]


    let sent = 0;
    let failed = 0;
    setProgress(0);
    setSendStatus({ sent: 0, failed: 0 });

    for (let i = 0; i < allReports.length; i++) {
        try {
            // Simulating API call (replace this with your actual API call)
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    Math.random() > 0.2 ? resolve() : reject(); // Simulate random success/failure
                }, 500);
            });

            allReports[i].status = "sent";
            sent++;
        } catch (error) {
            allReports[i].status = "failed";
            failed++;
        } finally {
            setProgress(((i + 1) / allReports.length) * 100);
            setSendStatus({ sent, failed });
        }
    }

  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {content.type === "approve" && (
          <Fragment>
            {showBoxOne && (
                <Fragment>
                    <h3 style={{ fontSize: "20px" }}>
                        Are you sure to Approve ?
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
            {showBoxTwo && (
                <Fragment>
                    <h3 style={{ fontSize: "16px" }}>
                        The class for {content.pendingClass.batchDetails.name} on {formattedDateString(content.pendingClass.date)} is approved
                    </h3>
                    <div style={{display: "flex", flexDirection:"column",gap:"10px", flexWrap:"wrap"}}>
                        <button
                            style={{ width: "45%" }}
                            className="btn btn-primary"
                            onClick={sendScheduleToStudents}
                            disabled={loading}
                        >
                            Send Schedule to Students
                        </button>
                        <button
                            style={{ width: "45%" }}
                            className="btn btn-info"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Send Schedule to Teacher
                        </button>
                        <button
                            style={{ width: "45%" }}
                            className="btn btn-warning"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Click here to Copy
                        </button>
                    </div>
                </Fragment>
            )}

            {showBoxThree && (
                <Fragment>
                    <h3>Sending Messages...</h3>
                    <div style={{ width: "100%", background: "#e0e0e0", borderRadius: "8px", overflow: "hidden", marginBottom: "10px" }}>
                        <div style={{ width: `${progress}%`, background: "#76c7c0", height: "8px" }}></div>
                    </div>
                    <div>
                        <button className="btn btn-success" disabled={loading}>
                            Sent: {sendStatus.sent}
                        </button>
                        <button className="btn btn-danger" disabled={loading}>
                            Failed: {sendStatus.failed}
                        </button>
                    </div>
                </Fragment>
            )}
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

export default PopupForApproveCancel;
