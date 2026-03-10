
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ ADD THIS

export default function ProfileMenu({ style }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 LOAD USER (LOCAL + API SYNC)
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1️⃣ Try localStorage first (fast UI)
        const stored = localStorage.getItem("user");
        if (stored && stored !== "undefined") {
          setUser(JSON.parse(stored));
        }

        // 2️⃣ Always sync from backend
        const res = await api.get("/auth/me");

        // 3️⃣ Save globally
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      } catch (err) {
        console.error("ProfileMenu user load failed", err);
      }
    };

    loadUser();
  }, []);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || "User";





  // 🔥 LISTEN FOR PROFILE UPDATES (IMPORTANT)
useEffect(() => {
  const handleProfileUpdated = () => {
    const updatedUser = localStorage.getItem("user");
    if (updatedUser && updatedUser !== "undefined") {
      setUser(JSON.parse(updatedUser));
    }
  };

  window.addEventListener("profile-updated", handleProfileUpdated);

  return () => {
    window.removeEventListener("profile-updated", handleProfileUpdated);
  };
}, []);

const handleLogout = () => {
  // 🔥 Save current page before logout
  localStorage.setItem("last_page", window.location.pathname);

  // 🔐 Clear auth
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("student_token");

  // 🚀 Go to login
  navigate("/studentlogin");
};

  return (
    <div ref={menuRef} style={style} className="relative z-[9999]">
      {/* PROFILE BUTTON */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow cursor-pointer select-none"
      >
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Welcome {displayName}
        </span>

      {user?.photo ? (
          <img
            src={user.photo}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="text-xs text-gray-500">▾</span>
      </div>
      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
