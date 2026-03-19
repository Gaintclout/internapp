import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import {
  Home,
  Users,
  BarChart2,
  CreditCard,
  FileText,
  LogOut,
} from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminUser() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 ADMIN AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // 📦 FETCH USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res?.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 FILTER SEARCH
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.college}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex relative">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${BgImage})` }}
      />

      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r p-4 z-10">
        <img src={logo} className="w-28 mb-6" />

        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Home size={18} /> Dashboard
        </button>

        <button className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded">
          <Users size={18} /> Users
        </button>

        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <BarChart2 size={18} /> Projects
        </button>

        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <CreditCard size={18} /> Payments
        </button>

        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <FileText size={18} /> Mentors
        </button>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-500 p-2 hover:bg-red-50 rounded"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 z-10 p-6">

        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full max-w-md"
          />

          <p className="ml-4">
            Admin Panel
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">College</th>
                <th className="p-3 text-left">Internship</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id || i} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.college}</td>
                    <td className="p-3">{u.internship_type}</td>
                    <td className="p-3">{u.progress || 0}%</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}