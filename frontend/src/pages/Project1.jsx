
import React, { useState, useEffect } from "react";
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfileMenu from "../components/ProfileMenu";

export default function Project1() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // 🔑 NEXT.JS PROJECTS (STATIC – SAFE)
  const NEXTJS_PROJECTS = [
    {
      id: "7b42c53a-7158-44be-b6db-f819ed551be0",
      name: "Spamshield",
      link: "/spamshield",
    },
    {
      id: "ea12fc82-b7a4-4b66-a339-1d729b7f6516",
      name: "Hiresense",
      link: "/hiresense",
    },
    {
      id: "8538de37-bbf0-4cd7-a560-c608b912c664",
      name: "Identi Q",
      link: "/identiq",
    },
  ];

  // ✅ LOAD PROJECTS (NO UI CHANGE)
  useEffect(() => {
    setProjects(NEXTJS_PROJECTS);
  }, []);

  // ✅ SELECT PROJECT (FIXED & CONSISTENT)
  const handleSelectAndNavigate = async (e, project) => {
    e.preventDefault();

    try {
      // 🔑 SAVE SELECTION LOCALLY (THIS FIXES YOUR BUG)
      localStorage.setItem("selected_project", project.name);
      localStorage.setItem("selected_project_id", project.id);
      localStorage.setItem("preferred_language", "nextjs");

      // 🔑 INFORM BACKEND (KEEP EXISTING LOGIC)
      await api.post(`/projects/select?project_id=${project.id}`);

      console.log("✅ Project selected:", project.name);

      // 🔑 NAVIGATE
      navigate(project.link);
    } catch (err) {
      console.error("❌ Select project failed", err);
      alert("Project selection failed");
    }
  };

  return (
  <div
  className="h-[70vh] flex flex-col items-center justify-center bg-gray-50
             relative px-4 bg-cover bg-center bg-no-repeat
             shadow-[0_0_30px_rgba(0,0,0,0.20)] rounded-xl"
  style={{
    backgroundImage: `url(${BgImage})`,
  }}
>

      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
        <img src={Logo} alt="GAINT Logo" className="w-32" />
        <ProfileMenu />
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-[#2563eb] mb-10 text-center mt-20">
        Next.js Projects
      </h1>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative border border-blue-400 rounded-3xl flex items-center justify-between overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all"
          >
            <span className="pl-6 py-3 text-gray-700 font-medium text-xl">
              {project.name}
            </span>

            <Link
              to={project.link}
              onClick={(e) => handleSelectAndNavigate(e, project)}
              className="absolute right-0 top-0 h-full px-8 bg-blue-600 text-white
                         font-medium flex items-center justify-center
                         hover:bg-blue-700 transition-all rounded-l-3xl"
            >
              Choose
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
