import React, { useState, useEffect } from "react";
import Logo from "/src/assets/logo.png";
import {
  Home,
  Users,
  BarChart2,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiAdmin from "../api/apiAdmin";
import AdminProfileMenu from "../components/AdminProfileMenu";
import { FaFolderOpen } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const [metrics, setMetrics] = useState({
    total_users: 0,
    projects: 0,
    payments: 0,
    amount_collected: 0,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await apiAdmin.get("/admin/dashboard/metrics");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

const StatCard = ({ color, value, label, icon: Icon }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
    
    <div
      className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl"
      style={{ backgroundColor: color }}
    >
      <Icon />
    </div>

    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>

  </div>
);

  return (
    <div className="h-[70vh]  text-gray-800 flex flex-col md:flex-row">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b z-40">
        <img src={Logo} alt="GAINT" className="h-8" />
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="w-64 bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <img src={Logo} alt="GAINT" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="px-2 py-4 text-sm flex flex-col gap-1">
              <NavBtn icon={<Home size={18} />} label="Dashboard" onClick={() => navigate("/admindashboard")} />
              <NavBtn icon={<Users size={18} />} label="User" onClick={() => navigate("/admindashboarduser")} />
              <NavBtn icon={<BarChart2 size={18} />} label="Project Management" onClick={() => navigate("/projectManagement")} />
              <NavBtn icon={<CreditCard size={18} />} label="Payment" onClick={() => navigate("/paymentreport")} />
              <NavBtn icon={<FileText size={18} />} label="Mentors" onClick={() => navigate("/mentor")} />
              <NavBtn label="⚙️ Setting" onClick={() => navigate("/setting")} />

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/adminlogin");
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full text-left mt-4"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-6 py-6">
          <img src={Logo} alt="GAINT" className="h-9" />
        </div>

        <nav className="px-2 py-4 text-sm flex flex-col gap-1">
          <NavBtn icon={<Home size={18} />} label="Dashboard" active onClick={() => navigate("/admindashboard")} />
          <NavBtn icon={<Users size={18} />} label="User" onClick={() => navigate("/admindashboarduser")} />
          <NavBtn icon={<BarChart2 size={18} />} label="Project Management" onClick={() => navigate("/projectManagement")} />
          <NavBtn icon={<CreditCard size={18} />} label="Payment" onClick={() => navigate("/paymentreport")} />
          <NavBtn icon={<FileText size={18} />} label="Mentors" onClick={() => navigate("/mentor")} />
          <NavBtn label="⚙️ Setting" onClick={() => navigate("/setting")} />
          <div className="flex-1" />
          <NavBtn
            icon={<LogOut size={18} />}
            label="Logout"
            danger
            onClick={() => {
              localStorage.clear();
              navigate("/adminlogin");
            }}
          />
        </nav>

        <div className="px-6 py-6 text-[10px] text-gray-400">
          Gaint Interns Admin Dashboard
          <br />© 2025 All Rights Reserved
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full overflow-x-hidden relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
          <div className="w-full sm:max-w-3xl relative">
            <input
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none"
              placeholder="Search here"
            />
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
  <IoIosSearch />
</span>          </div>
          <div className="flex justify-end">
            {!mobileMenuOpen && <AdminProfileMenu />}
          </div>
        </div>

        <div className="px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Hi, {admin?.name || "Admin"}. Welcome back!
          </p>
        </div>

      {/* <div className="grid grid-cols-3 gap-6"> */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  <StatCard
    icon={MdGroups2}
    value={metrics.total_users}
    label="Total Users"
    color="#3498db"
  />

  <StatCard
    icon={FaFolderOpen}
    value={metrics.projects}
    label="Active Projects"
    color="#10b981"
  />

  <StatCard
    icon={RiSecurePaymentFill}
    value={`₹${metrics.amount_collected}`}
    label="Payment Collected"
    color="#3b82f6"
  />

</div>
      </main>
    </div>
  );
}

/* ================= HELPER ================= */
const NavBtn = ({ icon, label, active, danger, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
      ${active ? "bg-blue-50 text-blue-600 font-medium" : ""}
      ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50"}
    `}
  >
    {icon} {label}
  </button>
);
