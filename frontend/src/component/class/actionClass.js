import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionClass";
import { fetchApproveStudent, fetchRejectStudent } from "../../slice/studentSlice";
import { fetchPendingClassesToApprove, fetchSendClassMessage, fetchUpdateClassMessageReport } from "../../slice/classSlice";

function PopupForApproveCancel({ content, onClose }) {
  const [loading, setLoading] = useState(false); // Add loading state
  const [note, setNote] = useState("");
  const dispatch = useDispatch(); // Add useDispatch hook
  const [rejectPopUp, setRejectPopUp] = useState(0)
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [showBoxOne, setShowBoxOne] = useState(true)
  const [showBoxTwo, setShowBoxTwo] = useState(false)
  const [showBoxThree, setShowBoxThree] = useState(false)
  const [showFailedListTable, setShowFailedListTable] = useState(false)
  const [showSentListTable, setShowSentListTable] = useState(false)

  const [progress, setProgress] = useState(0);
  const [sendStatus, setSendStatus] = useState({ sent: 0, failed: 0 });

  const [pendingClassesToApproveData, setPendingClassesToApproveData] = useState({})
  const [updatedAllReports, setUpdatedAllReports] = useState([])
 
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
    setLoading(true)
    const batchId = content.pendingClass.batchDetails._id
    const pendingClassesId = content.pendingClass.classes.map(classItem => classItem._id)
      
    dispatch(fetchPendingClassesToApprove({pendingClassesId, batchId}))
      .unwrap()
      .then((response) => {
        setSuccessMessage("Class approved successfully!");
        setPendingClassesToApproveData(response.approveAndReportInserted)
        setTimeout(() => {
          setSuccessMessage(null);
        }, 20000);
        setShowBoxOne(false)
        setShowBoxThree(false)
        setShowBoxTwo(true)
      })
      .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      })
      .finally(() => setLoading(false));
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

    const allMessageReports = pendingClassesToApproveData.msgReports.find(item => item.date === content.pendingClass.date)

    let allReports= [...allMessageReports.allReports]
    console.log("======12345=====",allReports)


    let sent = 0;
    let failed = 0;
    setProgress(0);
    setSendStatus({ sent: 0, failed: 0 });

    for (let i = 0; i < allReports.length; i++) {

      dispatch(fetchSendClassMessage({toNumber: allReports[i].studentNumber, message: allReports[i].message}))
      .unwrap()
      .then((response) => {
        if(response.status === true){
          allReports[i] = { ...allReports[i], status: "sent" };
          sent++;
        }
        if(response.status === false){
          allReports[i] = { ...allReports[i], status: "failed" };
          failed++;
        }
      })
      .catch((err) => {
        allReports[i] = { ...allReports[i], status: "failed" };
        failed++;
      })
      .finally(() => {
        setProgress(((i + 1) / allReports.length) * 100);
        setSendStatus({ sent, failed });
        setLoading(false)
      });






      try {
          await new Promise((resolve, reject) => {
              setTimeout(() => {
                  Math.random() > 0.2 ? resolve() : reject(); // Simulate random success/failure
              }, 500);
          });

          // ✅ Create a new copy and update its status
          allReports[i] = { ...allReports[i], status: "sent" };
          sent++;
      } catch (error) {
          allReports[i] = { ...allReports[i], status: "failed" };
          failed++;
      } finally {
          setProgress(((i + 1) / allReports.length) * 100);
          setSendStatus({ sent, failed });
      }
  }
  setUpdatedAllReports(allReports)
  console.log(pendingClassesToApproveData)
  dispatch(fetchUpdateClassMessageReport({date: content.pendingClass.date, allReports: allReports, classDocId: pendingClassesToApproveData._id}))
      .unwrap()
      .then((response) => {
        setSuccessMessage("Class approved successfully!");
        setPendingClassesToApproveData(response.approveAndReportInserted)
        setTimeout(() => {
          setSuccessMessage(null);
        }, 20000);
      })
      .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      })
      .finally(() => setLoading(false));
  }
  const showSentList = async () => {
    setShowFailedListTable(false)
    setShowSentListTable(true)
  }
  const showFailedList = async () => {
    setShowFailedListTable(true)
    setShowSentListTable(false)
  }

  const retryMessage = async (msgReport) => {
    console.log(msgReport)
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
                        <button className="btn btn-success" disabled={loading} onClick={showSentList}>
                            Sent: {sendStatus.sent}
                        </button>
                        <button className="btn btn-danger" disabled={loading} onClick={showFailedList}>
                            Failed: {sendStatus.failed}
                        </button>
                    </div>
                    {showSentListTable && (
                      <Fragment>
                        <div className="showSentList">
                          <table>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Message</th>
                              </tr>
                            </thead>

                            <tbody>
                              {updatedAllReports.map(item=>{
                                if(item.status === "sent"){
                                  return(
                                    <tr key={item.studentId}>
                                      <td>{item.studentId}</td>
                                      <td>{item.studentName}</td>
                                      <td>{item.studentNumber}</td>
                                      <td>{item.message}</td>
                                    </tr>
                                  )
                                }
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Fragment>
                    )}

                    {showFailedListTable && (
                      <Fragment>
                        <div className="showSentList">
                          <table>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Message</th>
                              </tr>
                            </thead>

                            <tbody>
                              {updatedAllReports.map(item=>{
                                if(item.status !== "sent"){
                                  return(
                                    <tr key={item.studentId}>
                                      <td>{item.studentId}</td>
                                      <td>{item.studentName}</td>
                                      <td>{item.studentNumber}</td>
                                      <td>{item.message}</td>
                                      <td>
                                        <button 
                                        className="btn btn-danger" 
                                        disabled={loading} 
                                        onClick={() => retryMessage(item)}
                                        >
                                          Retry
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                }
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Fragment>
                    )}
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
