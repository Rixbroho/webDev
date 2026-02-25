import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Search,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAllRestaurants } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        const response = await getAllRestaurants();
        if (response?.data?.success) {
          setRestaurants(response.data.restaurants || []);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants");
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on the search term
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[90vh] lg:min-h-screen bg-gradient-to-br from-orange-500 via-rose-500 to-amber-600 flex flex-col overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/10 rounded-full blur-3xl -top-24 -left-24 animate-pulse"></div>
          <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-200/10 rounded-full blur-3xl bottom-0 -right-24 animate-pulse delay-700"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-[60] flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight">
              DINE<span className="text-orange-200">SAVVY</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 text-white font-bold hover:bg-white/10 rounded-xl transition-all"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:shadow-white/20 transition-all transform hover:scale-105"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[55] bg-orange-900/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="text-2xl text-white font-bold"
            >
              Log In
            </button>
            <button
              onClick={() => {
                navigate("/register");
                setIsMenuOpen(false);
              }}
              className="px-12 py-4 bg-white text-orange-600 text-xl font-bold rounded-2xl"
            >
              Register
            </button>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-orange-50 text-xs md:text-sm font-bold mb-6 border border-white/20">
            <Activity className="w-4 h-4 text-orange-300" />
            <span>
              {loadingRestaurants
                ? "Loading restaurants..."
                : `${restaurants.length} restaurants available now`}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Discover Great <br />
            <span className="text-orange-200">Dining Experiences.</span>
          </h1>

          <p className="text-base md:text-xl text-orange-50/80 mb-10 max-w-2xl">
            Find and reserve tables at the best restaurants in your area. From
            cozy cafes to fine dining, discover your next favorite meal.
          </p>

          {/* Responsive Search Bar */}
          <div className="w-full max-w-2xl bg-white/20 backdrop-blur-xl p-2 md:p-3 rounded-[2rem] border border-white/30 shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200 w-5 h-5" />
              <input
                type="text"
                placeholder="What are you craving?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 border-none rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-orange-100 outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-50 transition-all active:scale-95">
              <Search className="w-5 h-5" />
              <span>Find Restaurants</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 md:-mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <StatCard
            icon={<Calendar />}
            label="Reservations"
            value="25,000+"
            color="bg-orange-500"
          />
          <StatCard
            icon={<Users />}
            label="Happy Foodies"
            value="50,000+"
            color="bg-rose-500"
          />
          <StatCard
            icon={<Utensils />}
            label="Top Restaurants"
            value="1,000+"
            color="bg-amber-500"
          />
        </div>
      </div>

      {/* --- FEATURED RESTAURANTS --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              Popular Restaurants
            </h2>
            <p className="text-gray-500 font-medium mt-2">
              Handpicked spots for your next dining experience
            </p>
          </div>
          <button className="flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all">
            View All Restaurants <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loadingRestaurants ? (
            <div className="col-span-3 flex items-center justify-center">
              <p className="text-gray-500">Loading restaurants...</p>
            </div>
          ) : (
            filteredRestaurants
              .slice(0, 3)
              .map((r) => (
                <RestaurantPreview
                  key={r.id}
                  image={r.image}
                  name={r.name}
                  cuisine={r.cuisine}
                  priceRange={r.priceRange}
                />
              ))
          )}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-orange-500 to-rose-600 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to dine?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-80 max-w-xl mx-auto">
              Join the largest community of food lovers today and discover
              amazing restaurants.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-white text-orange-600 px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all"
            >
              Create Your Account
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About DineSavvy</h3>
            <p className="text-gray-400 text-sm">
              DineSavvy is your ultimate platform to discover and reserve tables
              at the best restaurants. Join us and experience great dining
              today!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400 text-sm">
              Email: support@dinesavvy.com
            </p>
            <p className="text-gray-400 text-sm">Phone: +1 234 567 890</p>
            <p className="text-gray-400 text-sm">
              Address: 123 Foodie Lane, City, Country
            </p>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DineSavvy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-5 hover:translate-y-[-5px] transition-all">
    <div className={`${color} p-4 rounded-2xl text-white shadow-lg shrink-0`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <h4 className="text-2xl md:text-3xl font-black text-gray-800 leading-none">
        {value}
      </h4>
    </div>
  </div>
);

const RestaurantPreview = ({ image, name, cuisine, priceRange }) => (
  <div className="group cursor-pointer hover:shadow-xl transition-shadow">
    <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] mb-6 shadow-lg">
      {image && image.startsWith("/uploads") ? (
        <img
          src={`http://localhost:3000${image}`}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-orange-50 flex items-center justify-center text-6xl">
          {image || "🍽️"}
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-wider shadow-sm">
        {cuisine}
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
          <MapPin size={16} className="text-orange-500" />
          <span>View on map</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-orange-600 font-black text-xl">{priceRange}</p>
        <span className="text-[10px] text-gray-400 font-bold uppercase block">
          price range
        </span>
      </div>
    </div>
  </div>
);

export default Home;
