import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function VscodePathSetup() {
  const navigate = useNavigate();

  const [vscodePath, setVscodePath] = useState(
    localStorage.getItem("vscode_path") || ""
  );

  const selectedType = localStorage.getItem("selected_internship");

  const savePath = async () => {
    if (!vscodePath.trim()) {
      alert("Please enter a valid VS Code project path.");
      return;
    }

    const cleanPath = vscodePath.replace(/\\/g, "/");

    // Save locally
    localStorage.setItem("vscode_path", cleanPath);

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("student_token");

      // Send path to backend
      await api.post(
        "/vscode/save-path",
        { path: cleanPath },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("VS Code project path saved!");

    } catch (error) {
      console.error(error);
      alert("Backend error: Could not save path!");
    }

    // Redirect user based on internship type
    switch (selectedType) {
      case "fasttrack":
        navigate("/fastrack");
        break;

      case "days45":
        navigate("/fortyfivedays");
        break;

      case "semester4m":
        navigate("/fourmonths");
        break;

      default:
        navigate("/fastrack");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-5 text-blue-600">
        VS Code Project Folder Setup
      </h1>

      <input
        type="text"
        value={vscodePath}
        onChange={(e) => setVscodePath(e.target.value)}
        placeholder="Example: C:/Users/DELL/Desktop/Adithya"
        className="border w-full px-3 py-2 rounded mb-4"
      />

      <button
        onClick={savePath}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Save Path
      </button>
    </div>
  );
}
