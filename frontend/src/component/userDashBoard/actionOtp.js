import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionOtp.css";

function PopupForOtpAndExStudentRegister({ content, onClose }) {
  const [batchName, setBatchName] = useState(content.batch?.name || "");
  const [loading, setLoading] = useState(false);
  const [otpMethod, setOtpMethod] = useState("sms"); // Default to SMS
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const handleOtpSent = async () => {
    setLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      alert(`OTP sent via ${otpMethod.toUpperCase()}`);
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
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? "Verifying..." : "Submit"}
                </button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForOtpAndExStudentRegister;
