import React, { useState, useEffect } from "react";
import Logo from "/src/assets/logo.png";
import { MessageCircle } from "lucide-react";
import Background from "/src/assets/bg-paper.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TCDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("intern Logout");
  const [user, setUser] = useState(null);

  const routes = {
    "My Project": "/interndashboard",
    Tasks: "/interndashboardtask",
    Certificate: "/interndashboardcertificate",
    Logout: "/internlogout",
  };

  /* 🔹 LOAD USER (FROM BACKEND - DYNAMIC) */
useEffect(() => {
  try {
    // 1️⃣ Load API user (name, email)
    const loadUser = async () => {
      const res = await api.get("/auth/me");
      const apiUser = res.data;

      // 2️⃣ Load local profile (photo, bio)
      const localUser = JSON.parse(localStorage.getItem("user")) || {};

      // 3️⃣ MERGE BOTH
      const mergedUser = {
        ...apiUser,
        photo: localUser.photo || null,
        bio: localUser.bio || "",
      };

      // 4️⃣ Save merged user globally
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
    };

    loadUser();
  } catch (err) {
    console.error("User load failed", err);
  }
}, []);


  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center bg-cover bg-center relative px-4 sm:px-6 md:px-8 bg-gray-50 shadow-2xl"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Logo */}
      <img
        src={Logo}
        alt="GAINT Logo"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 w-14 sm:w-20 md:w-28 lg:w-32"
      />

      {/* 🔥 USER HEADER (CLICKABLE → SETTINGS) */}
      <div
        onClick={() => navigate("/Setting")}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:opacity-80"
      >
        <div className="text-right leading-tight">
          <div className="font-medium text-gray-800">
            {user?.name}
          </div>
          <div className="text-xs text-gray-500">
            {user?.email}
          </div>
        </div>

        {user?.photo ? (
          <img
            src={user.photo}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

      </div>

      <section className="relative right-[70px] flex justify-center items-start gap-10 py-10">
        {/* Left Box */}
        <main className="relative top-[30px] w-[250px] h-[400px] left-[100px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
          <aside className="w-[200px] flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Dashboard
            </h2>

            {["My Project", "Tasks", "Certificate", "Logout"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  navigate(routes[item]);
                }}
                className={`w-full px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                  active === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item}
              </button>
            ))}
          </aside>
        </main>

        {/* Right Box */}
        <main className="w-[700px] min-h-[50vh] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
      
        </main>
      </section>
    </div>
  );
}
