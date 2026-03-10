

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Download } from "lucide-react";
import Logo from "/src/assets/logo.png";
import ProfileMenu from "../components/ProfileMenu";

export default function CertificatePage() {
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not logged in");
          return;
        }

        const res = await fetch(
          "http://127.0.0.1:8000/certificate/download",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

         if (!res.ok) {
            setError("Certificate not available");
              return;
                  }

                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob) + "#toolbar=0&navpanes=0&scrollbar=0";
                  setPdfUrl(url);

                } catch (err) {
                  setError("Failed to load certificate");
                }
              };

              loadCertificate();

              return () => {
                if (pdfUrl) URL.revokeObjectURL(pdfUrl);
              };
            }, []);

            const downloadPDF = () => {
              const a = document.createElement("a");
              a.href = pdfUrl;
              a.download = "GAINT_Certificate.pdf";
              a.click();
            };

            if (error) {

            }

          return (
              <div className="min-h-[10vh] bg-white flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 relative rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.25)]  pt-10">

                {/* ✅ USER PROFILE (TOP-RIGHT, INSIDE CARD) */}

          {/* 🔹 TOP BAR */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">

            {/* LEFT: LOGO */}
            <img
              src={Logo}
              alt="GAINT Logo"
              className="w-28 md:w-36"
            />

            {/* RIGHT: USER PROFILE */}
            <ProfileMenu />

          </div>

            <div className="w-full flex flex-col bg-white mt-12 ">
              {/* PDF VIEW – NO SCROLL */}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="Certificate"
                  className="w-full h-[61vh] bg-white border-none"
                />
              )}

              {/* ACTION BAR */}
              <div className="flex justify-center gap-4 py-4 bg-white shadow">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Download
                </button>

                <button
                  onClick={() => navigate("/InternDashboard")}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Dashboard
                </button>
              </div>
            </div>
             </div>
              );
            }
