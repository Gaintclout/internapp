import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import LoginVector from "../assets/login.png";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // INPUT HANDLER
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("⚠️ Enter Email & Password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loginData = new URLSearchParams();
      loginData.append("username", form.email);
      loginData.append("password", form.password);

      const response = await api.post("/auth/login", loginData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response?.data?.access_token;

      if (!token) {
        throw new Error("Token missing");
      }

      localStorage.setItem("token", token);

      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Optional VS Code sync
      try {
        await api.post("/auth/vscode-token", { token });
      } catch {
        console.warn("VS Code sync skipped");
      }

      alert("Login Successful ✅");

      // REDIRECT
      const lastPage = localStorage.getItem("last_page");

      if (lastPage) {
        localStorage.removeItem("last_page");
        navigate(lastPage);
      } else {
        navigate("/preferences");
      }

    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.detail ||
        "❌ Invalid credentials";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.credential;

      const res = await api.post("/auth/google-login", {
        token: googleToken,
      });

      localStorage.setItem("token", res.data.access_token);

      alert("Google Login Successful ✅");

      const lastPage = localStorage.getItem("last_page");

      if (lastPage) {
        localStorage.removeItem("last_page");
        navigate(lastPage);
      } else {
        navigate("/preferences");
      }

    } catch (error) {
      console.error(error);
      alert("Google Login Failed");
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center p-10">
          <img src={logo} alt="logo" className="w-32 mb-8 self-start" />
          <img src={LoginVector} alt="login" className="w-[85%] max-w-md" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10 border-l">

          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Login
          </h2>

          <form className="space-y-5" onSubmit={handleLogin}>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInput}
              className="w-full border p-3 rounded-md"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInput}
                className="w-full border p-3 rounded-md pr-10"
              />

              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-full`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* FORGOT */}
            <p className="text-right">
              <a href="/forgotpassword" className="text-gray-500 hover:text-blue-600">
                Forgot password?
              </a>
            </p>

            {/* DIVIDER */}
            <div className="flex items-center justify-center text-gray-400">
              <span className="w-1/4 border-t"></span>
              <span className="mx-2">or</span>
              <span className="w-1/4 border-t"></span>
            </div>

            {/* GOOGLE */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            {/* SIGNUP */}
            <p className="text-center text-gray-600">
              No account?{" "}
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