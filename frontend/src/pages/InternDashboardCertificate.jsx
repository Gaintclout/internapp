import React, { useEffect, useState } from "react";
import Logo from "/src/assets/logo.png";
import { Download } from "lucide-react";
import Background from "/src/assets/bg-paper.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function InternDashboardCertificate() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Certificate");
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // const [profileOpen, setProfileOpen] = useState(false);

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("student_token");
  navigate("/studentlogin");
};


  const routes = {
    "My Project": "/interndashboard",
    Tasks: "/interndashboardtask",
    Certificate: "/interndashboardcertificate",
   
  };

  /* 🔹 LOAD USER */
useEffect(() => {
  try {
    // 1️⃣ Load API user (name, email)
    const loadUser = async () => {
      const res = await api.get("/auth/me");
      const apiUser = res.data;

      // 2️⃣ Load local profile (photo, bio)
      const localUser = JSON.parse(localStorage.getItem("user")) || {};

      // 3️⃣ MERGE BOTH
      const mergedUser = {
        ...apiUser,
        photo: localUser.photo || null,
        bio: localUser.bio || "",
      };

      // 4️⃣ Save merged user globally
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
    };

    loadUser();
  } catch (err) {
    console.error("User load failed", err);
  }
}, []);


  /* 🔹 LOAD CERTIFICATE */
  useEffect(() => {
    api
      .get("/certificate/download", { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setCertificateUrl(url);
        setError(null);
      })
      .catch(() => {
        setError("Certificate not generated yet");
        setCertificateUrl(null);
      });

    return () => {
      if (certificateUrl) URL.revokeObjectURL(certificateUrl);
    };
  }, []);

  const downloadPDF = () => {
    if (!certificateUrl) return;
    const a = document.createElement("a");
    a.href = certificateUrl;
    a.download = "GAINT_Certificate.pdf";
    a.click();
  };

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center bg-cover bg-center relative px-4 bg-gray-50 shadow-2xl"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* LOGO */}
      <img
        src={Logo}
        alt="GAINT Logo"
        className="absolute top-4 left-6 w-28"
      />

      {/* 🔥 CLICKABLE USER PROFILE */}
      <div
        onClick={() => navigate("/Setting")}
        className="absolute top-4 right-6 flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:opacity-80"
      >
        <div className="text-right leading-tight">
          <div className="font-medium text-gray-800">
            {user?.name}
          </div>
          <div className="text-xs text-gray-500">
            {user?.email}
          </div>
        </div>

    {user?.photo ? (
  <img
    src={user.photo}
    className="w-9 h-9 rounded-full object-cover"
  />
) : (
  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
    {user?.name?.charAt(0).toUpperCase()}
  </div>
)}

      </div>

      <section className="relative right-[70px] flex gap-10 py-10">
        {/* LEFT MENU */}
        <main className="relative top-[30px] w-[250px] h-[400px] left-[100px] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
          <aside className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700">Dashboard</h2>

            {["My Project", "Tasks", "Certificate"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActive(item);
                  navigate(routes[item]);
                }}
                className={`w-full px-4 py-2 rounded-full border text-sm transition-all ${
                  active === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item}
              </button>
            ))}
          </aside>
        </main>

        {/* RIGHT CONTENT */}
        <main className="w-[700px] min-h-[50vh] bg-white border border-blue-900 rounded-2xl shadow-sm p-10 flex flex-col items-center">
          <div className="border rounded-xl shadow-lg overflow-hidden w-[420px] h-[300px] bg-white flex items-center justify-center">
            {certificateUrl ? (
           <iframe
  src={`${certificateUrl}#toolbar=0&navpanes=0&scrollbar=0`}
  title="Certificate"
  className="w-full h-full border-none"
/>

            ) : (
              <p className="text-gray-500">{error}</p>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={downloadPDF}
              disabled={!certificateUrl}
              className="flex items-center gap-2 bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Download PDF <Download size={16} />
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}


