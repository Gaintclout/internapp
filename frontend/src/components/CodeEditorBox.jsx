import React from "react";
import { useNavigate } from "react-router-dom";

export default function CodeEditorBox({ onChange, onSubmit }) {
  const navigate = useNavigate(); // ✅ MUST be inside component

  const handleSubmit = async () => {
    try {
      const result = await onSubmit(); // parent handles API call

      if (result?.passed) {
        alert("🎉 Task completed! Redirecting...");
        navigate("/tasks"); // 🔥 redirect after success
      } else {
        alert("Submitted! Check output and retry.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="mt-3">
      <textarea
        rows="10"
        className="w-full border p-3 rounded mt-3 font-mono text-sm"
        placeholder="Write your code here..."
        onChange={(e) => onChange(e.target.value)}
      ></textarea>

      {/* 🔥 Submit Button here */}
      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit Code
      </button>
    </div>
  );
}
