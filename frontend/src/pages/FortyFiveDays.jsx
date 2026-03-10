


import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/Logo.png";
import ProfileMenu from "../components/ProfileMenu";

export default function FortyFiveDays({ hideHeader = false }) {
  const tasks = ["Task 1", "Task 2", "Task 3"];

  const [currentTaskSeq, setCurrentTaskSeq] = useState(1);
  const [lastSimilarity, setLastSimilarity] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("student_token");

  /* ===============================
     🔄 BACKEND = SOURCE OF TRUTH
     (KEY MISMATCH FIX INCLUDED)
  =============================== */
  const syncUnlockState = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.get("/vscode/context", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔥 MAIN FIX: backend may send task_seq OR current_task_seq
      const seq =
        res.data?.current_task_seq ??
        res.data?.task_seq;

      console.log("🔄 task sequence from backend:", seq);

      if (typeof seq === "number") {
        setCurrentTaskSeq(seq);
      }

      if (typeof res.data?.last_similarity === "number") {
        setLastSimilarity(res.data.last_similarity);
      }
    } catch (err) {
      console.error("Context sync failed", err);
    }
  };

  /* ===============================
     INITIAL LOAD + POLLING
  =============================== */
  useEffect(() => {
    syncUnlockState();
    const interval = setInterval(syncUnlockState, 2000);
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     VS CODE → BROWSER FOCUS SYNC
  =============================== */
  useEffect(() => {
    const onFocus = () => syncUnlockState();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  /* ===============================
     OPEN VS CODE
  =============================== */
  const openVSCode = async (index) => {
    if (index + 1 > currentTaskSeq) return;

    const token = getToken();
    if (!token) {
      alert("Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href =
  `vscode://gaintclout.internapp-vscode/auth?auth_code=${res.data.auth_code}` +
  `&task_seq=${index + 1}`;
    } catch {
      alert("Unable to open VS Code");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-[calc(70vh-80px)]">
      {!hideHeader && (
        <header className="flex items-center justify-between px-14 py-4">
          <img src={Logo} alt="GAINT" className="h-10" />
          <ProfileMenu />
        </header>
      )}

      <main className="p-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          45 Days Challenge Tasks
        </h1>

        <div className="space-y-4">
          {tasks.map((task, index) => {
            const isUnlocked = index + 1 <= currentTaskSeq;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl shadow
                  ${isUnlocked ? "bg-white" : "bg-gray-50 opacity-60"}
                `}
              >
                <span
                  className={`text-lg ${
                    isUnlocked ? "text-black" : "text-gray-400"
                  }`}
                >
                  {task}
                </span>

                <button
                  disabled={!isUnlocked || loading}
                  onClick={() => openVSCode(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium
                    ${
                      isUnlocked
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-200 text-white cursor-not-allowed"
                    }`}
                >
                  {loading ? "Opening..." : "Open in VS Code"}
                </button>
              </div>
            );
          })}
        </div>

        {lastSimilarity !== null && (
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 rounded-lg bg-green-50 text-green-700">
              🔍 Similarity Score: {(lastSimilarity * 100).toFixed(2)}%
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            disabled={currentTaskSeq < tasks.length}
            onClick={() => navigate("/certificate")}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
          >
            Finish
          </button>
        </div>
      </main>
    </div>
  );
}
