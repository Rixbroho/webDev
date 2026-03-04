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
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoadingVenues(true);
        const response = await getAllRestaurants();
        if (response?.data?.success) {
          setVenues(response.data.venues || []);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast.error("Failed to load restaurants");
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on the search term
  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100">
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[90vh] lg:min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 flex flex-col overflow-hidden">
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
            <span className="text-xl font-black tracking-tighter">
              DINE<span className="text-orange-200">SAVVY</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/login")}
              className="text-white/90 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-orange-600 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-orange-600 z-50 p-6 space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-left text-white font-bold uppercase tracking-widest py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="block w-full text-left bg-white text-orange-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-200 rounded-full animate-pulse"></span>
            <span className="text-orange-100 text-xs font-bold uppercase tracking-widest">
              Discover Great Food
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            FIND YOUR
            <br />
            <span className="text-orange-200">PERFECT</span> DINING
          </h1>

          <p className="text-orange-100 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
            Discover and reserve tables at the best restaurants in your area.
            From local gems to fine dining experiences.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400"
              size={24}
            />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white rounded-[1.5rem] text-slate-800 text-lg outline-none shadow-2xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 px-6 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Utensils />}
              label="Restaurants"
              value="500+"
              color="bg-orange-500"
            />
            <StatCard
              icon={<Users />}
              label="Happy Diners"
              value="10K+"
              color="bg-orange-500"
            />
            <StatCard
              icon={<MapPin />}
              label="Cities"
              value="50+"
              color="bg-orange-500"
            />
            <StatCard
              icon={<Star />}
              label="Reviews"
              value="8K+"
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* --- FEATURED RESTAURANTS --- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
                Featured <span className="text-orange-500">Restaurants</span>
              </h2>
              <p className="text-slate-500 font-medium">
                Handpicked dining experiences just for you
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all">
              View All <ArrowRight size={18} />
            </button>
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingVenues ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] h-96 animate-pulse shadow-sm"
                ></div>
              ))
            ) : filteredVenues.length > 0 ? (
              filteredVenues
                .slice(0, 6)
                .map((venue) => (
                  <VenuePreview
                    key={venue.id}
                    image={venue.image}
                    name={venue.name}
                    type={venue.type}
                    price={venue.price}
                    rating={venue.rating}
                    location={venue.location}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Utensils size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No restaurants found</p>
              </div>
            )}
          </div>

          <button className="md:hidden flex items-center justify-center gap-2 w-full mt-8 text-orange-600 font-bold text-sm uppercase tracking-widest">
            View All Restaurants <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
            How It <span className="text-orange-500">Works</span>
          </h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto">
            Book your table in just three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Search</h3>
              <p className="text-slate-600">
                Browse restaurants by cuisine, location, or name to find your
                perfect match
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Reserve
              </h3>
              <p className="text-slate-600">
                Choose your preferred date, time, and number of guests, then
                book instantly
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Enjoy</h3>
              <p className="text-slate-600">
                Show up and enjoy your dining experience at the restaurant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-500 to-rose-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Ready to Discover Great Food?
          </h2>
          <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of food lovers who have discovered amazing
            restaurants through DineSavvy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-white text-orange-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-white/10 text-white border-2 border-white/30 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <div className="bg-orange-500 p-2 rounded-xl">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter">
                  DINE<span className="text-orange-500">SAVVY</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Your go-to platform for discovering and booking the best dining
                experiences.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} DineSavvy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
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

const VenuePreview = ({ image, name, type, price, rating, location }) => (
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
        {type}
      </div>
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-[10px] font-black text-orange-600 shadow-sm">
        <Star size={12} fill="currentColor" className="text-orange-500" />
        {rating}
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
          <MapPin size={16} className="text-orange-500" />
          <span>{location}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-orange-600 font-black text-xl">{price}</p>
        <span className="text-[10px] text-gray-400 font-bold uppercase block">
          price range
        </span>
      </div>
    </div>
  </div>
);

export default Home;
