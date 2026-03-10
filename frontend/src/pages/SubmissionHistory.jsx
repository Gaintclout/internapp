import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function SubmissionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/tasks/submissions").then((res) => {
      setHistory(res.data.submissions);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submission History</h1>

      {history.map((sub) => (
        <div
          key={sub.id}
          className="border p-4 rounded mb-3 bg-gray-50 shadow-sm"
        >
          <p className="font-semibold">{sub.task_title}</p>
          <p>Status: {sub.status}</p>
          <p>Submitted At: {sub.created_at}</p>

          <pre className="bg-black text-white p-3 mt-2 rounded">
            {sub.source_code}
          </pre>
        </div>
      ))}
    </div>
  );
}
