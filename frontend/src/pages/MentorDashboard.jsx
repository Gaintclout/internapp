import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "/src/assets/Logo.png";
// import api from "../api/axios";
import apiMentor from "../api/apiMentor";
import { useNavigate } from "react-router-dom";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⭐ Interns
  const [interns, setInterns] = useState([]);
  const [search, setSearch] = useState("");

  // ⭐ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const PAGE_WINDOW = 3;

  // ⭐ Mentor profile
  const mentor =
    JSON.parse(localStorage.getItem("mentor_user")) || {
      name: "Mentor",
      email: "",
    };

  // ⭐ Fetch interns (LOGIC FIXED, UI SAME)
 const fetchInterns = async () => {
  try {
    console.log("🔥 fetchInterns called");

const response = await apiMentor.get("/mentors/dashboard");

    console.log("✅ Dashboard response:", response.data);

    if (Array.isArray(response.data)) {
      setInterns(
        response.data.map((i) => ({
          InternName: i.intern_name || i.name || "Unknown",
          Project: i.project || "Not Assigned",
          progress: i.progress || "0%",
          Feedback: i.feedback || "No feedback",
        }))
      );
    } else {
      setInterns([]);
    }
  } catch (err) {
    console.error("❌ Mentor dashboard fetch failed:", err);
    setInterns([]);
  }
};

  // 🔍 Search filter (UNCHANGED)
const filteredInterns = interns.filter((i) => {
  const name = i.InternName || "";
  const project = i.Project || "";
  return `${name} ${project}`
    .toLowerCase()
    .includes(search.toLowerCase());
});


  // 🔢 Pagination logic (UNCHANGED)
  const totalPages = Math.ceil(filteredInterns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInterns = filteredInterns.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const windowStart =
    Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const windowEnd = Math.min(windowStart + PAGE_WINDOW - 1, totalPages);

  const visiblePages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i
  );

useEffect(() => {
  console.log("🔥 MentorDashboard mounted");
  fetchInterns();
}, []);

useEffect(() => {
  console.log("🔁 interns updated:", interns.length);
  setCurrentPage(1);
}, [interns]);


  // 🔵 Highlight search text (UNCHANGED)
  const highlightText = (text) => {
    if (!search) return text;
    return text.split(new RegExp(`(${search})`, "ig")).map((part, i) =>
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
    <div className="flex flex-col md:flex-row bg-white h-[700px] p-4 md:p-6 lg:p-8">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-[0px] left-0 h-full md:h-auto w-64 bg-white border-r shadow-md flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex items-center justify-center h-20 border-b">
            <img src={Logo} alt="GAINT Logo" className="w-28" />
          </div>

          <nav className="mt-6 space-y-1 px-4">
            <button className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-blue-600 border-l-4 border-blue-600 bg-blue-50">
              Dashboard
            </button>
          </nav>
        </div>

        <button
          className="w-full text-red-600 px-4 py-2 mb-2 hover:bg-red-50"
          onClick={() => {
            localStorage.removeItem("mentor_token");
            localStorage.removeItem("mentor_user");
            navigate("/mentorlogin");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Toggle Button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <input
            className="w-1/2 border rounded-lg px-4 py-2"
            placeholder="Search intern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-3 bg-white shadow px-4 py-2 rounded-full">
            <div className="leading-tight">
              <p className="text-sm font-medium">Hello, {mentor.name}</p>
              {mentor.email && (
                <p className="text-xs text-gray-500">{mentor.email}</p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {mentor.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Mentor Dashboard
        </h2>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md border rounded-lg">
          <table className="w-full text-sm text-left border-collapse min-w-[600px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Intern Name</th>
                <th className="py-3 px-4 border">Project</th>
                <th className="py-3 px-4 border">Progress</th>
                <th className="py-3 px-4 border">Feedback</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInterns.length ? (
                paginatedInterns.map((intern, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4 border">
                      {startIndex + index + 1}
                    </td>
                    <td className="py-3 px-4 border">
                      {highlightText(intern.InternName)}
                    </td>
                    <td className="py-3 px-4 border">
                      {highlightText(intern.Project)}
                    </td>
                    <td className="py-3 px-4 border">{intern.progress}</td>
                    <td className="py-3 px-4 border">{intern.Feedback}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No interns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center gap-2 py-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:text-gray-400"
            >
              Prev
            </button>

            {visiblePages.map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded ${
                  currentPage === p
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
