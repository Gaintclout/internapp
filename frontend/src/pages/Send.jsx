import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import OtpVector from "../assets/otp-2.png";
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

  // 🔐 Protect page
  useEffect(() => {
    if (!phone) navigate("/login");
  }, [phone, navigate]);

  // ⏱ Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendEnabled(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // 🎯 Focus first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 🔢 Handle input
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // 🔁 Resend OTP
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
      setPopupMessage("Failed to resend OTP.");
    } finally {
      setShowPopup(true);
    }
  };

  // ✅ Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setPopupMessage("Enter 4-digit OTP");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        phone_number: phone,
        otp: enteredOtp,
      });

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      setPopupMessage(response.data?.message || "OTP Verified");

      setTimeout(() => {
        navigate("/newpassword");
      }, 1000);
    } catch (error) {
      setPopupMessage(
        error?.response?.data?.detail || "Verification failed"
      );
    } finally {
      setShowPopup(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row items-center justify-center px-6 relative">

      {/* LOGO */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-6 md:p-20">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          OTP Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP BOXES */}
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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <img src={OtpVector} alt="otp" className="w-[80%] max-w-md" />
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center w-[90%] max-w-sm">
            <p className="mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}