import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paperclip, Eye, EyeOff } from "lucide-react";
import Logo from "/src/assets/logo.png";
import RegisterVector from "/src/assets/register.png";
import api from "../api/axios";

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");
  const [allotmentFile, setAllotmentFile] = useState("");
  const [internshipType, setInternshipType] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);


// 🔐 FILE VALIDATION (MEMO / ALLOTMENT ONLY)
const handleFileUpload = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const name = file.name.toLowerCase();

  // MEMO FILE
  if (type === "memo") {
    if (!name.includes("memo")) {
      setError("⚠️ Upload only Memo file (filename must contain 'memo')");
      e.target.value = "";
      return;
    }
    setError("");
    setFileName(file.name);
  }

  // ALLOTMENT FILE
  if (type === "allotment") {
    if (!name.includes("allotment")) {
      setError(
        "⚠️ Upload only Allotment Letter (filename must contain 'allotment')"
      );
      e.target.value = "";
      return;
    }
    

    setError("");
    setAllotmentFile(file.name);
  }

  e.target.value = "";
};




  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    college: "",
    year: "",
    internshiptype: "",
    preferred_language: "python" 
  });

 const handleChange = (e) => {
  const { id, value } = e.target;

  // ✅ Name: allow only alphabets & spaces
  if (id === "name") {
    const onlyAlphabets = value.replace(/[^a-zA-Z\s]/g, "");
    setForm({ ...form, name: onlyAlphabets });
    return;
  }

  // ✅ Email: convert to lowercase only
  if (id === "email") {
    setForm({ ...form, email: value.toLowerCase() });
    return;
  }

  setForm({ ...form, [id]: value });
};

const handleFileChange = (e, setter, previousFile) => {
  const file = e.target.files[0];

  if (!file) return;

  // ❌ Same file selected again
  if (file.name === previousFile) {
    setError("⚠️ You selected the same file. Please choose a different file.");
    e.target.value = "";
    return;
  }

  // ✅ New file
  setError("");
  setter(file.name);

  // Reset input so browser allows re-select
  e.target.value = "";
};


  // ⭐ FIXED — Save mapped value (backend value)
  const handleTypeSelect = (type) => {
    let mapped;

    if (type === "FastTrack") mapped = "fasttrack";
    if (type === "45 Days") mapped = "days45";
    if (type === "Semester") mapped = "semester4m";

    setSelectedType(type);
    setInternshipType(mapped);

    // ⭐ MUST SAVE MAPPED VALUE (IMPORTANT)
    localStorage.setItem("selected_internship", mapped);

    console.log("Selected:", type, "Mapped:", mapped);
  };

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
      setError("⚠️ Please fill all fields before registering!");
      return;
    }
    if (!acceptedTerms) {
    setError("⚠️ Please accept the Terms & Conditions to continue.");
    return;
  }


      // 2️⃣ 🔥 ADD HERE (THIS IS THE FIX)
  if (fileName === allotmentFile) {
    setError(
      "⚠️ Memo file and Allotment file must be different. Please upload another file."
    );
    return;
  }

      // 🔐 PASSWORD RULE HERE ✅
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!passwordRegex.test(form.password)) {
    setError(
      "⚠️ Password must be at least 6 characters and include letters, numbers, and a special symbol."
    );
    return;
  }

    setError("");

    try {
      const response = await api.post("/auth/register-student", {
        name: form.name,
        college_email: form.email,
        phone: form.mobile,
        password: form.password,
        college_name: form.college,
        pursuing_year: form.year,
        internship_type: internshipType, 
        preferred_language: form.preferred_language // backend value
      });

      alert("✅ Registration Successful!");
      navigate("/StudentLogin");
    } catch (err) {
      let msg = "❌ Registration failed. Try again.";

      if (Array.isArray(err.response?.data?.detail)) {
        msg = err.response.data.detail[0].msg;
      }

      setError(msg);
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left Section */}
        <div className="hidden md:flex w-1/2 flex-col bg-white p-10">
          <div className="flex justify-start mb-6">
            <img src={Logo} alt="GAINT Logo" className="w-28 md:w-32" />
          </div>
          <div className="flex-grow flex justify-center items-center">
            <img
              src={RegisterVector}
              alt="Registration Illustration"
              className="w-[85%] max-w-md object-contain"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10 border-l border-gray-100">
          <h2 className="text-3xl font-bold text-[#2563eb] mb-6">Register</h2>

          {error && (
            <p className="text-red-500 text-sm font-medium mb-3">{error}</p>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* Name */}
            <div className="relative">
              <label htmlFor="name" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 outline-none"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <label htmlFor="mobile" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Mobile No</label>
              <input
                type="tel"
                id="mobile"
                placeholder="Enter Mobile No"
                maxLength="10"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* College */}
            <div className="relative">
              <label htmlFor="college" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">College Name</label>
              <input
                type="text"
                id="college"
                placeholder="College Name"
                value={form.college}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 outline-none"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <label htmlFor="year" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Year</label>
              <select
                id="year"
                value={form.year}
                onChange={handleChange}
                className="w-full border border-blue-400 rounded-md p-3 outline-none bg-white"
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            {/* File Uploads */}
            <div className="flex flex-col sm:flex-row gap-4">

              <div className="relative flex-1">
                <label htmlFor="memo" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Upload Memo</label>
                <div className="flex items-center justify-between border border-blue-400 rounded-md p-3 cursor-pointer">
                  <span className="truncate w-[80%]">
                    {fileName ? <span className="text-green-600 font-medium">✅ {fileName}</span> : "Drop File(s)"}
                  </span>
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <input
                    id="memo"
                    type="file"
                    accept=".pdf,.doc,.docx"
             onChange={(e) => handleFileUpload(e, "memo")}

                  className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="relative flex-1">
                <label htmlFor="allotment" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">Upload Allotment Letter</label>
                <div className="flex items-center justify-between border border-blue-400 rounded-md p-3 cursor-pointer">
                  <span className="truncate w-[80%]">
                    {allotmentFile ? <span className="text-green-600 font-medium">{allotmentFile}</span> : "Drop File(s)"}
                  </span>
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <input
                    id="allotment"
                    type="file"
                    accept=".pdf,.doc,.docx"
               onChange={(e) => handleFileUpload(e, "allotment")}

                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Internship Type */}
            <div className="mt-4">
              <h3 className="text-[#2563eb] font-semibold mb-2 text-lg">Internship Type</h3>
              <div className="flex flex-wrap gap-4 text-base text-gray-700">
                {["FastTrack", "45 Days", "Semester"].map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="type"
                      className="mr-1 accent-blue-500"
                      checked={selectedType === type}
                      onChange={() => handleTypeSelect(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Register Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
           <label className="flex items-center text-gray-600 text-sm sm:text-base">
  <input
    type="checkbox"
    className="accent-blue-500 w-4 h-4 mr-2"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
  />

  <span>
    I accept the{" "}
    <span
      onClick={() => navigate("/terms-and-conditions")}
      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
    >
      Terms & Conditions
    </span>
  </span>
</label>


              <button
                type="submit"
                className="w-[20vh] bg-[#2563eb] text-white py-3 rounded-full font-semibold hover:bg-[#1e4ed8]"
              >
                Register
              </button>
            </div>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/StudentLogin" className="text-[#2563eb] font-semibold hover:underline">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
