import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import BgImage from "../assets/bg-paper.png";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function TaskExecution() {
  const navigate = useNavigate();
  const location = useLocation();

  const taskId = location.state?.taskId;

  const [code, setCode] = useState("print('Hello World!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 AUTH + TASK CHECK
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      navigate("/studentlogin");
      return;
    }

    if (!taskId) {
      alert("Invalid task access");
      navigate("/tasks");
    }
  }, [taskId, navigate]);

  // ▶ RUN CODE
  const handleRun = async () => {
    if (!code.trim()) {
      alert("⚠️ Write some code first");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/submissions/run", {
        task_id: taskId,
        code: code,
        stdin: "",
      });

      setOutput(
        res?.data?.stdout ||
        res?.data?.stderr ||
        "No output"
      );

    } catch (e) {
      console.error(e);
      setOutput("❌ Error running code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUBMIT CODE
  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("⚠️ Write some code before submitting");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("task_id", taskId);
      formData.append("code", code);

      const res = await api.post("/submissions", formData);

      if (res?.data?.passed) {
        alert("🎉 Task Completed!");
        navigate("/tasks");
      } else {
        alert("❌ Test cases failed");
        setOutput(JSON.stringify(res.data, null, 2));
      }

    } catch (err) {
      console.error(err);
      alert("❌ Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >

      {/* LOGO */}
      <img
        src={logo}
        alt="logo"
        className="absolute top-6 left-6 w-28 md:w-32"
      />

      {/* HEADER */}
      <div className="absolute top-6 right-6">
        <h2 className="text-2xl font-semibold text-blue-600">
          Task Execution
        </h2>
      </div>

      {/* MAIN */}
      <div className="flex flex-col gap-8 mt-24 w-full max-w-3xl">

        {/* CODE EDITOR */}
        <div className="bg-black text-gray-200 rounded-xl overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black text-gray-200 p-5 font-mono text-sm outline-none resize-none"
            rows="8"
          />
        </div>

        {/* RUN */}
        <div className="flex justify-end">
          <button
            onClick={handleRun}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* OUTPUT */}
        {output && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {output}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Code"}
          </button>
        </div>

      </div>
    </div>
  );
}