

import React, { useState, useEffect } from "react";
import Logo from "/src/assets/Logo.png";
import { Download } from "lucide-react";
import Background from "/src/assets/bg-paper.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function InternDashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("My Project");
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  

  const routes = {
    "My Project": "/interndashboard",
    Tasks: "/interndashboardtask",
    Certificate: "/interndashboardcertificate",
  };

  /* ================= LOAD USER ================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("user");
    }

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
      } catch (err) {
        console.error("User load failed", err);
      }
    };

    loadUser();
  }, []);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    const loadProject = async () => {
      try {
        const selectedProject = localStorage.getItem("selected_project");
        const preferredLanguage = localStorage.getItem("preferred_language");

        console.log("Selected Project:", selectedProject);
        console.log("Preferred Language:", preferredLanguage);

        /* ---------- LOCAL STORAGE PROJECT ---------- */
        if (selectedProject) {
          setProject({
            title: selectedProject,
            technology:
              preferredLanguage === "nextjs"
                ? "Next.js"
                : preferredLanguage || "Unknown",
          });
          return;
        }

        /* ---------- BACKEND PROJECT ---------- */
        const res = await api.get("/projects/my-project");

        if (res.data && res.data.project) {
          setProject(res.data.project);

          localStorage.setItem(
            "selected_project",
            res.data.project.title
          );

          localStorage.setItem(
            "preferred_language",
            res.data.project.technology
          );
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Project load failed:", err);
        setProject(null);
      }
    };

    loadProject();
  }, []);

  /* ================= DOWNLOAD PDF ================= */
  const handleDownloadPDF = async () => {
    if (!project) {
      alert("No project selected");
      return;
    }

    try {
      const filename = `${project.title}.pdf`;

      const res = await api.get(
        `/projects/materials/download/${encodeURIComponent(filename)}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err.response || err);
      alert("Failed to download PDF");
    }
  };



  const handleDownloadZip = () => {

  if (!project) {
    alert("No project selected");
    return;
  }

  const filename = `${project.title}.zip`;

  const url = `/projects/${encodeURIComponent(filename)}`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();
};

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center bg-cover bg-center relative px-4 bg-gray-50 shadow-2xl"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* LOGO */}
      <img
        src={Logo}
        alt="GAINT Logo"
        className="absolute top-4 left-6 w-28"
      />

      {/* PROFILE */}
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
        {/* SIDEBAR */}
        <main className="relative top-[30px] w-[250px] h-[380px] left-[100px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
          <aside className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700">
              Dashboard
            </h2>

            {Object.keys(routes).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  navigate(routes[item]);
                }}
                className={`w-full px-4 py-2 rounded-full border transition-all ${
                  active === item
                    ? "bg-blue-600 text-white"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item}
              </button>
            ))}
          </aside>
        </main>

        {/* CONTENT */}
        <main className="w-[720px] min-h-[45vh] bg-white border border-blue-900 rounded-2xl p-8 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            {project ? project.title : "No Project Selected"}
          </h3>

          {/* <div className="max-w-2xl text-gray-700 text-justify mb-6">
            {project ? (
              <p>
                This project focuses on{" "}
                <b>{project.title}</b> using{" "}
                <b>{project.technology}</b>.
              </p>
            ) : (
              <p>Please select a project to continue.</p>
            )}
          </div> */}
 <div className="max-w-2xl mx-auto text-gray-700 text-left leading-relaxed mb-6 px-12">
  {project ? (
    <p>
      The <b>{project.title}</b> project has been assigned to you as part of your
      internship. This project is built using <b>{project.technology}</b>.

      You can download the complete project starter package using the button
      below. The ZIP file contains the project structure, starter code,
      required dependencies, and implementation guidelines.

      After downloading the ZIP file, extract it on your system and open the
      project folder in <b>Visual Studio Code</b>. Follow the instructions in
      the documentation and begin working on your assigned tasks.

      Your progress will be tracked through the <b>Tasks</b> section of this
      dashboard. Complete each task step-by-step and submit your work through
      the VS Code extension provided in the internship platform.
    </p>
  ) : (
    <p>Please select a project to continue.</p>
  )}
</div>
          {project && (
        <div className="flex gap-4">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            <Download size={16} /> Download Zip
          </button>
        </div>
      )}
        </main>
      </section>
    </div>
  );
}