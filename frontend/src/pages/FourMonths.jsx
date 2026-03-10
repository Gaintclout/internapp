
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/Logo.png";
import ProfileMenu from "../components/ProfileMenu";

export default function FourMonths({ hideHeader = false }) {

  const navigate = useNavigate();

  const tasks = [
    "Task 1",
    "Task 2",
    "Task 3",
    "Task 4",
    "Task 5",
    "Task 6",
    "Task 7",
    "Task 8",
  ];

  const [unlockedCount, setUnlockedCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("student_token");

  /* =================================================
     BACKEND CONTEXT
  ================================================= */
  const syncUnlockState = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.get("/vscode/context", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const seq =
        res.data?.current_task_seq ??
        res.data?.task_seq;

      if (typeof seq === "number") {
        setUnlockedCount(seq);
        setCurrentIndex(seq - 1);
      }

    } catch (err) {
      console.error("Context sync failed");
    }
  };

  /* =================================================
     INITIAL LOAD + POLLING
  ================================================= */
  useEffect(() => {
    syncUnlockState();
    const interval = setInterval(syncUnlockState, 5000);
    return () => clearInterval(interval);
  }, []);

  /* =================================================
     OPEN VS CODE
  ================================================= */
  const openVSCode = async (index) => {

    if (index + 1 > unlockedCount) return;

    const token = getToken();

    if (!token) {
      alert("Please login again.");
      navigate("/studentlogin");
      return;
    }

    try {

      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const vscodeURL =
        `vscode://gaintclout.internapp-vscode/auth` +
        `?auth_code=${res.data.auth_code}` +
        `&task_seq=${index + 1}`;

      window.location.href = vscodeURL;

    } catch {
      alert("Task not unlocked yet.");
    }
  };

  /* =================================================
     NEXT / FINISH LOGIC
  ================================================= */
  const goNext = () => {
    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("🎉 Congratulations! All 4 Months tasks completed.");
      navigate("/certificate");
    }
  };

  /* =================================================
     UI
  ================================================= */
  return (
<div className="h-[10vh]">

{!hideHeader && (
  <header className="flex items-center justify-between px-14 py-1">
    <img src={Logo} alt="GAINT" className="h-10" />
    <ProfileMenu />
  </header>
)}

<main className="pt-0 px-10 pb-3 max-w-2xl mx-auto">

<h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
4 Months Challenge Tasks
</h1>

<div className="space-y-4">

{tasks.map((task, index) => {

const isUnlocked = index + 1 <= unlockedCount;
const isCurrent = index === currentIndex;

return (

<div
key={index}
className={`flex items-center justify-between p-4 rounded-xl shadow
${
isCurrent
? "bg-blue-50 border border-blue-600"
: isUnlocked
? "bg-white"
: "bg-gray-50 opacity-60"
}`}
>

<span
className={`text-lg ${
isUnlocked
? "font-medium text-black"
: "text-gray-400"
}`}
>
{task}
</span>

<button
disabled={!isUnlocked}
onClick={() => openVSCode(index)}
className={`px-4 py-2 rounded-lg text-sm font-medium
${
isUnlocked
? "bg-blue-600 text-white hover:bg-blue-700"
: "bg-blue-200 text-white cursor-not-allowed"
}`}
>
Open in VS Code
</button>

</div>

);
})}

</div>

<div className="mt-6 flex justify-end">
<button
onClick={goNext}
disabled={unlockedCount !== tasks.length}
className={`px-5 py-2 rounded-lg font-medium
${
unlockedCount === tasks.length
? "bg-blue-600 text-white hover:bg-blue-700"
: "bg-blue-200 text-white cursor-not-allowed"
}`}
>
{unlockedCount === tasks.length ? "Finish" : "Next"}
</button>
</div>

</main>
</div>
);
}