import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      navigate("/studentlogin");
    }
  }, [navigate]);

  // 📦 FETCH TASK
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        navigate("/tasks");
        return;
      }

      try {
        const res = await api.get(`/tasks/details/${id}`);
        setTask(res?.data || null);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load task");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading task...
      </div>
    );
  }

  // ❌ NO TASK
  if (!task) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Task not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">
        {task?.title || "Untitled Task"}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-700 leading-relaxed">
        {task?.description || "No description available."}
      </p>

      {/* EXAMPLE CODE */}
      {task?.example_code && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-800">
            Example Code:
          </h3>

          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {task.example_code}
          </pre>
        </div>
      )}

    </div>
  );
}