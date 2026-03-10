import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 
import { Download,MessageCircle } from "lucide-react";
import Logo from "/src/assets/Logo.png";
import Background from "/src/assets/bg-paper.png";

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

export default function InternDashboardReports() {
   const [active, setActive] = useState("report");
   const navigate = useNavigate(); // ✅ Initialize navigation

  const routes = {
    "My Project": "/interndashboard",
    Tasks: "/interndashboardtask",
    Reports: "/interndashboardreport",
    Certificate: "/interndashboardcertificate",
    Logout: "/internlogout",
  };
  return (
     <div
         className="min-h-[70vh] flex flex-col items-center justify-center bg-cover bg-center relative px-4 sm:px-6 md:px-8 bg-gray-50 shadow-2xl"
         style={{
           backgroundImage: `url(${Background})`,
           backgroundRepeat: "no-repeat",
           backgroundSize: "cover",
         }}
       >
            {/* Top Logo */}
              <div className="absolute top-4 left-8 flex items-center space-x-2">
                <img src={Logo} alt="GAINT Logo" className="w-13 h-8" />
              </div>

 <div className="absolute top-6 right-10 flex items-center space-x-2 text-sm text-gray-600">
        <span>Hello,</span>
        <span className="font-medium">Samantha</span>
        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
 <section className="relative right-[70px] flex justify-center items-start gap-10  py-10 ">
        {/* Left Box */}
  <main className="relative top-[30px] w-[250px] h-[400px] left-[150px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
       <aside className="w-[200px]   p- flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Dashboard</h2>

        {["My Project", "Tasks", "Reports", "Certificate", "Logout"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setActive(item);
              navigate(routes[item]); // ✅ navigate on click
            }}
            className={`w-full  px-4 py-2 rounded-full border transition-all text-sm font-medium ${
              active === item
                ? "bg-blue-600 text-white border-blue-600"
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {item}
          </button>
        ))}
      </aside>
    </main>

        {/* Right Box */}
 <main className="w-[850px] min-h-[50vh] right-[0px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">    
        
    <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-blue-600 font-semibold text-left border-b border-blue-100">
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reports</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-blue-50 hover:bg-blue-50 transition w-3"
                  >
                    <td className="py-3 px-4">{item.days}</td>
                    <td className="py-3 px-4">{item.dates}</td>
                    <td className="py-3 px-4 text-blue-600 flex items-center justify-center">
                      <Download size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       
          <button className="absolute bottom-12 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all">
            <MessageCircle size={24} />
          </button>
        </main>
      </section>

      <div className="flex w-10/12 max-w-6xl gap-6">

    
      </div>
    </div>
  );
}
