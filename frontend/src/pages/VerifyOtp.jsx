import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, forgotPassword } from "../services/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get email  navigation
    if (location.state?.email) {
      setEmail(location.state.email);
      setCanResend(false);
      setResendTimer(60);
    } else {
      // If no email in state, redirect back to forgot password
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (canResend) return;
    const id = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [canResend]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ type: "error", text: "Please enter OTP" });
      return;
    }
    if (otp.length !== 6) {
      setMessage({ type: "error", text: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await verifyOtp(email, otp);
      setMessage({
        type: "success",
        text: res.data.message || "OTP verified successfully",
      });
      setTimeout(() => {
        navigate("/reset-password", { state: { email, otp } });
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    navigate("/forgot-password");
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await forgotPassword(email);
      setMessage({ type: "success", text: res.data.message || "OTP resent" });
      setCanResend(false);
      setResendTimer(60);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-rose-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-1">Verify OTP</h1>
          <p className="text-orange-50">
            Enter the code sent to{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-sky-50 p-3 rounded-lg border-l-4 border-sky-400">
              <div className="text-sm text-sky-700">
                Email: <strong className="text-slate-800">{email}</strong>
              </div>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="mt-2 text-xs text-sky-600 underline"
              >
                Change Email
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Check your email for the code. It expires in 1 hour.
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                }}
                required
                maxLength="6"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-2xl tracking-widest text-center font-semibold"
                placeholder="000000"
                aria-label="One-time code"
              />
              <div className="text-xs text-gray-400 mt-2">{otp.length}/6</div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`flex-1 py-3 rounded-xl text-white font-bold ${loading || otp.length !== 6 ? "bg-gray-300" : "bg-orange-600 hover:bg-orange-700"}`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || loading}
                className={`px-4 py-3 rounded-xl font-medium ${canResend ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-gray-100 text-gray-400"}`}
              >
                {canResend ? "Resend" : `Resend (${resendTimer}s)`}
              </button>
            </div>
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

export default VerifyOtp;
