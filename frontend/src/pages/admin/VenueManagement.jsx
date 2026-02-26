import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  MapPin,
  Star,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  getAllCuisines,
} from "../../services/api";
import { toast } from "react-toastify";

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVenueId, setCurrentVenueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "Italian",
    price: "",
    priceRange: "$$",
    rating: 5.0,
    image: "🍽️",
    cuisine: "",
    cuisineIds: [],
    description: "",
    phone: "",
    email: "",
    city: "Kathmandu",
    area: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchVenues = async () => {
    try {
      const response = await getAllRestaurants();
      if (response.data.success) {
        setVenues(response.data.venues);
      }
    } catch (error) {
      toast.error("Failed to load restaurants");
    }
  };

  const fetchCuisines = async () => {
    try {
      const response = await getAllCuisines();
      if (response.data.success) {
        setCuisines(response.data.cuisines || []);
      }
    } catch (error) {
      console.error("Failed to load cuisines", error);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchCuisines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuisineToggle = (cuisineId) => {
    setFormData((prev) => {
      const currentIds = prev.cuisineIds || [];
      if (currentIds.includes(cuisineId)) {
        return {
          ...prev,
          cuisineIds: currentIds.filter((id) => id !== cuisineId),
        };
      } else {
        return { ...prev, cuisineIds: [...currentIds, cuisineId] };
      }
    });
  };

  const getSelectedCuisineNames = () => {
    const selected = cuisines.filter((c) => formData.cuisineIds.includes(c.id));
    return selected.map((c) => c.name).join(", ") || "Select cuisines...";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (venue) => {
    setIsEditing(true);
    setCurrentVenueId(venue.id);
    setFormData({
      name: venue.name,
      location: venue.location,
      type: venue.type,
      price: venue.price || "",
      priceRange: venue.priceRange || "$$",
      rating: venue.rating,
      image: venue.image || "🍽️",
      cuisine: venue.cuisine || "",
      cuisineIds: venue.cuisineIds || [],
      description: venue.description || "",
      phone: venue.phone || "",
      email: venue.email || "",
      city: venue.city || "Kathmandu",
      area: venue.area || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const response = await deleteRestaurant(id);
        if (response.data.success) {
          toast.success("Restaurant deleted!");
          fetchVenues();
        }
      } catch (error) {
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("priceRange", formData.priceRange);
      data.append("rating", formData.rating);
      data.append("image", formData.image);
      data.append("cuisine", formData.cuisine);
      data.append("description", formData.description);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("city", formData.city);
      data.append("area", formData.area);

      // Append cuisine IDs for multi-cuisine support
      if (formData.cuisineIds && formData.cuisineIds.length > 0) {
        formData.cuisineIds.forEach((id) => {
          data.append("cuisineIds", id);
        });
      }

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (isEditing && currentVenueId) {
        await updateRestaurant(currentVenueId, data);
        toast.success("Restaurant updated!");
      } else {
        await createRestaurant(data);
        toast.success("Restaurant created!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchVenues();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save restaurant");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      type: "Italian",
      price: "",
      priceRange: "$$",
      rating: 5.0,
      image: "🍽️",
      cuisine: "",
      cuisineIds: [],
      description: "",
      phone: "",
      email: "",
      city: "Kathmandu",
      area: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Restaurant Management
          </h2>
          <p className="text-gray-500">Manage your restaurant listings</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus size={20} />
          Add Restaurant
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative bg-gray-100">
              {venue.image && venue.image.startsWith("/uploads") ? (
                <img
                  src={`http://localhost:3000${venue.image}`}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {venue.image || "🍽️"}
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(venue)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                >
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteClick(venue.id)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-red-50"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-medium">{venue.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <MapPin size={14} />
                <span>{venue.location}</span>
              </div>
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                {venue.type}
              </span>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-gray-800 font-bold">
                  {venue.priceRange || venue.price || "$$"}
                </p>
                {venue.cuisine && (
                  <p className="text-gray-500 text-xs">{venue.cuisine}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Restaurant" : "Add New Restaurant"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Restaurant Image
                </label>
                <div className="mt-2 border-2 border-dashed border-gray-200 rounded-xl p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-4xl mb-3">
                      {formData.image || "🍽️"}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Restaurant Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Cuisine Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  >
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Thai">Thai</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Price Range
                  </label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  >
                    <option value="$">$ - Cheap</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                    <option value="$$$$">$$$$ - Very Expensive</option>
                  </select>
                </div>
              </div>

              {/* Multi-select Cuisine Dropdown */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Cuisines (Select Multiple)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCuisineDropdown(!showCuisineDropdown)}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none flex justify-between items-center"
                  >
                    <span className="text-gray-600">
                      {getSelectedCuisineNames()}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform ${
                        showCuisineDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showCuisineDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {cuisines.length > 0 ? (
                        cuisines.map((cuisine) => (
                          <label
                            key={cuisine.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.cuisineIds.includes(cuisine.id)}
                              onChange={() => handleCuisineToggle(cuisine.id)}
                              className="mr-3 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-gray-700">
                              {cuisine.name}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="p-3 text-gray-400 text-sm">
                          No cuisines available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Area
                  </label>
                  <input
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g. Thamel"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg mt-4"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Restaurant"
                    : "Create Restaurant"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;
