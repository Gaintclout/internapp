import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProfileMenu({ style }) {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ LOAD ADMIN ONLY FROM LOCAL STORAGE
  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored && stored !== "undefined") {
      setAdmin(JSON.parse(stored));
    }
  }, []);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = admin?.name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    navigate("/adminlogin");
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

        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>

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
