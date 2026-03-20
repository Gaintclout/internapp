import React, { useEffect, useState } from "react";
import { Upload, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import ProfileMenu from "../components/ProfileMenu";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [bio, setBio] = useState("");

  /* 🔹 LOAD USER */
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPhoto(parsed?.photo || null);
      setBio(parsed?.bio || "");
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

    // 🔥 OPTIONAL: size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* 🔹 UPDATE PROFILE */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!bio || bio.trim().length === 0) {
      alert("⚠️ Enter your bio");
      return;
    }

    try {
      await api.put("/students/profile", {
        photo,
        bio,
      });

      const updatedUser = {
        ...(user || {}),
        photo,
        bio,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      window.dispatchEvent(new Event("profile-updated"));

      alert("✅ Profile updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  /* 🔹 RESET PROFILE */
  const handleReset = async () => {
    try {
      await api.put("/students/profile", {
        photo: null,
        bio: "",
      });

      const resetUser = {
        ...(user || {}),
        photo: null,
        bio: "",
      };

      localStorage.setItem("user", JSON.stringify(resetUser));

      setPhoto(null);
      setBio("");
      setUser(resetUser);

      window.dispatchEvent(new Event("profile-updated"));
    } catch {
      alert("❌ Reset failed");
    }
  };

  /* 🔹 LOGOUT */
  const handleLogout = () => {
    localStorage.clear(); // 🔥 better cleanup
    navigate("/studentlogin");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src={logo} alt="logo" className="w-20" />
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

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Settings</h1>
          <ProfileMenu />
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow p-8 max-w-xl">
          <h2 className="text-red-500 font-medium mb-4">
            Account Setting
          </h2>

          {/* PHOTO */}
          <label className="w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
            {photo ? (
              <img
                src={photo}
                alt="profile"
                className="w-full h-full object-cover"
              />
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

          {/* BIO */}
          <div className="mt-6">
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Update Profile
            </button>

            <button
              onClick={handleReset}
              className="border px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}