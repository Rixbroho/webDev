import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter email' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await forgotPassword(email);
      setMessage({ type: 'success', text: res.data.message || 'OTP sent to your email' });
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 700);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Error sending OTP' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-green-400/30 rounded-full blur-3xl top-0 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl bottom-0 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white text-center relative">
          <h1 className="text-3xl font-bold mb-1">Forgot Password</h1>
          <p className="text-emerald-50">We'll send a one-time code to reset your password</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {loading ? 'Sending OTP...' : 'Send Reset Link'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {message.text}
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Remembered your password? <button onClick={() => navigate('/login')} className="text-emerald-600 font-semibold">Log in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
