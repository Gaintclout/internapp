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

export default function AdminDashboardUser() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const PAGE_WINDOW = 3;

  /* ================= DATA ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiAdmin.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  /* ================= FILTER + PAGINATION ================= */
  const filteredUsers = users
    .filter((u) =>
      `${u.name} ${u.email} ${u.college}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= TEXT HIGHLIGHT ================= */
  const highlightText = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="text-blue-600 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ================= PAGE NUMBERS ================= */
  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - PAGE_WINDOW);
  const endPage = Math.min(totalPages, currentPage + PAGE_WINDOW);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="h- bg-[#ffffff] text-gray-800 flex flex-col md:flex-row">

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b z-40">
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
              <NavBtn icon={<Home size={18} />} label="Dashboard" onClick={() => navigate("/admindashboard")} />
              <NavBtn icon={<Users size={18} />} label="User" active />
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

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-6 py-6">
          <img src={Logo} alt="GAINT" className="h-9" />
        </div>

        <nav className="px-2 py-4 text-sm flex flex-col gap-1">
          <NavBtn icon={<Home size={18} />} label="Dashboard" onClick={() => navigate("/admindashboard")} />
          <NavBtn icon={<Users size={18} />} label="User" active />
          <NavBtn icon={<BarChart2 size={18} />} label="Project Management" onClick={() => navigate("/projectManagement")} />
          <NavBtn icon={<CreditCard size={18} />} label="Payment" onClick={() => navigate("/paymentreport")} />
          <NavBtn icon={<FileText size={18} />} label="Mentors" onClick={() => navigate("/mentor")} />
          <div className="flex-1" />
          <NavBtn icon={<LogOut size={18} />} label="Logout" danger />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full overflow-auto">

        {/* SEARCH */}
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

          {!mobileMenuOpen && (
            <div className="flex justify-end">
              <AdminProfileMenu />
            </div>
          )}
        </div>

        {/* TITLE */}
        <div className="px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold">User</h2>
          <p className="text-sm text-gray-500 mt-1">
            Hi, {admin?.name || "Admin"}
          </p>
        </div>

        {/* TABLE */}
        <div className="mt-6 px-4 md:px-6">
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-[900px] w-full text-sm text-center">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">College</th>
                  <th className="px-6 py-3">Internship Type</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((u, i) => (
                  <tr key={u.user_id} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="px-6 py-3 font-medium">
                      {startIndex + i + 1}
                    </td>
                    <td className="px-6 py-3">{highlightText(u.name)}</td>
                    <td className="px-6 py-3">{highlightText(u.email)}</td>
                    <td className="px-6 py-3">{highlightText(u.college)}</td>
                    <td className="px-6 py-3 capitalize">{u.internship_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded-md bg-white disabled:opacity-40"
            >
              Prev
            </button>

            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === num
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md bg-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* NAV BUTTON */
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