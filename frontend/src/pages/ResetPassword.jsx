import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email);
      setOtp(location.state.otp);
    } else {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  useEffect(() => {
    const s = getStrength(password);
    setStrength(s);
  }, [password]);

  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setMessage({ type: "error", text: "Please fill all password fields" });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await resetPassword(email, otp, password);
      setMessage({
        type: "success",
        text: res.data.message || "Password reset successfully",
      });
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Error resetting password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-1">Reset Password</h1>
          <p className="text-orange-50">
            Set a new password for{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter new password"
                  aria-label="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded ${strength === 0 ? "bg-gray-200" : strength === 1 ? "bg-red-400" : strength === 2 ? "bg-yellow-400" : strength === 3 ? "bg-emerald-400" : "bg-green-600"}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
                <div className="text-xs text-gray-600">
                  {strength <= 1
                    ? "Weak"
                    : strength === 2
                      ? "Fair"
                      : strength === 3
                        ? "Good"
                        : "Strong"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Confirm new password"
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-sm text-gray-600"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold ${loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
