import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "/src/assets/logo.png";
import LoginVector from "/src/assets/login.png";
// import LinkedinIcon from "/src/assets/linkedin.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Input (email stays string)
  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
  if (!form.email || !form.password) {
    setError("⚠️ Please fill in both Email and Password!");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("username", form.email);
    formData.append("password", form.password);

    const response = await api.post("/auth/login-mentor", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Login Response:", response.data);

    // ✅ STORE TOKEN
    localStorage.setItem("mentor_token", response.data.access_token);

    // ✅ STORE MENTOR PROFILE (THIS WAS MISSING)
    localStorage.setItem(
      "mentor_user",
      JSON.stringify({
        name: response.data.name || form.email.split("@")[0],
        email: response.data.email || form.email,
      })
    );

    alert("✅ Login Successful!");
    navigate("/mentordashboard");

  } catch (err) {
    console.error("Login Error:", err);
    setError("❌ Invalid credentials!");
  } finally {
    setLoading(false);
  }
};

  // Google Login
  // const handleGoogleSuccess = (response) => {
  //   console.log("Google token:", response.credential);
  //   alert("Google Login Successful!");
  //   navigate("/preferences");
  // };

  // const handleGoogleError = () => {
  //   alert("Google Login Failed. Try again.");
  // };

// Google Login
const handleGoogleSuccess = async (response) => {
  try {
    const googleToken = response.credential;

    const res = await api.post("/auth/google-login", {
      token: googleToken,
    });

     // ✅ STORE MENTOR TOKEN
    localStorage.setItem("mentor_token", res.data.access_token);


    alert("Google Login Successful!");
    navigate("/mentordashboard");

  } catch (error) {
    console.error("Google login error:", error);
    alert("Google Login Failed at backend!");
  }
};

// ❗ ADD THIS — You forgot this function
const handleGoogleError = () => {
  console.error("Google Login Failed");
  alert("Google Login Failed. Try again.");
};


  // LinkedIn Login
  // const handleLinkedInLogin = () => {
  //   const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  //   const redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
  //   const scope = "r_liteprofile r_emailaddress";
  //   const state = "987654321";

  //   window.location.href =
  //     `https://www.linkedin.com/oauth/v2/authorization?response_type=code
  //     &client_id=${clientId}
  //     &redirect_uri=${redirectUri}
  //     &scope=${scope}
  //     &state=${state}`;
  // };

  return (
    <div className="h-[70vh] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-white p-10">
          <img src={Logo} alt="GAINT Logo" className="w-32 mb-8 self-start" />
          <img src={LoginVector} alt="Login Illustration" className="w-[85%] max-w-md" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10 border-l border-gray-100">
          <h2 className="text-3xl font-bold text-[#2563eb] mb-6">Login</h2>

          <form className="space-y-5">
            
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleInput}
                className="w-full border border-blue-400 rounded-md p-3 outline-none text-gray-800 focus:border-blue-600"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleInput}
                className="w-full border border-blue-400 rounded-md p-3 pr-10 outline-none text-gray-800 focus:border-blue-600"
              />

              <div
                className="absolute right-3 top-3 text-gray-400 w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            {/* Login Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className={`w-[30vh] ${
                  loading ? "bg-gray-400" : "bg-[#2563eb] hover:bg-[#1e4ed8]"
                } text-white py-3 rounded-full font-semibold transition`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Forgot Password */}
            <p className="text-right mt-3">
              <a href="/forgotpassword" className="text-gray-400 text-sm hover:text-blue-600 transition-all">
                Forgot password
              </a>
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center text-gray-400 text-sm my-4">
              <span className="w-1/4 border-t border-gray-300"></span>
              <span className="mx-2">or</span>
              <span className="w-1/4 border-t border-gray-300"></span>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} size="large" shape="pill" />
{/* 
              <button
                type="button"
                onClick={handleLinkedInLogin}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-6 py-2 text-gray-600 hover:bg-gray-100 transition w-full sm:w-[260px] h-[50px]"
              >
                <img src={LinkedinIcon} alt="LinkedIn" className="w-5 h-5" />
                <span className="font-medium text-sm">Sign in with LinkedIn</span>
              </button> */}
            </div>

            {/* Sign Up */}
            {/* <p className="text-center text-gray-600 text-sm mt-6">
              No Account yet?{" "}
              <a href="./register" className="text-[#2563eb] font-semibold">
                Sign up
              </a>
            </p> */}

          </form>
        </div>
      </div>
    </div>
  );
}
