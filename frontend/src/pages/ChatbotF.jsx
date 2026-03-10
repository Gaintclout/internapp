import React, { useState, useEffect } from "react";
import Logo from "/src/assets/Logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfileMenu from "../components/ProfileMenu";

export default function ChatbotF() {
  const navigate = useNavigate();

  // ===========================
  // 🔹 Save project selection
  // ===========================
  useEffect(() => {
    saveProjectSelection();
  }, []);

  const saveProjectSelection = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/gpt 3.5 fastapi workflow.pdf",
        { project_name: "Chatbot Using FastAPI" }
      );
      console.log("Backend:", response.data);
    } catch (error) {
      console.error("Error sending project:", error);
    }
  };

  // ===========================
  // 🔹 Download project PDF
  // ===========================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/gpt 3.5 fastapi workflow.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "gpt_3.5_fastapi_workflow.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF");
    }
  };

  // ===========================
  // 🔹 Internship Navigation
  // ===========================
  const navigateByInternship = () => {
    const type = localStorage.getItem("selected_internship");

    switch (type) {
      case "fasttrack":
        navigate("/fastrack");
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

  // ===========================
  // 🔹 Open VS Code via Extension
  // ===========================
  const openVSCodeByInternship = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      // 1️⃣ Generate auth code
      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authCode = res.data.auth_code;

      // 2️⃣ Open VS Code (no folder path)
      // window.location.href =
      //   `vscode://gaintclout.internapp-vscode-extension?auth=${authCode}`;

      // 3️⃣ Redirect student to their internship task page
      setTimeout(() => navigateByInternship(), 1500);

    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

      // ===========================
      // 🔹 UI RENDER
      // ===========================
      return (
    <div className="relative h-[750px] py-10 flex flex-col items-center justify-center
                    overflow-hidden rounded-xl
                shadow-[0_0_30px_rgba(0,0,0,0.25)]">
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BgImage})`,
          transform: "rotate(-25deg)",
        }}
      ></div>

      {/* Logo */}
       <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
     
               {/* Logo (left) */}
               <img
                 src={Logo}
                 alt="GAINT Logo"
                 className="w-32"
               />
     
               {/* Profile Menu (right) */}
               <ProfileMenu />
             </div>


            <div className="absolute top-8 right-8 text-right">


            {/* 🔹 Blink Button Style */}
            <style>
              {`
                @keyframes blinkEffect {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
                .blink-btn {
                  animation: blinkEffect 1.2s infinite;
                }
              `}
            </style>

            {/* 🔹 Download PDF Button */}
          {/* <div className="mt-16">   
            <button
              onClick={handleDownloadPDF}
              className="blink-btn flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2 rounded-lg shadow"
            >
              Download PDF
              <Download className="w-5 h-5" />
            </button>
          </div> */}

          </div>


            {/* Main Content */}
            <div className="relative -top-28 w-full max-w-4xl px-6 text-left">
              <h2 className="text-3xl font-semibold text-[#2563eb] mb-4">
                Chatbot Using FastAPI
              </h2>

              <p className="text-gray-600 leading-relaxed">
                A Chatbot using FastAPI provides high-performance API endpoints,
                handles user inputs, communicates with ML or AI models, and enables
                real-time conversational interaction efficiently.
              </p>

              {/* ⭐ Open VS CODE BUTTON */}
        <div className="flex items-center gap-6 mt-8">
        
            {/* Task Evaluation Button */}
            <button
                      onClick={openVSCodeByInternship}
                      className="inline-flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl shadow-lg active:scale-95 cursor-pointer"
                    >
                    Task Evaluation
                    </button>

            {/* Download PDF Button */}
            <a
              href="http://127.0.0.1:8000/projects/materials/download/gpt 3.5 fastapi workflow.pdf"
              className="blink-btn flex items-center gap-2 bg-[#2563eb]
                        text-white text-sm sm:text-base font-medium
                        px-4 sm:px-6 py-2 rounded-lg shadow transition-all"
            >
              Download PDF
              <Download className="w-4 sm:w-5 h-4 sm:h-5" />
            </a>

          </div>

           </div>

            {/* Video Section */}
            <video
              src="/src/assets/chatbotfastapi.mp4"
              autoPlay
              loop
              muted
              playsInline
                className="
                absolute
                bottom-[0px]
                left-1/2 transform -translate-x-1/2
                w-[999px]
                h-[359px]
                object-contain
                rounded-xl
              "
          
              // className="absolute bottom-[-170px] left-1/2 transform -translate-x-1/2 w-[1100px]"
            />
          </div>
  );
}
