import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./actionOtp.css";
import { fetchCreateOtp } from "../../slice/otpSlice";

function PopupForOtpAndExStudentRegister({ content, onClose }) {
  const [batchName, setBatchName] = useState(content.batch?.name || "");
  const [loading, setLoading] = useState(false);
  const [otpMethod, setOtpMethod] = useState("sms"); // Default to SMS
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const dispatch = useDispatch();

  // Start countdown when OTP is sent
  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleOtpSent = async () => {
    setLoading(true);
    const otpData = {
      toNumber: content.toNumber,
      sms: otpMethod === "sms" ? true : false,
    };

    dispatch(fetchCreateOtp(otpData))
      .then((response) => {
        if (response.error) {
          setOtpSentMessage(response.payload);
        } else {
          setOtpSentMessage(response.payload.message);
        }
      })
      .catch((error) => {
        setOtpSentMessage(error);
      });

    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    setLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false);
      alert(`OTP Verified Successfully!`);
      onClose(); // Close popup on success
    }, 1500);
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {content.type === "otp" && (
          <Fragment>
            <h3 style={{ fontSize: "20px" }}>Otp Verification</h3>

            {/* Radio Buttons for OTP Method */}
            <div className="otp-method">
              <label>
                <input
                  type="radio"
                  name="otpMethod"
                  value="sms"
                  checked={otpMethod === "sms"}
                  onChange={() => setOtpMethod("sms")}
                />
                SMS
              </label>

              <label>
                <input
                  type="radio"
                  name="otpMethod"
                  value="email"
                  checked={otpMethod === "email"}
                  onChange={() => setOtpMethod("email")}
                />
                Email
              </label>
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                className="send-otp-btn"
                onClick={handleOtpSent}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}

            {/* OTP Input Field (Visible after sending OTP) */}
            {otpSent && (
              <Fragment>
                <div className="otpSentMessage">
                  <p>{otpSentMessage}</p>
                </div>
                <div className="otp-input">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="verify-otp-btn"
                    onClick={handleOtpSubmit}
                    disabled={otp.length !== 6 || loading || timeLeft === 0}
                  >
                    {loading ? "Verifying..." : "Submit"}
                  </button>
                </div>

                {/* Countdown Timer */}
                {timeLeft > 0 && (
                  <div className="otp-timer">
                    <p>Time left: {formatTime(timeLeft)}</p>
                  </div>
                )}
                {timeLeft === 0 && (
                  <div className="otp-timer">
                    <p>OTP Expired. Please request a new one.</p>
                  </div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForOtpAndExStudentRegister;
