import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import ProfileMenu from "../components/ProfileMenu";

export default function PreferenceSelection() {
  const [language, setLanguage] = useState("");
  const [interest, setInterest] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!language || !interest) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    // ✅ language will now be "python" or "nextjs"
    localStorage.setItem("preferred_language", language);
      localStorage.removeItem("selected_project");
    navigate("/payment");
  };

  return (
    <div className="min-h-[70vh] relative overflow-visible p-4">
      {/* 🔹 BACKGROUND IMAGE CONTAINER */}
      <div className="absolute inset-0 rounded-xl  shadow-[0_0_10px_rgba(0,0,0,0.20)]">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat rounded-xl shadow-2xl"
          style={{ backgroundImage: `url(${BgImage})` }}
        />

        {/* ✅ OVERLAY HEADER INSIDE BACKGROUND */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
          {/* Logo (left) */}
          <img src={Logo} alt="GAINT Logo" className="w-32" />

          {/* Profile Menu (right) */}
          <ProfileMenu />
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="relative z-10 flex items-center justify-center px-4 py-24">
        {/* CARD */}
        <div className="bg-white/90 backdrop-blur-sm p-8 pt-10 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-[#2563eb] mb-8">
            Preference Selection
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Preferred Language */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Preferred Language
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-blue-400 rounded-md p-3 outline-none text-gray-700"
              >
                <option value="">Select Language</option>
                <option value="python">Python</option>
                <option value="nextjs">Next.js</option>
              </select>
            </div>

            {/* Area of Interest */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Area of Interest
              </label>

              <textarea
                rows="3"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                maxLength={500}
                placeholder="Enter your title here"
                className="w-full border border-blue-400 rounded-md p-3 outline-none"
              />

              <p className="text-right text-xs text-gray-500 mt-1">
                {interest.length}/500 characters
              </p>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white py-3 rounded-full font-semibold hover:bg-[#1e4ed8] transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
