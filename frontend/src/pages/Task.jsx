import React, { useState } from "react";
import Logo from "/src/assets/logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TaskExecution() {
  const navigate = useNavigate();
  const location = useLocation();

  // Task ID comes from navigation state
  const taskId = location.state?.taskId;

  const [code, setCode] = useState(`print('Hello World!')`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 RUN BUTTON (Judge0 run-only API)
  const handleRun = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8000/submissions/run",
        {
          task_id: taskId,
          code: code,
          stdin: ""
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOutput(res.data.stdout || "No output");
    } catch (e) {
      setOutput("Error running code");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBMIT BUTTON (REAL Task Evaluation)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("task_id", taskId);
      formData.append("code", code);

      const res = await axios.post(
        "http://localhost:8000/submissions",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Backend response contains — passed: true/false
      if (res.data.passed) {
        alert("🎉 Task Completed! Next task unlocked.");
        navigate("/tasks"); // Go back to Tasks List
      } else {
        alert("❌ Test cases failed. Try again.");
        setOutput(JSON.stringify(res.data, null, 2));
      }
    } catch (err) {
      alert("Submission failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[700px] flex flex-col items-center justify-center bg-gray-50 shadow-2xl relative px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Logo */}
      <img
        src={Logo}
        alt="GAINT Logo"
        className="absolute top-6 left-6 w-28 md:w-32"
      />

      {/* Header */}
      <div className="absolute top-10 right-10 text-right">
        <h2 className="text-2xl font-semibold text-[#2563eb]">Task Execution</h2>
      </div>

      {/* Main */}
      <div className="flex flex-col gap-10 mt-28 w-full max-w-3xl">
        
        {/* Code Editor */}
        <div className="bg-black text-gray-200 rounded-2xl shadow-md overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black text-gray-200 p-5 text-sm md:text-base font-mono leading-6 whitespace-pre-wrap outline-none resize-none"
            rows="7"
          />
        </div>

        {/* Run Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRun}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 transition-all"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="bg-gray-900 text-green-400 rounded-xl p-5 font-mono text-sm shadow-md whitespace-pre-line">
            {output}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-2 rounded-full hover:bg-green-700 transition-all"
          >
            {loading ? "Submitting..." : "Submit Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
