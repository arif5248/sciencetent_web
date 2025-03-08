import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import "./qrCodeScanner.css";
import { fetchCreateAttendance } from "../../slice/attendanceSlice";

function QrCodeScanner() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [scanning, setScanning] = useState(false); // Track whether the scanner is active
  const [timeoutId, setTimeoutId] = useState(null); // Store the timeout ID for automatic scanner turn-off
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // Store the API response message for the popup

  const handleScan = async (data) => {
    if (data && scanning) {
      // Stop scanning once we get data
      setScanning(false);
      setPopupMessage("")
    //   console.log(data);
      let modifiedData = JSON.parse(data);
      const clockInTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      modifiedData.Time = clockInTime;
      const apiData = modifiedData;

      setLoading(true);
      dispatch(fetchCreateAttendance(apiData))
        .unwrap()
        .then((response) => {
          console.log(response)
          setPopupMessage(response.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            setScanning(true); // Re-enable scanning after showing the success popup
          }, 5000); // Show the popup for 5 seconds
        })
        .catch((err) => {
            console.log(err)
          setPopupMessage(err);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            setScanning(true); // Re-enable scanning after showing the error popup
          }, 500000); // Show the popup for 5 seconds
        })
        .finally(() => {
            setLoading(false)
            const newTimeoutId = setTimeout(() => {
                setScanning(false); // Stop scanning if no card is scanned for 30 seconds
                setMessage("Scanner turned off due to inactivity");
              }, 30000); // Automatically turn off the scanner after 30 seconds of inactivity
              setTimeoutId(newTimeoutId);
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("QR Scanner Error");
  };

  const handleStartScan = () => {
    setScanning(true);
    setShowPopup(false); // Hide any popup when starting the scan
    clearTimeout(timeoutId); // Clear any previous timeout if starting a new scan
    const newTimeoutId = setTimeout(() => {
      setScanning(false); // Stop scanning if no card is scanned for 30 seconds
      setMessage("Scanner turned off due to inactivity");
    }, 30000); // Automatically turn off the scanner after 30 seconds of inactivity
    setTimeoutId(newTimeoutId);
  };

  const handleFinishScan = () => {
    setScanning(false);
    setShowPopup(false); // Hide any popup when finishing the scan
    clearTimeout(timeoutId); // Clear any timeout when scan is finished
  };

  return (
    <Fragment>
      <MetaData title={`Attendance Scanner`} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="qrCodeScannerSection">
            <h2>Scan Your Student ID</h2>
            <div className="scannerContainer">
              {scanning && (
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  onResult={(result, error) => {
                    if (result) handleScan(result.text);
                    // if (error) console.error(error);
                  }}
                  style={{ width: "100%" }}
                />
              )}
            </div>
            {message && <p className="scanMessage">{message}</p>}
            {successMessage && <p className="successMessage">{successMessage}</p>}
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            {/* Popup for API response */}
            {showPopup && (
              <div className="popup">
                <p>{popupMessage}</p>
              </div>
            )}

            <div className="scanControlButtons">
              {!scanning && (
                <button className="startScanBtn" onClick={handleStartScan}>
                  Start Scan
                </button>
              )}
              {scanning && (
                <button className="finishScanBtn" onClick={handleFinishScan}>
                  Finish Scan
                </button>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default QrCodeScanner;
