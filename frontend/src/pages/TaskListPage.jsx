import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import LockedBanner from "../components/LockedBanner";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/tasks/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      console.error("Task load error:", err);
      alert("Failed to load tasks.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const timeLeft = (unlockAt) => {
    if (!unlockAt) return null;

    const now = new Date();
    const unlock = new Date(unlockAt);
    const diff = unlock - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);

    return `${days}d ${hrs}h remaining`;
  };

  if (loading) return <div className="p-6">Loading tasks...</div>;

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-2xl font-bold">Your Tasks</h1>

      {tasks.map((t) => {
        const locked =
          t.unlocked_at && new Date(t.unlocked_at) > new Date();

        return (
          <div key={t.id}>
            {locked ? (
              <LockedBanner
                seq={t.seq}
                title={t.title}
                unlockTime={timeLeft(t.unlocked_at)}
              />
            ) : (
              <TaskCard
                id={t.id}
                seq={t.seq}
                title={t.title}
                isLearning={t.is_learning}
                unlocked={true}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
