import React from "react";
import logo from "../assets/logo.png";
import BgImage from "../assets/bg-paper.png";
import SpamshieldImg from "../assets/Spamshield.png";
import { Download } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

export default function Spamshield() {
  const navigate = useNavigate();

  // =============================
  // 🔹 DOWNLOAD PDF
  // =============================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/spamshieldX.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "spamshieldX.pdf";
      link.click();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF");
    }
  };

  // =============================
  // 🔹 Internship Routing
  // =============================
  const navigateByInternship = () => {
    const type = localStorage.getItem("selected_internship");

    switch (type) {
      case "fasttrack":
        navigate("/fasttrack");
        break;
      case "days45":
        navigate("/fortyfivedays");
        break;
      case "semester4m":
        navigate("/fourmonths");
        break;
      default:
        navigate("/fortyfivedays");
    }
  };

  // =============================
  // 🔹 OPEN TASK
  // =============================
  const openVSCodeByInternship = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigateByInternship();
    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >

      {/* HEADER */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center">
        <img src={logo} alt="logo" className="w-32" />
        <ProfileMenu />
      </div>

      {/* CONTENT */}
      <div className="relative -top-20 w-full max-w-4xl px-6 text-left">

        <h2 className="text-3xl font-semibold text-blue-600 mb-4">
          Spamshield
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Spamshield is an advanced system used to detect and block spam,
          phishing, and fraudulent activities across communication platforms.
          It uses AI algorithms to analyze messages in real-time and prevent
          malicious content.
        </p>

        {/* BUTTONS */}
        <div className="flex items-center gap-6 mt-8">

          <button
            onClick={openVSCodeByInternship}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow"
          >
            Task Evaluation
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow"
          >
            Download PDF
            <Download size={18} />
          </button>

        </div>
      </div>

      {/* IMAGE */}
      <img
        src={SpamshieldImg}
        alt="Spamshield"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[220px] object-contain"
      />
    </div>
  );
}