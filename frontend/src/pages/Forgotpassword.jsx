import React, { useState } from "react";
import Logo from "/src/assets/logo.png";
import OtpVector from "/src/assets/otp.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OtpVerificationPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();


      if (phone.length !== 10) {
    alert("⚠️ Please enter a valid 10-digit mobile number");
    return;
  }

    try {
      await api.post("/auth/request-otp", {
        phone_number: phone.trim(),
      });

      // ✅ STORE PHONE
      localStorage.setItem("phone", phone.trim());

      alert("OTP Sent Successfully!");
      navigate("/send"); // OTP screen
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-[600px] bg-white flex items-center justify-center px-4 shadow-2xl">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6 pt-24">

          {/* LEFT */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-semibold text-[#2f67f6]">
              OTP Verification
            </h1>

            <form onSubmit={onSubmit} className="mt-10 space-y-8">
              <div className="w-[280px] relative">
                <div className="absolute -top-3 left-4 bg-white px-1">
                  <span className="text-sm font-medium text-[#2f67f6]">
                    Phone Number
                  </span>
                </div>

                <div className="rounded-xl border border-[#2f67f6] px-4 py-3">
                  <input
                    type="tel"
                    value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // allow only digits
                  if (value.length <= 10) {
                    setPhone(value);
                  }
                }}
                    placeholder="1234567890"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-[260px] h-[52px] rounded-full bg-[#2f67f6] text-white font-semibold"
              >
                Continue
              </button>
            </form>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={OtpVector} className="w-[80%]" />
          </div>

        </div>
      </div>
    </div>
  );
}
