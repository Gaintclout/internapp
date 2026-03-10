
import React, { useState, useRef, useEffect } from "react";
import Logo from "/src/assets/logo.png";
import OtpVector from "/src/assets/otp-2.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OTPVerification() {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const phone = localStorage.getItem("phone");

  // Protect OTP page
  useEffect(() => {
    if (!phone) {
      navigate("/login");
    }
  }, [phone, navigate]);

  // TIMER
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

  // OTP INPUT
  const handleChange = (index, value) => {

    if (/^\d?$/.test(value)) {

      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

  };

  // RESEND OTP
  const handleResend = async () => {

    try {

      await api.post("/auth/request-otp", {
        phone_number: phone,
      });

      setOtp(["", "", "", ""]);
      setTimeLeft(60);
      setIsResendEnabled(false);

      setPopupMessage("OTP sent successfully!");

    } catch {

      setPopupMessage("Failed to resend OTP. Try again.");

    } finally {

      setShowPopup(true);

    }
  };

  // VERIFY OTP
  const handleSubmit = async (e) => {

    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setPopupMessage("Please enter the full 4-digit OTP.");
      setShowPopup(true);
      return;
    }

    try {

      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        phone_number: phone,
        otp: enteredOtp,
      });

      console.log("OTP verified response:", response.data);

      // STORE TOKEN
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      setPopupMessage(response.data.message || "OTP verified successfully");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/newpassword");
      }, 1000);

    } catch (error) {

      setPopupMessage(
        error.response?.data?.detail || "OTP verification failed"
      );

      setShowPopup(true);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-[700px] bg-white flex flex-col md:flex-row items-center justify-center px-6 relative shadow-lg">

      {/* LOGO */}
      <div className="absolute top-6 left-6">
        <img src={Logo} alt="GAINT Logo" className="w-32" />
      </div>

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-6 md:p-20 ml-auto">

        <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
          OTP Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP INPUTS */}
          <div className="flex gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border rounded-md focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          {/* TIMER */}
          <div className="text-sm text-gray-600">

            {isResendEnabled ? (

              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-semibold"
              >
                Resend OTP
              </button>

            ) : (

              <span>Resend OTP in {timeLeft}s</span>

            )}

          </div>

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2563eb] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#1e4ed8] disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

      {/* RIGHT IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <img
          src={OtpVector}
          alt="OTP Illustration"
          className="w-[80%] max-w-md"
        />
      </div>

      {/* POPUP */}
      {showPopup && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 text-center w-[90%] max-w-sm">

            <p className="mb-4">{popupMessage}</p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-[#2563eb] text-white px-6 py-2 rounded-full"
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}