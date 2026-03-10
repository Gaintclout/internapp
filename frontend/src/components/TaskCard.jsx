import React from "react";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import LockedBanner from "./LockedBanner";
import CodeEditorBox from "./CodeEditorBox";

export default function TaskCard({
  task,
  isLocked,
  onRun,
  onSubmit,
}) {
  return (
    <div
      className={`p-4 mb-5 rounded-lg border shadow-sm ${
        isLocked ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {task.seq}. {task.title}
        </h2>
        <StatusBadge status={task.status} />
      </div>

      <p className="text-gray-500 text-sm">
        Attempts: {task.attempts} | Hidden Attempts: {task.hidden_attempts}
      </p>

      <ProgressBar percent={task.progress_percent} />

      <p className="mt-2 text-gray-800">{task.description}</p>

      {!isLocked && (
        <>
          <CodeEditorBox onChange={(value) => (task.source = value)} />

          <div className="mt-3 flex gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => onRun(task.task_id, task.source)}
            >
              ▶ Run
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => onSubmit(task.task_id, task.source)}
            >
              ✔ Submit
            </button>
          </div>
        </>
      )}

      {isLocked && <LockedBanner />}
    </div>
  );
}
