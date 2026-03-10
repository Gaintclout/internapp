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
export default function AdminDashboardProject() {

  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* ================= DATA ================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiAdmin.get("/admin/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    fetchProjects();
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

  /* ================= FILTER ================= */

  const filteredProjects = projects
    .filter((p) =>
      `${p.title} ${p.technology} ${p.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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

    <div className="min-h- bg-[#ffffff] flex flex-col md:flex-row">

      {/* MOBILE HEADER */}

<div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b z-30 relative">        <img src={Logo} alt="GAINT" className="h-8" />
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

           {/* MOBILE SIDEBAR */}
      {mobileMenuOpen && (
<div className="fixed inset-0 z-[60] md:hidden flex">          <div
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

      {/* SIDEBAR */}

      <aside className="hidden md:flex md:w-64 flex-col border-r bg-white">

        <div className="flex items-center gap-3 px-6 py-6">
          <img src={Logo} alt="GAINT" className="h-9" />
        </div>

        <nav className="px-2 py-4 flex flex-col gap-1 text-sm">

          <NavBtn icon={<Home size={18} />} label="Dashboard"
            onClick={() => navigate("/admindashboard")}
          />

          <NavBtn icon={<Users size={18} />} label="User"
            onClick={() => navigate("/admindashboarduser")}
          />

          <NavBtn icon={<BarChart2 size={18} />} label="Project Management" active />

          <NavBtn icon={<CreditCard size={18} />} label="Payment"
            onClick={() => navigate("/paymentreport")}
          />

          <NavBtn icon={<FileText size={18} />} label="Mentors"
            onClick={() => navigate("/mentor")}
          />

          <div className="flex-1" />

          <NavBtn icon={<LogOut size={18} />} label="Logout" danger />

        </nav>

      </aside>

      {/* MAIN CONTENT */}

<main className="flex-1 w-full overflow-x-hidden relative z-10  ">
        {/* SEARCH BAR */}

        <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">

          <div className="w-full sm:max-w-3xl relative">

            <input
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none"
              placeholder="Search here"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
  <IoIosSearch />
</span>

          </div>

          <div className="flex justify-end">
            <AdminProfileMenu />
          </div>

        </div>

        {/* TITLE */}

        <div className="px-4 md:px-6">

          <h2 className="text-2xl md:text-3xl font-bold">
            Project Management
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Hi, {admin?.name || "Admin"}
          </p>

        </div>

        {/* TABLE */}

        <div className="px-4 md:px-6 mt-6">

          <div className="overflow-x-auto bg-white border rounded-2xl shadow-sm">

            <table className="min-w-[700px] w-full text-sm">

              <thead className="bg-blue-600 text-white">

                <tr>
                  <th className="px-4 py-3 text-left">S.No</th>
                  <th className="px-4 py-3 text-left">Project Title</th>
                  <th className="px-4 py-3 text-left">Technology</th>
                  <th className="px-4 py-3 text-left">Interns Assigned</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>

              </thead>

              <tbody className="divide-y">

                {currentProjects.map((p, i) => (

                  <tr key={p.project_id} className={i % 2 ? "bg-gray-50" : ""}>

                    <td className="px-4 py-3">
                      {indexOfFirst + i + 1}
                    </td>

                    <td className="px-4 py-3">
                      {highlightText(p.title)}
                    </td>

                    <td className="px-4 py-3">
                      {highlightText(p.technology)}
                    </td>

                    <td className="px-4 py-3">
                      {p.interns_assigned}
                    </td>

                    <td className={`px-4 py-3 font-semibold ${
                      p.status.toLowerCase() === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {highlightText(p.status)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-white text-sm disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (

              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-lg border text-sm
                ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>

            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border bg-white text-sm disabled:opacity-40"
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