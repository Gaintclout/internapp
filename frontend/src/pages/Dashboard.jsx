import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, User, Users } from "lucide-react";
import Logo from "/src/assets/Logo.png";
import BgImage from "/src/assets/bg-paper.png";

export default function Dashboard() {
  const roles = [
    {
      title: "Student",
      icon: <GraduationCap size={50} className="text-[#2563EB]" />,
      link: "/register",
    },
    {
      title: "Admin",
      icon: <User size={50} className="text-[#00C896]" />,
      link: "/adminlogin",
    },
    {
      title: "Mentor",
      icon: <Users size={50} className="text-[#FBBF24]" />,
      link: "/Mentorlogin",
    },
  ];

  return (
    <div className="relative min-h-[700px] flex flex-col items-center justify-center overflow-hidden shadow-2xl py-10 px-4 sm:px-6 md:px-10 lg:px-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 opacity-80"
        style={{
          backgroundImage: `url(${BgImage})`,
          transform: "rotate(-25deg)",
          transformOrigin: "center",
        }}
      ></div>

      <img
        src={Logo}
        alt="GAINT Logo"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 w-16 sm:w-24 md:w-28 lg:w-32"
      />

      <div className="text-center mt-20 mb-10">
        <h1 className="text-4xl font-semibold text-[#2563EB]">Dashboard</h1>
        <p className="text-gray-400 mt-2">Choose your role to continue</p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 px-6">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="w-60 h-64 bg-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300"
          >
            <div className="bg-gray-50 p-4 rounded-full mb-4">{role.icon}</div>
            <h2 className="text-gray-700 text-xl font-medium mb-6">
              {role.title}
            </h2>

            <Link to={role.link}>
  <button
    type="button"
    className="flex items-center justify-center gap-2 bg-[#2563EB] text-white px-6 py-2 rounded-full shadow-sm hover:bg-[#1E40AF] transition-all"
  >
    <span className="w-3 h-3 border-2 border-white rounded-full"></span>
    <span>Login</span>
  </button>
</Link>

          </div>
        ))}


          {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BgImage})`,
          transform: "rotate(-25deg)",
          transformOrigin: "center",
        }}
      ></div>  */}
      </div>
    </div>
  );
}
