
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


  // console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);


  // Handle input fields
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐⭐⭐ FIXED LOGIN FUNCTION ⭐⭐⭐
  const handleClick = async () => {
    if (!form.email || !form.password) {
      setError("⚠️ Please fill in both Email and Password!");
      return;
    }
 
    try {
      setLoading(true);
      setError("");

      // THE CORRECT FORMAT FOR FASTAPI OAUTH2 LOGIN
      const loginData = new URLSearchParams();
      loginData.append("username", form.email);
      loginData.append("password", form.password);

      const response = await api.post("/auth/login", loginData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      console.log("Login Response:", response.data);

      // Save valid JWT token
      localStorage.setItem("token",
        response.data.access_token
      );

      localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

//       localStorage.setItem(
//   "user",
//   JSON.stringify({
//     id: response.data.user.id,
//     name: response.data.user.name,
//     email: response.data.user.email,
//     role: response.data.user.role,
//   })
// );
      // Try syncing VS Code token (not required for web)
      try {
        await api.post("/auth/vscode-token", {
          token: response.data.access_token,
        });
      } catch (e) {
        console.warn("VS Code not available, skipping…");
      }

      alert("Login Successful!");


 // 🔁 Redirect to last visited page if exists
const lastPage = localStorage.getItem("last_page");

if (lastPage) {
  localStorage.removeItem("last_page"); // one-time use
  navigate(lastPage);
} else {
  navigate("/preferences"); 
}

    } catch (err) {
      console.error("Login Error:", err);
      setError("❌ Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ GOOGLE SIGN-IN FIXED
  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.credential;

      const res = await api.post("/auth/google-login", {
        token: googleToken,
      });

      localStorage.setItem("token", res.data.access_token);

  alert("Google Login Successful!");

const lastPage = localStorage.getItem("last_page");
if (lastPage) {
  localStorage.removeItem("last_page");
  navigate(lastPage);
} else {
  navigate("/preferences");
}

    } catch (error) {
      console.error("Google login error:", error);
      alert("Google Login Failed at backend!");
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed!");
  };

  // ⭐ LINKEDIN LOGIN SAME
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
        
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-white p-10">
          <img src={Logo} className="w-32 mb-8 self-start" />
          <img src={LoginVector} className="w-[85%] max-w-md" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10 border-l border-gray-100">
          
          <h2 className="text-3xl font-bold text-[#2563eb] mb-6">Login</h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleInput}
                className="w-full border border-blue-400 rounded-md p-3"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInput}
                className="w-full border border-blue-400 rounded-md p-3 pr-10"
              />

              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {/* Login Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className={`w-[30vh] ${
                  loading ? "bg-gray-400" : "bg-[#2563eb] hover:bg-[#1e4ed8]"
                } text-white py-3 rounded-full`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Forgot password */}
            <p className="text-right mt-2">
              <a href="/forgotpassword" className="text-gray-500 hover:text-blue-600">
                Forgot password?
              </a>
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center my-4 text-gray-400">
              <span className="w-1/4 border-t"></span>
              <span className="mx-2">or</span>
              <span className="w-1/4 border-t"></span>
            </div>

            {/* Google + LinkedIn Login */}
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} size="large" shape="pill" />

              {/* <button
                type="button"
                onClick={handleLinkedInLogin}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-6 py-2 text-gray-600 hover:bg-gray-100 transition w-full sm:w-[260px] h-[50px]"
              >
                <img src={LinkedinIcon} alt="LinkedIn" className="w-5 h-5" />
                <span className="font-medium text-sm">Sign in with LinkedIn</span>
              </button> */}
            </div>

            {/* Signup Link */}
            <p className="text-center text-gray-600 mt-6">
              No Account yet?{" "}
              <a href="/register" className="text-blue-600 font-semibold">
                Sign up
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
