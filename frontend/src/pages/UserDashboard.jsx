import React from "react";
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Home, Users, BarChart2, CreditCard, FileText, LogOut } from "lucide-react";

export default function AdminUser() {
  const rows = [
    { name: "Rohini", email: "rohi@gaint.com", college: "Mallareddy", type: "Fast Track", progress: 60 },
    { name: "Nikitha", email: "rohi@gaint.com", college: "Mallareddy", type: "45", progress: 80 },
    { name: "Nikhitha", email: "rohi@gaint.com", college: "Mallareddy", type: "Fast Track", progress: 60 },
    { name: "Rohini", email: "rohi@gaint.com", college: "Mallareddy", type: "45", progress: 45 },
    { name: "Nikitha", email: "rohi@gaint.com", college: "Mallareddy", type: "Fast Track", progress: 60 },
    { name: "Nikitha", email: "rohi@gaint.com", college: "Mallareddy", type: "45", progress: 60 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-800 flex relative overflow-hidden">
      {/* Background watermark */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImage})`, transform: "rotate(-25deg)", transformOrigin: "center" }}
      />

      {/* Sidebar */}
      <aside className="relative z-10 hidden md:flex md:w-64 flex-col border-r border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-6 py-6">
          <img src={Logo} alt="GAINT" className="h-9 w-auto" />
        </div>
        <nav className="px-2 py-4 text-sm">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 w-full text-left text-gray-700"><Home size={18} /> Dashboard</button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium w-full text-left"><Users size={18} /> User</button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 w-full text-left text-gray-700"><BarChart2 size={18} /> Project Management</button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 w-full text-left text-gray-700"><CreditCard size={18} /> Payment & Reports</button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 w-full text-left text-gray-700"><FileText size={18} /> Mentors</button>
          <div className="mt-auto" />
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full text-left"><LogOut size={18} /> Logout</button>
        </nav>
        <div className="mt-auto px-6 py-6 text-[10px] text-gray-400">Gaint Interns Admin Dashboard<br/>© 2025 All Rights Reserved</div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 p-4 md:p-6">
          <div className="flex-1 max-w-3xl">
            <div className="relative">
              <input className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400" placeholder="Search here" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hello, <span className="font-medium">Samantha</span></span>
            <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">🙂</div>
          </div>
        </div>

        {/* Heading */}
        <div className="px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold">User</h2>
        </div>

        {/* Table */}
        <div className="px-4 md:px-6 mt-6 pb-10">
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">College</th>
                  <th className="px-4 py-3 text-left font-medium">Internship Type</th>
                  <th className="px-4 py-3 text-left font-medium">Progress</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-gray-700">{r.name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.email}</td>
                    <td className="px-4 py-3 text-gray-600">{r.college}</td>
                    <td className="px-4 py-3 text-gray-600">{r.type}</td>
                    <td className="px-4 py-3 text-gray-700">{r.progress}%</td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:underline">Reassign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


