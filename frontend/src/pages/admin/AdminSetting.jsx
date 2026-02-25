import React, { useState, useEffect } from "react";
import {
  Save,
  User,
  BellRing,
  Globe2,
  Database,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getSettings,
  updateSettings,
  updateUserProfile,
  getMe,
} from "../../services/api";

const AdminSetting = () => {
  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminAddress: "",
    siteName: "",
    currency: "INR (₹)",
    bookingAutoApprove: false,
    emailAlerts: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        // Fetch current logged-in admin profile
        const meRes = await getMe();
        if (meRes.data.success && meRes.data.user) {
          const adminUser = meRes.data.user;
          setFormData((prev) => ({
            ...prev,
            adminName: adminUser.username || "",
            adminEmail: adminUser.email || "",
          }));
        }

        // Fetch platform settings
        const settingsRes = await getSettings();
        if (settingsRes.data.success) {
          const s = settingsRes.data.settings;
          setFormData((prev) => ({
            ...prev,
            adminAddress: s.adminAddress || "",
            siteName: s.siteName || "",
            currency: s.currency || "INR (₹)",
            bookingAutoApprove: s.bookingAutoApprove === "true",
            emailAlerts: s.emailAlerts === "true",
          }));
        }
      } catch (err) {
        console.error("Could not load admin data", err);
        toast.error("Failed to load admin settings");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (isSaved) setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        siteName: formData.siteName,
        currency: formData.currency,
        bookingAutoApprove: formData.bookingAutoApprove,
        emailAlerts: formData.emailAlerts,
      };

      await updateSettings(payload);

      // Also update admin user profile (username/email)
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.id) {
        const userPayload = {
          username: formData.adminName,
          email: formData.adminEmail,
        };
        await updateUserProfile(user.id, userPayload);
        // refresh local storage user
        const updatedUser = {
          ...user,
          username: formData.adminName,
          email: formData.adminEmail,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsSaved(true);
      toast.success("Settings saved");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings", err);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Top Bar / Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm font-medium text-orange-600 font-mono uppercase tracking-wider">
            System Configuration
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your account and platform-wide preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaved ? "Settings Saved" : loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Administrator Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800">Admin Profile</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Full Name
                </label>
                <input
                  name="adminName"
                  type="text"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email Address
                </label>
                <input
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Address
                </label>
                <input
                  name="adminAddress"
                  type="text"
                  value={formData.adminAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Platform Logic */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Globe2 className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-800">Global Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Site Name
                  </label>
                  <input
                    name="siteName"
                    type="text"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Display Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Database className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Auto-Approve Reservations
                    </p>
                    <p className="text-xs text-gray-500">
                      System will confirm reservations without manual review.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="bookingAutoApprove"
                    checked={formData.bookingAutoApprove}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold">System Alerts</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Get notified via email when users make a restaurant reservation or
              cancel an existing booking.
            </p>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={formData.emailAlerts}
                onChange={handleChange}
                className="w-5 h-5 rounded border-none bg-gray-700 accent-orange-500"
              />
              <span className="text-sm font-medium group-hover:text-orange-400 transition-colors">
                Enable Email Alerts
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetting;
