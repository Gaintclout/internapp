import React, { useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import BgImage from "../assets/bg-paper.png";

export default function QuincenaReport() {
  const navigate = useNavigate();

  const reports = [
    { days: "01 to 15", dates: "01/09/2025 - 15/09/2025" },
    { days: "15 to 30", dates: "15/09/2025 - 30/09/2025" },
    { days: "30 to 45", dates: "01/10/2025 - 15/10/2025" },
    { days: "45 to 60", dates: "16/10/2025 - 30/10/2025" },
    { days: "60 to 75", dates: "01/11/2025 - 15/11/2025" },
    { days: "75 to 90", dates: "16/11/2025 - 30/11/2025" },
    { days: "90 to 105", dates: "01/12/2025 - 15/12/2025" },
    { days: "105 to 120", dates: "16/12/2025 - 30/12/2025" },
  ];

  const [unlockedIndex, setUnlockedIndex] = useState(0);

  const progress = Math.round(((unlockedIndex + 1) / reports.length) * 100);

  // DOWNLOAD HANDLER
  const handleDownload = (report, index) => {
    const content = `
GAINT CLOUT TECHNOLOGIES

Quincena Report

Period: ${report.dates}
Days: ${report.days}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: "text/plain" }); // safer than fake pdf
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Report_${report.days.replace(/\s/g, "_")}.txt`;
    link.click();

    URL.revokeObjectURL(url);

    // NAVIGATION LOGIC
    if (index === reports.length - 1) {
      navigate("/certificate");
    } else {
      setUnlockedIndex(index + 1);
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-gray-50 relative px-4 py-4 bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* HEADER */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center max-w-6xl mx-auto px-4">
        <img src={logo} alt="logo" className="w-24" />
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
          Quincena Report
        </h2>
      </div>

      {/* TABLE */}
      <div className="w-full max-w-4xl mt-20">
        <div className="grid grid-cols-3 text-center font-semibold text-blue-600 mb-4">
          <div>Days</div>
          <div>Dates</div>
          <div>Certificate</div>
        </div>

        <div className="flex flex-col gap-3">
          {reports.map((report, index) => {
            if (index > unlockedIndex) return null;

            const isLocked = index !== unlockedIndex;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 sm:grid-cols-3 items-center border rounded-xl px-4 py-3 ${
                  isLocked ? "bg-gray-200 opacity-70" : "bg-white"
                }`}
              >
                <div className="text-center">{report.days}</div>
                <div className="text-center">{report.dates}</div>

                <div className="flex justify-center">
                  <button
                    disabled={isLocked}
                    onClick={() => handleDownload(report, index)}
                    className={`${
                      isLocked
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-blue-600 font-semibold mb-2">Progress</h3>

        <div className="w-full bg-white border rounded-full h-6 relative overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>

          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}