import React from "react";
import logo from "../assets/logo.png";
import BgImage from "../assets/bg-paper.png";
import chatbotFlaskVideo from "../assets/chatbotflask.mp4"
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfileMenu from "../components/ProfileMenu";

export default function ChatbotF() {
  // ===========================
  // 🔹 Send file info to backend
  // ===========================
  const handleFileSave = async (fileType) => {
    try {
      const fileData = {
        fileName: fileType === "Chatbot_Flask.pdf",
        fileType: fileType,
        content: "Base64 or Blob data here (optional)",
      };

      const res = await fetch("http://159.65.149.205:8000/api/save-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });

      if (res.ok) {
        alert(`${fileType.toUpperCase()} file stored successfully! ✅`);
      } else {
        alert("Error saving file ❌");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };


  // ===========================
  // 🔹 PDF Download
  // ===========================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/gpt 3.5 flask workflow.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "gpt 3.5 flask workflow.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF");
    }
  };

  // ===========================
  // 🔹 Navigation Setup
  // ===========================
  const navigate = useNavigate();

  // ===========================
  // 🔹 Internship Routing Logic
  // ===========================
  const navigateByInternship = (navigate) => {
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
  // 🔹 Open VS Code + Internship Page
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
      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authCode = res.data.auth_code;

    // ✅ Open VS Code extension first
      window.location.href =
        `vscode://gaintclout.internapp-vscode-extension?auth=${authCode}`;

      // ✅ Then navigate to internship page after short delay
      setTimeout(() => navigateByInternship(navigate), 1500);


    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

  // ===========================
  // 🔹 UI RENDER
  // ===========================
  return (
 <div
  className="h-[70vh] flex flex-col items-center justify-center bg-gray-50
             relative px-4 bg-cover bg-center bg-no-repeat
             shadow-[0_0_30px_rgba(0,0,0,0.25)] rounded-xl"
  style={{
    backgroundImage: `url(${BgImage})`,
  }}
>

     <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
   
             {/* Logo (left) */}
             <img
               src={logo}
               alt="GAINT logo"
               className="w-32"
             />
   
             {/* Profile Menu (right) */}
             <ProfileMenu />
           </div>

      {/* Heading + PDF Download */}
      <div className="absolute top-8 sm:top-10 right-4 sm:right-8 md:right-10 text-right max-w-[90%] sm:max-w-sm md:max-w-md">
        
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


      </div>

      {/* Main Content */}
      <div className="relative -top-10 sm:-top-40 w-full max-w-4xl px-2 sm:px-6 md:px-10 text-center md:text-left mt-10 sm:mt-20">
        
        <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-[#2563eb] mb-4">
          Chatbot Using Flask
        </h2>

        <p className="text-gray-600 text-xs sm:text-base md:text-lg leading-relaxed text-justify px-2 sm:px-0">
          A chatbot built using Flask is a web-based application that leverages
          the Flask microframework…
        </p>

        {/* ⭐ VS CODE BUTTON */}
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
    href="http://159.65.149.205:8000/projects/materials/download/gpt 3.5 flask workflow.pdf"
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
  src={chatbotFlaskVideo}
  autoPlay
  loop
  muted
  playsInline
  className="
    absolute
    bottom-0
    left-1/2 -translate-x-1/2
    w-[90%] sm:w-[80%] md:w-[700px] lg:w-[900px]
    h-auto
    max-h-[220px] sm:max-h-[260px] md:max-h-[300px]
    object-contain
    rounded-xl
  "
/>

    </div>
  );
}
