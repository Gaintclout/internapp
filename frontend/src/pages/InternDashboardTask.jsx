
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/Logo.png";
import Background from "/src/assets/bg-paper.png";
import api from "../api/axios";

import Fasttrack from "./Fastrack";
import FortyFiveDays from "./FortyFiveDays";
import FourMonths from "./FourMonths";

export default function InternDashboardTasks() {
  const [active, setActive] = useState("Tasks");
  const [internshipType, setInternshipType] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  /* ===============================
     READ INTERNSHIP TYPE
  =============================== */
  useEffect(() => {
    const type = localStorage.getItem("selected_internship");
    setInternshipType(type);
  }, []);

  /* ===============================
     LOAD USER
  =============================== */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const apiUser = res.data;
        const localUser = JSON.parse(localStorage.getItem("user")) || {};

        const mergedUser = {
          ...apiUser,
          photo: localUser.photo || null,
          bio: localUser.bio || "",
        };

        localStorage.setItem("user", JSON.stringify(mergedUser));
        setUser(mergedUser);
      } catch {
        console.error("User load failed");
      }
    };
    loadUser();
  }, []);

  /* ===============================
     NAVIGATION
  =============================== */
  const handleNavigation = (item) => {
    setActive(item);
    if (item === "My Project") navigate("/interndashboard");
    if (item === "Tasks") navigate("/interndashboardtasks");
    if (item === "Certificate") navigate("/interndashboardcertificate");
    // if (item === "Logout") navigate("/internlogout");
  };

  /* ===============================
     UI (UNCHANGED)
  =============================== */
  return (
    <div
      className="min-h-[70vh] flex items-center justify-center bg-cover bg-center relative px-4 bg-gray-50 shadow-2xl"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Logo */}
      <img src={Logo} alt="GAINT Logo" className="absolute top-4 left-6 w-28" />

      {/* USER PROFILE */}
      <div
        onClick={() => navigate("/Setting")}
        className="absolute top-4 right-6 flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:opacity-80"
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

         <section className="relative right-[80px] flex gap-8 py-10">       
            {/* LEFT MENU */}
                  <main className="relative top-[30px] w-[230px] h-[380px] left-[100px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                        Dashboard
                      </h2>
                  
                    {["My Project", "Tasks", "Certificate"].map((item) => (
                      <button
                        key={item}
                        onClick={() => handleNavigation(item)}
                        className={`w-full mb-2 px-4 py-2 rounded-full ${
                          active === item
                            ? "  bg-blue-600 text-white"
                            : "border border-blue-200 text-blue-600"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </main>

                  {/* RIGHT CONTENT (SWITCH ONLY) */}
                      <main
                    className={`w-[740px] bg-white border border-blue-900 rounded-2xl p-6 ${
                      internshipType === "semester4m"
                        ? "min-h-[50vh] max-h-[70vh] overflow-y-auto"
                        : "h-[50vh]"
                    }`}
                  >


                    {internshipType === "fasttrack" && <Fasttrack hideHeader />}

                  {internshipType === "days45" && (
                    <div className="flex justify-end">
                      <div className="w-full md:w-[85%]">
                        <FortyFiveDays hideHeader />
                      </div>
                    </div>
                  )}

                    {internshipType === "semester4m" && (
                      <div className="h-full pt-16 overflow-y-auto px-2">
                        <FourMonths hideHeader />
                      </div>
                    )}

                    {!internshipType && (
                      <div className="text-center text-gray-500">
                        Internship not selected. Please login again.
                      </div>
                    )}

                  </main>
                </section>
              </div>
            );

          }





















































