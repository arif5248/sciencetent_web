import React, { Fragment, useState } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import "./qrCodeScanner.css";

function QrCodeScanner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data) {
    //   setQrData(data);
      try {
        const parsedData = JSON.parse(data); // QR Code should contain JSON data
        const { studentId, batchId } = parsedData;
        const clockInTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setLoading(true);
        const response = await axios.post("https://your-backend-url.com/api/attendance", {
          studentId,
          batchId,
          clockIn: clockInTime,
        });

        setMessage(response.data.message);
      } catch (error) {
        setMessage("Invalid QR Code or Network Error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setMessage("QR Scanner Error");
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
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (result) handleScan(result.text);
                //   if (error) console.error(error);
                }}
                style={{ width: "100%" }}
              />
            </div>
            {qrData && <p className="scanResult">Scanned: {qrData}</p>}
            {message && <p className="scanMessage">{message}</p>}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default QrCodeScanner;
