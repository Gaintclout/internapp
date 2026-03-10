import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Logo from "/src/assets/Logo.png";
import ProfileMenu from "../components/ProfileMenu";

export default function Fasttrack({ hideHeader = false }) {

  const navigate = useNavigate();

  const [launching, setLaunching] = useState(false);
  const [taskPassed, setTaskPassed] = useState(false);

  /* --------------------------------
     OPEN VS CODE
  -------------------------------- */
  const openVSCode = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {

      setLaunching(true);

      /* STEP 1 — Get task context */
      const ctx = await api.get("/vscode/context", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const taskId = ctx.data.task_id;

      /* STEP 2 — Generate auth code */
      const authRes = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authCode = authRes.data.auth_code;

      /* STEP 3 — Open VS Code */
      const vscodeURL =
        `vscode://gaintclout.internapp-vscode/auth?` +
        `auth_code=${authCode}&task_id=${taskId}`;

      const link = document.createElement("a");
      link.href = vscodeURL;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        setTaskPassed(true);
      }, 3000);

    } catch (err) {

      console.error("Open VS Code error:", err);
      alert("Failed to open VS Code.");

    } finally {

      setLaunching(false);

    }
  };

  return (
<div className="min-h-[calc(70vh-80px)]">

      {/* HEADER */}
      {!hideHeader && (
        <header className="flex items-center justify-between px-14 py-4 bg-white">
          <img src={Logo} alt="GAINT" className="h-10" />
          <ProfileMenu />
        </header>
      )}

      {/* CONTENT */}
      <div className="p-10 max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          Fasttrack
        </h1>

        <div className="border p-6 rounded-xl shadow bg-white">

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Task 1</span>

            <button
              onClick={openVSCode}
              disabled={launching}
              className={`px-4 py-2 rounded-lg text-white
                ${
                  launching
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {launching ? "Launching..." : "Open with VS Code"}
            </button>

          </div>

          {/* NEXT BUTTON */}
          <div className="flex justify-end mt-8">

            <button
              disabled={!taskPassed}
              onClick={() => navigate("/certificate")}
              className={`px-6 py-2 rounded-lg
                ${
                  taskPassed
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}