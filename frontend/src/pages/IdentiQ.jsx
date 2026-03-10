import React, { useState, useEffect } from "react";
import Logo from "/src/assets/Logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Download } from "lucide-react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

export default function Identiq() {
  const navigate = useNavigate();

  // =============================
  // 🔹 Save project selection
  // =============================


  useEffect(() => {
  const saveProject = async () => {
    await api.post("/projects/select?project_id=identiq");
  };

  saveProject();
}, []);

useEffect(() => {
  const projectId = localStorage.getItem("selected_project");
  console.log("Selected project:", projectId);
}, []);


  // =============================
  // 🔹 Download PDF
  // =============================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/identiq flow.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "identiq flow.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
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

  // =============================
  // 🔹 Open VS Code Extension
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
      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authCode = res.data.auth_code;

      // Open VS Code extension
      // window.location.href =
      //   `vscode://gaintclout.internapp-vscode-extension?auth=${authCode}`;

      // Navigate to tasks
      setTimeout(() => navigateByInternship(), 1500);

    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

  // =============================
  // 🔹 UI Render
  // =============================
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
          IdentiQ
        </h2>

         <p className="text-gray-600 leading-relaxed">
          The IdentiQ Protocol is a private, decentralized network for identity
          validation. It enables companies to verify user identities without
          ever sharing sensitive customer data.
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
      href="http://127.0.0.1:8000/projects/materials/download/identiq flow.pdf"
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
        src="/src/assets/IdentiQ.png"
        alt="IdentiQ"
    className="absolute bottom-0 left-1/2 -translate-x-1/2
             w-[400px] h-[320px]
             object-contain z-10 "       />
     </div>
   );
 }
 