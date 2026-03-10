import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data.tasks);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const runCode = async (taskId, code) => {
    try {
      const res = await api.post(`/tasks/run/${taskId}`, {
        source_code: code,
      });
      alert(res.data.output);
    } catch {
      alert("Run failed");
    }
  };

  const submitTask = async (taskId, code) => {
    try {
      await api.post(`/tasks/submit/${taskId}`, {
        source_code: code,
      });
      alert("Task submitted! Next task unlocked.");
      loadTasks();
    } catch {
      alert("Submit failed");
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {tasks.map((task) => (
        <TaskCard
          key={task.task_id}
          task={task}
          isLocked={task.status === "locked"}
          onRun={runCode}
          onSubmit={submitTask}
        />
      ))}
    </div>
  );
}
