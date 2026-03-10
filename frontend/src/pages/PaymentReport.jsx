// import React, { useEffect, useState } from "react";
// import Logo from "/src/assets/logo.png";
// import {
//   Home,
//   Users,
//   BarChart2,
//   CreditCard,
//   FileText,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import apiAdmin from "../api/apiAdmin";
// import AdminProfileMenu from "../components/AdminProfileMenu";

// export default function AdminDashboardPayment() {
//   const navigate = useNavigate();
//   const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

//   const [payments, setPayments] = useState([]);
//   const [search, setSearch] = useState("");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   /* ================= DATA ================= */
//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const res = await apiAdmin.get("/admin/payments");
//         setPayments(res.data);
//       } catch (err) {
//         console.error("Failed to load payments", err);
//       }
//     };
//     fetchPayments();
//   }, []);

//   /* ================= LOCK SCROLL ================= */
//   useEffect(() => {
//     if (mobileMenuOpen) {
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//       document.documentElement.style.overflow = "auto";
//     }
//   }, [mobileMenuOpen]);

//   /* ================= FILTER + SORT (UNCHANGED) ================= */
//   const filteredPayments = payments
//     .filter((p) =>
//       `${p.student_name} ${p.status}`
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     )
//     .sort((a, b) => a.student_name.localeCompare(b.student_name));

//   /* ================= HIGHLIGHT (UNCHANGED) ================= */
//   const highlightText = (text) => {
//     if (!search) return text;
//     const regex = new RegExp(`(${search})`, "ig");
//     return text.split(regex).map((part, i) =>
//       part.toLowerCase() === search.toLowerCase() ? (
//         <span key={i} className="text-blue-600 font-semibold">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   return (
//     <div className="h-[70vh] bg-[#f7f9fc] text-gray-800 flex flex-col md:flex-row">

//       {/* ================= MOBILE HEADER ================= */}
//       <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b z-40">
//         <img src={Logo} alt="GAINT" className="h-8" />
//         <button onClick={() => setMobileMenuOpen(true)}>
//           <Menu size={24} />
//         </button>
//       </div>

//       {/* ================= MOBILE SIDEBAR ================= */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 z-50 md:hidden flex">
//           <div
//             className="flex-1 bg-black/40"
//             onClick={() => setMobileMenuOpen(false)}
//           />
//           <aside className="w-64 bg-white h-full shadow-xl flex flex-col">
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <img src={Logo} alt="GAINT" className="h-8" />
//               <button onClick={() => setMobileMenuOpen(false)}>
//                 <X size={22} />
//               </button>
//             </div>

//             <nav className="px-2 py-4 text-sm flex flex-col gap-1">
//               <NavBtn icon={<Home size={18} />} label="Dashboard" onClick={() => navigate("/admindashboard")} />
//               <NavBtn icon={<Users size={18} />} label="User" onClick={() => navigate("/admindashboarduser")} />
//               <NavBtn icon={<BarChart2 size={18} />} label="Project Management" onClick={() => navigate("/projectManagement")} />
//               <NavBtn icon={<CreditCard size={18} />} label="Payment" active />

//               <NavBtn icon={<FileText size={18} />} label="Mentors" onClick={() => navigate("/mentor")} />

//               <button
//                 onClick={() => {
//                   localStorage.clear();
//                   navigate("/adminlogin");
//                 }}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full text-left mt-4"
//               >
//                 <LogOut size={18} /> Logout
//               </button>
//             </nav>
//           </aside>
//         </div>
//       )}

//       {/* ================= DESKTOP SIDEBAR ================= */}
//       <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-100 bg-white">
//         <div className="flex items-center gap-3 px-6 py-6">
//           <img src={Logo} alt="GAINT" className="h-9" />
//         </div>

//         <nav className="px-2 py-4 text-sm flex flex-col gap-1">
//           <NavBtn icon={<Home size={18} />} label="Dashboard" onClick={() => navigate("/admindashboard")} />
//           <NavBtn icon={<Users size={18} />} label="User" onClick={() => navigate("/admindashboarduser")} />
//           <NavBtn icon={<BarChart2 size={18} />} label="Project Management" onClick={() => navigate("/projectManagement")} />
//           <NavBtn icon={<CreditCard size={18} />} label="Payment" active />
//           <NavBtn icon={<FileText size={18} />} label="Mentors" onClick={() => navigate("/mentor")} />
//           <div className="flex-1" />
//           <NavBtn icon={<LogOut size={18} />} label="Logout" danger />
//         </nav>

//         <div className="px-6 py-6 text-[10px] text-gray-400">
//           Gaint Interns Admin Dashboard
//           <br />© 2025 All Rights Reserved
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main
//         className={`flex-1 w-full relative z-10 ${
//           mobileMenuOpen ? "overflow-hidden" : "overflow-auto"
//         }`}
//       >
//         {/* TOP BAR */}
//         <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
//           <div className="w-full sm:max-w-3xl relative">
//             <input
//               className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none"
//               placeholder="Search here"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
//           </div>

//           {!mobileMenuOpen && (
//             <div className="flex justify-end">
//               <AdminProfileMenu />
//             </div>
//           )}
//         </div>

//         {/* TITLE */}
//         <div className="px-4 md:px-6">
//           <h2 className="text-2xl md:text-3xl font-bold">Payment & Reports</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Hi, {admin?.name || "Admin"}
//           </p>
//         </div>

//         {/* TABLE */}
//         <div className="px-4 md:px-6 mt-6 pb-10">
//           <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm">
//             <table className="min-w-[900px] w-full text-sm">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Intern Name</th>
//                   <th className="px-4 py-3 text-left">Amount</th>
//                   <th className="px-4 py-3 text-left">Date</th>
//                   <th className="px-4 py-3 text-left">Status</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {filteredPayments.map((p, i) => (
//                   <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
//                     <td className="px-4 py-3">
//                       {highlightText(p.student_name)}
//                     </td>
//                     <td className="px-4 py-3">₹{p.amount}</td>
//                     <td className="px-4 py-3">
//                       {new Date(p.date).toLocaleDateString()}
//                     </td>
//                     <td
//                       className={`px-4 py-3 font-medium ${
//                         p.status === "success"
//                           ? "text-green-600"
//                           : p.status === "pending"
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {highlightText(p.status)}
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredPayments.length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-6 text-center text-gray-400">
//                       No payment records found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= HELPER ================= */
// const NavBtn = ({ icon, label, active, danger, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
//       ${active ? "bg-blue-50 text-blue-600 font-medium" : ""}
//       ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50"}
//     `}
//   >
//     {icon} {label}
//   </button>
// );





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

export default function AdminDashboardPayment() {

  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* PAGINATION STATES */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /* FETCH PAYMENTS */

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await apiAdmin.get("/admin/payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to load payments", err);
      }
    };

    fetchPayments();
  }, []);

  /* LOCK SCROLL */

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  /* FILTER */

  const filteredPayments = payments
    .filter((p) =>
      `${p.student_name} ${p.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => a.student_name.localeCompare(b.student_name));

  /* PAGINATION LOGIC */

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredPayments.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  /* SEARCH HIGHLIGHT */

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

              <NavBtn icon={<CreditCard size={18} />} label="Payment" active />

              <NavBtn icon={<FileText size={18} />} label="Mentors"
                onClick={() => navigate("/mentor")}
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

          <NavBtn icon={<CreditCard size={18} />} label="Payment" active />

          <NavBtn icon={<FileText size={18} />} label="Mentors"
            onClick={() => navigate("/mentor")}
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

      {/* MAIN CONTENT */}

      <main className="flex-1 p-4 md:p-6 relative z-10">

        {/* SEARCH */}
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

        <h2 className="text-2xl md:text-3xl font-bold">
          Payment & Reports
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Hi, {admin?.name || "Admin"}
        </p>

        {/* TABLE */}

        <div className="w-full overflow-x-auto bg-white border rounded-2xl shadow-sm">

          <table className="min-w-[600px] w-full text-sm">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Intern Name</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {currentRows.map((p, index) => (

                <tr key={index} className={index % 2 ? "bg-gray-50" : ""}>

                  <td className="px-4 py-3">
                    {indexOfFirstRow + index + 1}
                  </td>

                  <td className="px-4 py-3">
                    {highlightText(p.student_name)}
                  </td>

                  <td className="px-4 py-3">
                    ₹{p.amount}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(p.date).toLocaleDateString()}
                  </td>

                  <td
                    className={`px-4 py-3 font-medium ${
                      p.status === "success"
                        ? "text-green-600"
                        : p.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex justify-center items-center gap-2 mt-6">

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>

          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </main>

    </div>
  );
}

/* NAV BUTTON */

const NavBtn = ({ icon, label, active, danger, onClick }) => (

  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left
      ${active ? "bg-blue-50 text-blue-600 font-medium" : ""}
      ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50"}
    `}
  >
    {icon} {label}
  </button>

);