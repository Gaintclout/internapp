

import React, { useEffect, useState } from "react";
import { Upload, LogOut } from "lucide-react";
import Logo from "/src/assets/Logo.png";
import ProfileMenu from "../components/ProfileMenu";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [bio, setBio] = useState("");

  /* 🔹 LOAD USER FROM LOCAL STORAGE */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPhoto(parsed.photo || null);
      setBio(parsed.bio || "");
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  /* 🔹 PHOTO UPLOAD */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // base64
    };
    reader.readAsDataURL(file);
  };

  /* 🔹 UPDATE PROFILE (BACKEND + LOCAL) */
const handleUpdate = async (e) => {
  e.preventDefault();

  if (!bio || bio.trim().length === 0) {
    alert("⚠️ Please enter your bio before updating profile");
    return;
  }

  try {
    await api.put("/students/profile", {
      photo,
      bio,
    });

    const updatedUser = {
      ...user,
      photo,
      bio,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // ✅🔥 THIS IS THE MISSING LINE
    window.dispatchEvent(new Event("profile-updated"));

    alert("Profile updated successfully ✅");
  } catch (err) {
    console.error("Profile update failed", err);
    alert("Failed to update profile");
  }
};


  /* 🔹 RESET PROFILE */
  const handleReset = async () => {
    try {
      await api.put("/students/profile", {
        photo: null,
        bio: "",
      });

      const resetUser = { ...user, photo: null, bio: "" };
      localStorage.setItem("user", JSON.stringify(resetUser));

      setPhoto(null);
      setBio("");
      setUser(resetUser);
    } catch {
      alert("Reset failed");
    }
  };

  /* 🔹 LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("student_token");
    navigate("/studentlogin");
  };

  return (
<div className="h-[70vh] bg-[#f7f9fc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src={Logo} className="w-15 h-10" />
            {/* <span className="font-semibold">GAINT</span> */}
          </div>
          <p className="text-blue-600 font-medium">⚙ Settings</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Settings</h1>

          <ProfileMenu />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-8 max-w-xl">
          <h2 className="text-red-500 font-medium mb-4">
            Account Setting
          </h2>

          {/* Upload */}
          <label className="w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
            {photo ? (
              <img src={photo} className="w-full h-full object-cover" />
            ) : (
              <Upload className="text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </label>

          {/* Bio */}
          <div className="mt-6">
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 border rounded-lg px-4 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Update Profile
            </button>
            <button
              onClick={handleReset}
              className="border px-6 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
