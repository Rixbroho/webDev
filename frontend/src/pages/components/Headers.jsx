import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../../services/api";
import { getToken } from "../../protected/Auth";

const Headers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token-37c");
        setUser(null);
      }
    };
    if (getToken()) {
      fetchMe();
    }
  }, []);

  const handleLogout = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?",
    );
    if (!confirmDelete) return;
    localStorage.removeItem("token-37c");

    setUser(null);
    navigate("/login");
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      <Link
        className="p-2 bg-blue-600 m-2 rounded-lg text-white hover:bg-blue-700"
        to="/"
      >
        Home
      </Link>

      <Link
        className="p-2 bg-blue-600 m-2 rounded-lg text-white hover:bg-blue-700"
        to="/restaurants"
      >
        Restaurants
      </Link>

      {!user ? (
        <>
          <Link
            to="/login"
            className="p-2 bg-green-600 m-2 rounded-lg text-white hover:bg-green-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="p-2 bg-green-600 m-2 rounded-lg text-white hover:bg-green-700"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <span className="p-2 bg-purple-600 m-2 rounded-lg text-white">
            Welcome, {user.username}
          </span>

          <Link
            className="p-2 bg-yellow-600 m-2 rounded-lg text-white hover:bg-yellow-700"
            to="/favorites"
          >
            Favorites
          </Link>

          <Link
            className="p-2 bg-indigo-600 m-2 rounded-lg text-white hover:bg-indigo-700"
            to="/profile"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 bg-red-600 m-2 rounded-lg text-white hover:bg-red-700"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Headers;
