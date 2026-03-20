import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SubmissionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      navigate("/studentlogin");
    }
  }, [navigate]);

  // 📦 LOAD DATA
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/tasks/submissions");

        setHistory(res?.data?.submissions || []);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading submission history...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Submission History
      </h1>

      {history.length === 0 ? (
        <p className="text-gray-500">
          No submissions found.
        </p>
      ) : (
        history.map((sub) => (
          <div
            key={sub.id}
            className="border p-4 rounded mb-4 bg-gray-50 shadow-sm"
          >
            <p className="font-semibold text-lg">
              {sub.task_title}
            </p>

            {/* STATUS */}
            <p
              className={`font-medium ${
                sub.status === "passed"
                  ? "text-green-600"
                  : sub.status === "failed"
                  ? "text-red-500"
                  : "text-yellow-600"
              }`}
            >
              Status: {sub.status}
            </p>

            {/* DATE */}
            <p className="text-gray-600 text-sm">
              Submitted At:{" "}
              {new Date(sub.created_at).toLocaleString()}
            </p>

            {/* CODE */}
            <pre className="bg-black text-green-400 p-3 mt-3 rounded overflow-x-auto text-sm">
              {sub.source_code}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}