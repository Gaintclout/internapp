import React, { useEffect, useState } from "react";
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
import { IoIosSearch } from "react-icons/io";

export default function AdminDashboardMentor() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await apiAdmin.get("/admin/mentors");
        setMentors(res.data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      }
    };
    fetchMentors();
  }, []);

  /* ================= FILTER + SORT ================= */
  const filteredMentors = mentors
    .filter((m) =>
      `${m.mentor_name} ${m.project} ${m.student_name} ${m.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => a.mentor_name.localeCompare(b.mentor_name));

  /* ================= HIGHLIGHT ================= */
  const highlightText = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="text-blue-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    /* 🔴 ROOT FIX */
       <div className="min-h- bg-[#ffffff] flex flex-col md:flex-row">

      {/* MOBILE HEADER */}

      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <img src={Logo} alt="GAINT" className="h-8" />
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}

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

              <NavBtn icon={<Home size={18} />} label="Dashboard"
                onClick={() => navigate("/admindashboard")}
              />

              <NavBtn icon={<Users size={18} />} label="User"
                onClick={() => navigate("/admindashboarduser")}
              />

              <NavBtn icon={<BarChart2 size={18} />} label="Project Management"
                onClick={() => navigate("/projectManagement")}
              />

              <NavBtn icon={<CreditCard size={18} />} label="Payment" 
               onClick={() => navigate("/paymentreport")} />

              <NavBtn icon={<FileText size={18} />} label="Mentors" active
               
              />

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/adminlogin");
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 mt-4"
              >
                <LogOut size={18} /> Logout
              </button>

            </nav>
          </aside>
        </div>
      )}


 {/* DESKTOP SIDEBAR */}

      <aside className="hidden md:flex md:w-64 flex-col border-r bg-white">

        <div className="flex items-center gap-3 px-6 py-6">
          <img src={Logo} alt="GAINT" className="h-9" />
        </div>

        <nav className="px-2 py-4 text-sm flex flex-col gap-1">

          <NavBtn icon={<Home size={18} />} label="Dashboard"
            onClick={() => navigate("/admindashboard")}
          />

          <NavBtn icon={<Users size={18} />} label="User"
            onClick={() => navigate("/admindashboarduser")}
          />

          <NavBtn icon={<BarChart2 size={18} />} label="Project Management"
            onClick={() => navigate("/projectManagement")}
          />

          <NavBtn icon={<CreditCard size={18} />} label="Payment"
           onClick={() => navigate("/paymentreport")} />

          <NavBtn icon={<FileText size={18} />} label="Mentors" active 
           
          />

          <div className="flex-1" />

          <NavBtn icon={<LogOut size={18} />} label="Logout" danger
            onClick={() => {
              localStorage.clear();
              navigate("/adminlogin");
            }}
          />

        </nav>

      </aside>

      {/* ================= MAIN ================= */}
         <main className="flex-1 p-4 md:p-6 relative z-10">

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
          <div className="w-full sm:max-w-3xl relative">
            <input
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none"
              placeholder="Search here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
  <IoIosSearch />
</span>
          </div>

          <div className="flex justify-end">
            <AdminProfileMenu />
          </div>
        </div>

        {/* HEADING */}
        <div className="px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Mentors</h2>
          <p className="text-sm text-gray-500 mt-1">
            Hi, {admin?.name || "Admin"}
          </p>
        </div>

        {/* TABLE */}
        <div className="px-4 md:px-6 mt-6 pb-10">
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
<table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Mentor Name</th>
                  <th className="px-4 py-3 text-left">Allocated Project</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMentors.map((m, i) => (
                  <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">{highlightText(m.mentor_name)}</td>
                    <td className="px-4 py-3">{highlightText(m.project)}</td>
                    <td className="px-4 py-3">{highlightText(m.student_name)}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        m.status === "active"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {highlightText(m.status)}
                    </td>
                  </tr>
                ))}

                {filteredMentors.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
                      No matching mentors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= NAV BUTTON ================= */
const NavBtn = ({ icon, label, active, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
      ${active ? "bg-blue-50 text-blue-600 font-medium" : ""}
      ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50"}
    `}
  >
    {icon} {label}
  </button>
);
