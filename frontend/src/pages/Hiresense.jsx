import React, { useEffect } from "react";
import Logo from "/src/assets/Logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Download } from "lucide-react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

export default function HireSense() {
  // const navigate = useNavigate();

  // =============================
  // 🔹 Save project selection
  // =============================
  useEffect(() => {
    saveProjectSelection();
  }, []);

  const saveProjectSelection = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/hiresense workflow.pdf",
        { project_name: "Hiresense" }
      );

      console.log("Backend:", response.data);
    } catch (error) {
      console.error("Error sending project:", error);
    }
  };

  // =============================
  // 🔹 DOWNLOAD PDF
  // =============================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/hiresense workflow.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "hiresense workflow.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF");
    }
  };

  // =============================
  // 🔹 Navigate / Open VS CODE (OLD LOGIC)
  // =============================
  const handleOpenVSCode = () => {
    alert("Opening Visual Studio Code...");
    window.location.href =
      "vscode://file/C:/Users/DELL/Desktop/intern_app_frontend";
    setTimeout(() => navigate("/task"), 1500);
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

      // Open VS Code (no folder path)
      // window.location.href =
      //   `vscode://gaintclout.internapp-vscode-extension?auth=${authCode}`;

      // Navigate user to correct internship tasks
      setTimeout(() => navigateByInternship(navigate), 1500);

    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

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
                src={Logo}
                alt="GAINT Logo"
                className="w-32"
              />
    
              {/* Profile Menu (right) */}
              <ProfileMenu />
            </div>

      {/* RIGHT PANEL */}
      <div className="absolute top-8 right-8 text-right">

        {/* Title */}
        {/* <h2 className="text-2xl font-semibold text-[#2563eb] bg-[#EBF2FF] rounded-full px-4 py-2">
          Allocation Project & Tasks
        </h2> */}

        {/* Blink CSS */}
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

      {/* MAIN CONTENT */}
      <div className="relative -top-32 w-full max-w-4xl px-6 text-left">
        <h2 className="text-3xl font-semibold text-[#2563eb] mb-4">
          Hiresense
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Multiple businesses operate under the name Hiresense, specializing in
          AI-driven tools and hiring platforms. HireSense.ai (India) is a
          talent intelligence platform, while Hire Sense (USA) focuses on
          candidate assessments. Both leverage AI for modern recruitment.
        </p>

        {/* TASK EVALUATION — SAME FORMAT */}
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
     href="http://127.0.0.1:8000/projects/materials/download/hiresense workflow.pdf"
     className="blink-btn flex items-center gap-2 bg-[#2563eb]
                text-white text-sm sm:text-base font-medium
                px-4 sm:px-6 py-2 rounded-lg shadow transition-all"
   >
     Download PDF
     <Download className="w-4 sm:w-5 h-4 sm:h-5" />
   </a>
 
 </div>
      </div>

      {/* IMAGE */}
      <img
        src="/src/assets/Hiresense.png"
        alt="HireSense"
        className="absolute bottom-0 left-1/2 -translate-x-1/2
             w-[400px] h-[290px]
             object-contain z-10 " 
         />
    </div>
  );
}
