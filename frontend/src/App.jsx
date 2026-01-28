import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Headers from "./pages/components/Headers";
import Footers from "./pages/components/Footers";
import Login from "./pages/Login";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import ProtectedRoute from "./protected/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <Headers />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route
            path="/favorites"
            element={<ProtectedRoute element={<Favorites />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
        </Routes>
        <Footers />
      </Router>
    </AuthProvider>
  );
}

export default App;
