
import React, { useState } from "react";
import OtpVector from "/src/assets/otp.png";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";

export default function NewPasswordPage() {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6}$/;

    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must be exactly 6 characters with letters, numbers and special symbol."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please verify OTP again.");
        navigate("/verify-otp");
        return;
      }

      const response = await api.post(
        "/auth/reset-password",
        {
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Password updated successfully");

      navigate("/Studentlogin");

    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      if (error.response) {
        alert(error.response.data?.detail || "Password reset failed");
      } else {
        alert("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[600px] bg-white flex items-center justify-center px-4 shadow-2xl">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl">

        <div className="flex flex-col md:flex-row items-center gap-8 pt-20">

          {/* LEFT */}
          <div className="w-full md:w-1/2 px-8 md:px-20">

            <h1 className="text-3xl font-semibold text-[#2f67f6] mb-8">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* NEW PASSWORD */}
              <div>
                <label className="text-sm text-[#2f67f6]">New Password</label>

                <div className="flex items-center border rounded-xl px-4 py-3">

                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /[^A-Za-z0-9@$!%*?&]/g,
                        ""
                      );

                      if (value.length <= 6) {
                        setNewPassword(value);
                      }
                    }}
                    className="w-full outline-none"
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>

                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-sm text-[#2f67f6]">
                  Confirm Password
                </label>

                <div className="flex items-center border rounded-xl px-4 py-3">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /[^A-Za-z0-9@$!%*?&]/g,
                        ""
                      );

                      if (value.length <= 6) {
                        setConfirmPassword(value);
                      }
                    }}
                    className="w-full outline-none"
                    placeholder="Re-enter password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>

                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-full bg-[#2f67f6] text-white font-semibold"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

            </form>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={OtpVector}
              alt="Illustration"
              className="w-[80%] max-w-xl"
            />
          </div>

        </div>
      </div>
    </div>
  );
}