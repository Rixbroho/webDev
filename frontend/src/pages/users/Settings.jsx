import React, { useState } from "react";
import {
  Bell,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  LogOut,
} from "lucide-react";
import Nav from "../components/Nav";
import { toast } from "react-toastify";
import { changePassword } from "../../services/api";

const Settings = ({ user, onLogout, setCurrentPage }) => {
  const [activeNavTab, setActiveNavTab] = useState("Settings");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    promotions: false,
    reviews: true,
    messages: true,
  });

  const handleNavTabChange = (tab) => {
    setActiveNavTab(tab);
    setCurrentPage(tab.toLowerCase());
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res && res.status === 200) {
        toast.success("Password changed successfully.");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans">
      {/* Navigation Sidebar */}
      <Nav
        activeTab={activeNavTab}
        setActiveTab={handleNavTabChange}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 md:left-64 z-40 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            App <span className="text-orange-500">Settings</span>
          </h2>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">
                {user?.username}
              </p>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                {user?.role}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-lg shadow-orange-100 flex items-center justify-center text-white font-black text-lg">
              {user?.username
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-28">
          <div className="max-w-2xl space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-orange-500" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Notification Settings
                </h3>
              </div>

              <div className="space-y-4">
                {/* Booking Reminders */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Reservation Reminders
                    </p>
                    <p className="text-sm text-gray-500">
                      Get notified about upcoming dining reservations
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.bookingReminders}
                      onChange={() =>
                        handleNotificationChange("bookingReminders")
                      }
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>
                </div>

                {/* Promotions */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Promotions & Offers
                    </p>
                    <p className="text-sm text-gray-500">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={() => handleNotificationChange("promotions")}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>
                </div>

                {/* Reviews */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Review Requests
                    </p>
                    <p className="text-sm text-gray-500">
                      Get asked to review restaurants you've dined at
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.reviews}
                      onChange={() => handleNotificationChange("reviews")}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>
                </div>

                {/* Messages */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">Messages</p>
                    <p className="text-sm text-gray-500">
                      Notifications for new messages
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.messages}
                      onChange={() => handleNotificationChange("messages")}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-orange-500" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Security Settings
                </h3>
              </div>

              <div className="space-y-4">
                {/* Change Password */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-orange-500" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          Change Password
                        </p>
                        <p className="text-sm text-gray-500">
                          Update your password regularly for security
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold text-sm"
                  >
                    Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-orange-500" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
              <h3 className="text-lg font-bold text-red-600 mb-6">
                Danger Zone
              </h3>

              <div className="space-y-4">
                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>

                {/* Delete Account */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete your account? This cannot be undone.",
                      )
                    ) {
                      toast.info(
                        "Account deletion requested. This feature will be implemented soon.",
                      );
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    disabled={passwordLoading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    disabled={passwordLoading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={passwordLoading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
