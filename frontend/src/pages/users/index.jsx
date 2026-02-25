import React, { useState } from "react";
import UserDashboard from "./UserDashboard";
import Bookings from "./Bookings";
import Venues from "./Venues";
import Profile from "./Profile";
import Settings from "./Settings";

const UserPages = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <UserDashboard
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "bookings":
        return (
          <Bookings
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "venues":
      case "restaurants":
        return (
          <Venues
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "profile":
        return (
          <Profile
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case "settings":
        return (
          <Settings
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      default:
        return (
          <UserDashboard
            user={user}
            onLogout={onLogout}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return renderPage();
};

export default UserPages;
