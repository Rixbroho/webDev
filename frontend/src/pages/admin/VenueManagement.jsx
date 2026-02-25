import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, MapPin, Star, Search, X } from "lucide-react";
import {
  createRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
} from "../../services/api";
import { toast } from "react-toastify";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cuisine: "Italian",
    priceRange: "$$",
    rating: 5.0,
    description: "",
    phone: "",
    email: "",
    image: "🍽️",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const response = await getAllRestaurants();
      if (response.data.success) {
        setRestaurants(response.data.restaurants);
      }
    } catch (error) {
      toast.error("Failed to load restaurants");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleEditClick = (restaurant) => {
    setIsEditing(true);
    setCurrentRestaurantId(restaurant.id);
    setFormData({
      name: restaurant.name,
      location: restaurant.location,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      rating: restaurant.rating,
      description: restaurant.description || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      image: restaurant.image || "🍽️",
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
          fetchRestaurants();
        }
      } catch (error) {
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.priceRange) {
      toast.warn("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("location", formData.location);
      submitData.append("cuisine", formData.cuisine);
      submitData.append("priceRange", formData.priceRange);
      submitData.append("rating", formData.rating);
      submitData.append("description", formData.description);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let response;
      if (isEditing) {
        response = await updateRestaurant(currentRestaurantId, submitData);
      } else {
        response = await createRestaurant(submitData);
      }

      if (response.data.success) {
        toast.success(isEditing ? "Restaurant updated!" : "Restaurant added!");
        closeModal();
        fetchRestaurants();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentRestaurantId(null);
    setFormData({
      name: "",
      location: "",
      cuisine: "Italian",
      priceRange: "$$",
      rating: 5.0,
      description: "",
      phone: "",
      email: "",
      image: "🍽️",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Manage Restaurants
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 flex items-center gap-2 font-bold transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Add Restaurant</span>
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group relative"
            >
              <div className="h-28 bg-orange-50 flex items-center justify-center text-5xl overflow-hidden">
                {restaurant.image && restaurant.image.startsWith("/uploads") ? (
                  <img
                    src={`http://localhost:3000${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  restaurant.image || "🍽️"
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(restaurant)}
                    className="p-2 bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(restaurant.id)}
                    className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {restaurant.name}
                </h3>
                <p className="text-xs font-bold text-orange-600 uppercase mb-2">
                  {restaurant.cuisine}
                </p>
                <div className="flex items-start gap-2 mb-4 text-gray-600">
                  <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{restaurant.location}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-lg font-black text-gray-900">
                    {restaurant.priceRange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl">
            <div className="bg-orange-500 p-8 text-white">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold">
                {isEditing ? "Edit Restaurant" : "New Restaurant"}
              </h3>
              <p className="opacity-80 text-sm">
                Add restaurant details for your users.
              </p>
            </div>

            <div className="p-8 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Restaurant Image
                  </label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-3">
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Cuisine
                    </label>
                    <select
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    >
                      <option value="Italian">Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Indian">Indian</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Japanese">Japanese</option>
                      <option value="American">American</option>
                      <option value="Thai">Thai</option>
                      <option value="French">French</option>
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
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                      <option value="$$$$">$$$$ (Fine Dining)</option>
                    </select>
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
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    rows="2"
                  ></textarea>
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
                      type="text"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg mt-4"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Restaurant"
                    : "Create Restaurant"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
