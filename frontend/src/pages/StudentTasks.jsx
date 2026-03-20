import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import { useNavigate } from "react-router-dom";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
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

  // LOAD TASKS
  const loadTasks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/tasks/my-tasks");

      setTasks(res?.data?.tasks || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // RUN CODE
  const runCode = async (taskId, code) => {
    if (!code || code.trim().length === 0) {
      alert("⚠️ Please write code before running");
      return;
    }

    try {
      const res = await api.post(`/tasks/run/${taskId}`, {
        source_code: code,
      });

      alert(res?.data?.output || "No output");
    } catch (err) {
      console.error(err);
      alert("❌ Run failed");
    }
  };

  // SUBMIT TASK
  const submitTask = async (taskId, code) => {
    if (!code || code.trim().length === 0) {
      alert("⚠️ Please write code before submitting");
      return;
    }

    try {
      await api.post(`/tasks/submit/${taskId}`, {
        source_code: code,
      });

      alert("✅ Task submitted! Next unlocked");

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("❌ Submit failed");
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-600">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="w-full p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Tasks
      </h1>

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks available.
        </p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            isLocked={task.status === "locked"}
            onRun={runCode}
            onSubmit={submitTask}
          />
        ))
      )}
    </div>
  );
}