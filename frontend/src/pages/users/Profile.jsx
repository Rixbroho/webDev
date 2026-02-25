import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  Bell,
  Lock,
  Camera,
  Globe,
  ChevronRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Nav from "../components/Nav";
import { updateUserProfile, getMe, changePassword } from "../../services/api";
import { toast } from "react-toastify";

const Profile = ({ user, onLogout, setCurrentPage }) => {
  const [activeNavTab, setActiveNavTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMe();
        if (res.data.success) {
          const u = res.data.user;
          setProfileData({
            username: u.username || "Guest",
            email: u.email || "",
            phone: u.phoneNumber || "",
            location: u.location || "Mumbai, India",
            bio: u.bio || "",
          });
          // ensure localStorage user is up-to-date
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };
    load();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const payload = {
        username: profileData.username,
        email: profileData.email,
        phoneNumber: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
      };

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.id;
      const res = await updateUserProfile(userId, payload);

      if (res.data.success) {
        // Update localStorage user
        const updatedUser = {
          ...storedUser,
          username: profileData.username,
          email: profileData.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans">
      {/* Navigation Sidebar */}
      <Nav
        activeTab={activeNavTab}
        setActiveTab={(tab) => {
          setActiveNavTab(tab);
          setCurrentPage(tab.toLowerCase());
        }}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col md:ml-64">
        {/* Modern Header */}
        <header className="fixed top-0 right-0 left-0 h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 md:left-64 z-40 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Account <span className="text-orange-500">Settings</span>
          </h2>
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all hover:scale-110">
            <Bell size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 pt-32">
          <div className="max-w-5xl mx-auto">
            {/* Top Banner Card (Exactly like your request) */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
              <div className="h-40 bg-gradient-to-r from-orange-500 to-rose-500" />
              <div className="px-10 pb-10 flex flex-col md:flex-row items-end -mt-16 gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-2xl shadow-orange-500/20">
                    <div className="w-full h-full rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-orange-600 text-4xl font-black border-4 border-white">
                      {profileData.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform border border-slate-100">
                      <Camera size={20} />
                    </button>
                  )}
                </div>

                <div className="flex-1 flex justify-between items-center pb-2">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      {profileData.username}
                    </h3>
                    <p className="text-slate-500 font-medium text-base">
                      Manage your identity and settings
                    </p>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl active:scale-95"
                    >
                      <Edit2 size={18} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 active:scale-95"
                      >
                        {isUpdating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form Fields (Full Edit Mode) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <User size={16} className="text-emerald-500" /> Basic
                    Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        Username
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={18}
                        />
                        <input
                          disabled={!isEditing}
                          name="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none font-semibold ${
                            isEditing
                              ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                              : "bg-gray-50 border-transparent text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={18}
                        />
                        <input
                          disabled={!isEditing}
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none font-semibold ${
                            isEditing
                              ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                              : "bg-gray-50 border-transparent text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={18}
                        />
                        <input
                          disabled={!isEditing}
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none font-semibold ${
                            isEditing
                              ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                              : "bg-gray-50 border-transparent text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={18}
                        />
                        <input
                          disabled={!isEditing}
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all outline-none font-semibold ${
                            isEditing
                              ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                              : "bg-gray-50 border-transparent text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio Area */}
                  <div className="mt-6 space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      Bio
                    </label>
                    <textarea
                      disabled={!isEditing}
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none resize-none font-semibold ${
                        isEditing
                          ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                          : "bg-gray-50 border-transparent text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Security Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                    Security
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setPwdModalOpen(true)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all group"
                    >
                      <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                        <Lock
                          size={18}
                          className="text-gray-400 group-hover:text-emerald-600"
                        />
                        Update Password
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>

                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                      <p className="text-[10px] font-black text-orange-600 uppercase mb-1 tracking-tighter">
                        Identity Verified
                      </p>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle size={14} />
                        <span className="text-xs font-bold">
                          Account Secured
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col items-center justify-center text-center">
                  <Globe className="text-emerald-400 mb-2" size={24} />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    Regional Server
                  </p>
                  <p className="text-xs font-bold mt-1">
                    Asia-Pacific (Mumbai)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {pwdModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setPwdModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      toast.error("Please fill all fields");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("Passwords do not match");
                      return;
                    }
                    if (newPassword.length < 8) {
                      toast.error("Password must be at least 8 characters");
                      return;
                    }
                    try {
                      const res = await changePassword(
                        currentPassword,
                        newPassword,
                      );
                      if (res.data.success) {
                        toast.success("Password changed successfully");
                        setPwdModalOpen(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      } else {
                        toast.error(
                          res.data.message || "Failed to change password",
                        );
                      }
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message ||
                          "Error changing password",
                      );
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
