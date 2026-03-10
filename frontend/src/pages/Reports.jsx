import React, { useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Added navigation
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";

export default function QuincenaReport() {
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

  const [unlockedIndex, setUnlockedIndex] = useState(0); // start with first report visible
  const navigate = useNavigate();
  const progress = Math.round(((unlockedIndex + 1) / reports.length) * 100);

  // 🔹 Handle Download logic
  const handleDownload = (report, index) => {
    // Create dummy file
    const fileContent = `GAINT CLOUT - Quincena Report\n\nPeriod: ${report.dates}\nDays: ${report.days}\n\nGenerated on ${new Date().toLocaleDateString()}`;
    const blob = new Blob([fileContent], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Report_${report.days.replace(/\s/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // ✅ If it's the last report → open certificate page
    if (index === reports.length - 1) {
      navigate("/certificate");
    } else {
      // Unlock next report
      setUnlockedIndex(index + 1);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start bg-gray-50 shadow-2xl relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* ✅ Header */}
      <div className="absolute top-2 left-0 right-0 flex items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-8">
        <img src={Logo} alt="GAINT Logo" className="w-16 sm:w-24 md:w-32" />
        <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-[#2563eb]">
          Quincena Report
        </h2>
      </div>

      {/* ✅ Table */}
      <div className="w-full max-w-4xl mt-12 sm:mt-14 md:mt-16 px-1 sm:px-4">
        <div className="grid grid-cols-3 text-center font-semibold text-[#2563eb] mb-4 text-xs sm:text-sm md:text-lg lg:text-xl">
          <div>Days</div>
          <div>Dates</div>
          <div>Certificate</div>
        </div>

        {/* Report Rows */}
        <div className="flex flex-col gap-3">
          {reports.map((report, index) => {
            if (index > unlockedIndex) return null; // hide locked reports

            const isLocked = index !== unlockedIndex;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 sm:grid-cols-3 items-center border border-blue-400 rounded-2xl px-3 sm:px-6 py-2 sm:py-3 ${
                  isLocked ? "bg-gray-200 opacity-70" : "bg-white"
                } text-gray-700 hover:shadow-md transition-all duration-300 text-xs sm:text-sm md:text-base lg:text-lg`}
              >
                <div className="text-center font-medium mb-1 sm:mb-0">
                  {report.days}
                </div>
                <div className="text-center mb-1 sm:mb-0">{report.dates}</div>
                <div className="flex justify-center">
                  <button
                    disabled={isLocked}
                    onClick={() => handleDownload(report, index)}
                    className={`transition ${
                      isLocked
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                    title={
                      isLocked
                        ? "This report will unlock after completing the previous one"
                        : "Download Certificate"
                    }
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Progress Bar */}
      <div className="w-full max-w-4xl mt-8 mb-8 px-2 sm:px-4">
        <h3 className="text-[#2563eb] font-semibold mb-2 text-sm sm:text-base md:text-lg">
          Progress
        </h3>
        <div className="w-full bg-white border border-blue-300 rounded-full h-5 sm:h-6 relative overflow-hidden shadow-sm">
          <div
            className="bg-[#2563eb] h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm md:text-base font-semibold leading-5 sm:leading-6">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
