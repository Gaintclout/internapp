import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paperclip, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import RegisterVector from "../assets/register.png";
import api from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const [internshipType, setInternshipType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");
  const [allotmentFile, setAllotmentFile] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    college: "",
    year: "",
    preferred_language: "python",
  });

  // 🔐 FILE VALIDATION
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name.toLowerCase();

    if (type === "memo") {
      if (!name.includes("memo")) {
        setError("⚠️ Upload only Memo file");
        e.target.value = "";
        return;
      }
      setFileName(file.name);
    }

    if (type === "allotment") {
      if (!name.includes("allotment")) {
        setError("⚠️ Upload only Allotment Letter");
        e.target.value = "";
        return;
      }
      setAllotmentFile(file.name);
    }

    setError("");
    e.target.value = "";
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "name") {
      const clean = value.replace(/[^a-zA-Z\s]/g, "");
      setForm({ ...form, name: clean });
      return;
    }

    if (id === "email") {
      setForm({ ...form, email: value.toLowerCase() });
      return;
    }

    setForm({ ...form, [id]: value });
  };

  // INTERNSHIP SELECT
  const handleTypeSelect = (type) => {
    let mapped = "";

    if (type === "FastTrack") mapped = "fasttrack";
    if (type === "45 Days") mapped = "days45";
    if (type === "Semester") mapped = "semester4m";

    setSelectedType(type);
    setInternshipType(mapped);
    localStorage.setItem("selected_internship", mapped);
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.college ||
      !form.year ||
      !fileName ||
      !allotmentFile ||
      !selectedType
    ) {
      setError("⚠️ Please fill all fields");
      return;
    }

    if (!acceptedTerms) {
      setError("⚠️ Accept Terms & Conditions");
      return;
    }

    if (fileName === allotmentFile) {
      setError("⚠️ Upload different files");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(form.password)) {
      setError("⚠️ Weak password");
      return;
    }

    try {
      await api.post("/auth/register-student", {
        name: form.name,
        college_email: form.email,
        phone: form.mobile,
        password: form.password,
        college_name: form.college,
        pursuing_year: form.year,
        internship_type: internshipType,
        preferred_language: form.preferred_language,
      });

      alert("✅ Registration Successful!");
      navigate("/StudentLogin");
    } catch (err) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        "❌ Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 flex-col p-10">
          <img src={logo} alt="logo" className="w-28 mb-6" />
          <img src={RegisterVector} alt="register" className="w-full" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Register</h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <form className="space-y-4" onSubmit={handleRegister}>

            <input id="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" />
            <input id="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
            <input id="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} className="input" />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input id="college" placeholder="College" value={form.college} onChange={handleChange} className="input" />

            <select id="year" value={form.year} onChange={handleChange} className="input">
              <option value="">Year</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
            </select>

            {/* FILES */}
            <input type="file" onChange={(e) => handleFileUpload(e, "memo")} />
            <input type="file" onChange={(e) => handleFileUpload(e, "allotment")} />

            {/* TYPE */}
            {["FastTrack", "45 Days", "Semester"].map((type) => (
              <label key={type}>
                <input type="radio" checked={selectedType === type} onChange={() => handleTypeSelect(type)} />
                {type}
              </label>
            ))}

            {/* TERMS */}
            <label>
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
              Accept Terms
            </label>

            <button type="submit" className="bg-blue-600 text-white p-3 rounded">
              Register
            </button>

            <p>
              Already have account? <Link to="/StudentLogin">Login</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}