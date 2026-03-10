import React, { useState, useEffect } from "react";
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import api from "../api/axios";
import ProfileMenu from "../components/ProfileMenu";


export default function BoxExample() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

 
  

const PROJECT_ROUTE_MAP = {
  // 🎬 Recommendation Systems
  "Movie Recommendation System": "/movie",
  "Movie Recommendation": "/movie",

  // 🔐 Security / Access Control
  "Media Access Control": "/media",
  "MAC": "/media",
  "MAC Assistant": "/media",

  // 🤖 Chatbots & LLMs
  "Chatbot Using FastAPI": "/chatbotf",
  "FastAPI Chatbot": "/chatbotf",
  "GPT3.5 (FastAPI)": "/chatbotf",
  "GPT-3 FastAPI": "/chatbotf",

  "Chatbot Using Flask": "/chatbotflask",
  "Flask Chatbot": "/chatbotflask",
  "GPT3.5 (Flask)": "/chatbotflask",
  "GPT-3 Flask": "/chatbotflask",

  // 📰 NLP / ML
  "Fake News Detector": "/fakenews",
  "Fake News Detection": "/fakenews",

  // 🧠 AI Assistants / Systems
  "Cogniflow": "/cogniflow",
};

  
  // ⭐ Backend API Call
const getProjectSuggestions = async () => {
  try {
    const response = await api.get("/projects/suggestions");

    const normalizedProjects = response.data.map((p) => {
      const name = p.name || p.project_name || p.title;

      return {
        id: p.id || p.project_id,
        name: name,
        link: PROJECT_ROUTE_MAP[name] , // 🔑 FIX HERE
      };
    });

    setProjects(normalizedProjects);
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
  }
};
  const handleChoose = (project) => {
    // ✅ STORE PROJECT LOCALLY
    localStorage.setItem(
      "selected_project",
      JSON.stringify(project)
    );

    // ✅ NAVIGATE
    navigate(project.route);
  };


  /* --------------------------------
     SELECT PROJECT
  -------------------------------- */

  const handleSelectAndNavigate = async (e, project) => {
    e.preventDefault(); // 🔑 stop Link auto navigation

    try {
      await api.post(
        `/projects/select?project_id=${project.id}`
      );

      console.log("✅ Project selected:", project.id);

      navigate(project.link); // navigate only after success
    } catch (err) {
      console.error("❌ Select project failed", err);
      alert("Project selection failed");
    }
  };

  useEffect(() => {
    getProjectSuggestions();
  }, []);

  return (
 <div
  className="h-[70vh] flex flex-col items-center justify-center bg-gray-50
             relative px-4 bg-cover bg-center bg-no-repeat
             shadow-[0_0_25px_rgba(0,0,0,0.25)] rounded-xl"
  style={{
    backgroundImage: `url(${BgImage})`,
  }}
>

     <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
   
             {/* Logo (left) */}
             <img
               src={Logo}
               alt="GAINT Logo"
               className="w-32"
             />
   
             {/* Profile Menu (right) */}
             <ProfileMenu />
           </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold text-[#2563eb] mb-10 text-center mt-20">
        Python Projects
      </h1>

      {/* Project List */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative border border-blue-400 rounded-3xl flex items-center justify-between overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all"
          >
            {/* ✅ Correct: project.name */}
            <span className="pl-6 py-3 text-gray-700 font-medium text-xl">
              {project.name}
            </span>

            {/* ✅ Correct: project.link */}
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
