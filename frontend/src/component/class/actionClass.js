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
 
  const formattedDateString = (date) => {
    const formattedDate = new Date(date);

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const weekdayOptions = { weekday: "long" };

    const formattedDatePart = new Intl.DateTimeFormat("en-GB", dateOptions).format(formattedDate);
    const formattedWeekday = new Intl.DateTimeFormat("en-GB", weekdayOptions).format(formattedDate);

    return `${formattedDatePart}, ${formattedWeekday}`;
  };


  
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

  

  const sendScheduleToStudents = async () => {
    setShowBoxOne(false);
    setShowBoxThree(true);
    setShowBoxTwo(false);

    const allMessageReports = pendingClassesToApproveData.msgReports.find(
      (item) => item.date === content.pendingClass.date
    );

    let allReports = [...allMessageReports.allReports];

    let sent = 0;
    let failed = 0;
    setProgress(0);
    setSendStatus({ sent: 0, failed: 0 });

    // Loop through all reports sequentially
    for (let i = 0; i < allReports.length; i++) {
      if(allReports[i].status !== "notApplicable"){
        try {
          const response = await dispatch(
            fetchSendClassMessage({
              toNumber: allReports[i].studentNumber,
              message: allReports[i].message,
            })
          ).unwrap();
  
          if (response.success === true) {
            allReports[i] = { ...allReports[i], status: "sent" };
            sent++;
          } else {
            allReports[i] = { ...allReports[i], status: "failed" };
            failed++;
          }
        } catch (err) {
          allReports[i] = { ...allReports[i], status: "failed" };
          failed++;
        }
  
        setProgress(((i + 1) / allReports.length) * 100);
        setSendStatus({ sent, failed });
      }
    }

    // Now update the state after the loop completes
    setUpdatedAllReports(allReports);

    try {
      const response = await dispatch(
        fetchUpdateClassMessageReport({
          date: content.pendingClass.date,
          allReports: allReports,
          classDocId: pendingClassesToApproveData._id,
        })
      ).unwrap();

      setSuccessMessage("Class approved successfully!");
      setPendingClassesToApproveData(response.approveAndReportInserted);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 20000);
    } catch (err) {
      setErrorMessage(err);

      setTimeout(() => {
        setErrorMessage(null);
      }, 20000);
    } finally {
      setLoading(false);
    }
};

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

  const copySchedule = async () => {
  
    const messageData = content.pendingClass.classes.map(cls => {
      return `${cls.courseName}: ${cls.startingTime} - ${cls.finishingTime}`;
    }).join("\n");
  
    const message = `${formattedDateString(content.pendingClass.date)}\n\n${messageData}\n\nScience Tent\nAn Ultimate Education Care of Science`;
  
    try {
      await navigator.clipboard.writeText(message);
      alert("Schedule copied to clipboard! You can now paste it anywhere.");
    } catch (error) {
      alert("Failed to copy schedule. Please try again.");
    }
  };
  

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
                            onClick={copySchedule}
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

        

        
      </div>
    </div>
  );
}

export default PopupForApproveCancel;
