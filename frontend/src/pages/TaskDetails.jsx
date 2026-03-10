import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api.get(`/tasks/details/${id}`).then((res) => {
      setTask(res.data);
    });
  }, [id]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-2 text-gray-700">{task.description}</p>

      <pre className="bg-gray-900 text-white p-4 mt-4 rounded">
        {task.example_code}
      </pre>
    </div>
  );
}
