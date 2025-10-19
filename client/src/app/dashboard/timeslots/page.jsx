"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaClock } from "react-icons/fa";

const TimeSlotsManagementPage = () => {
  const { axios, getToken } = useAppContext();
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    duration: 60,
    price: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/timeslot");
      if (response.data.success) {
        setTimeSlots(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch timeslots");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openCreateModal = () => {
    setEditingSlot(null);
    setFormData({
      startTime: "",
      endTime: "",
      duration: 60,
      price: "",
      isAvailable: true,
    });
    setShowModal(true);
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      price: slot.price,
      isAvailable: slot.isAvailable,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const slotData = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
      };

      if (editingSlot) {
        // Update
        const response = await axios.put(
          `/api/timeslot/${editingSlot._id}`,
          slotData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          toast.success("TimeSlot updated successfully");
        }
      } else {
        // Create
        const response = await axios.post("/api/timeslot", slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          toast.success("TimeSlot created successfully");
        }
      }

      setShowModal(false);
      fetchTimeSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save timeslot");
      console.error(error);
    }
  };

  const handleDelete = async (slotId) => {
    if (!confirm("Are you sure you want to delete this timeslot?")) return;

    try {
      const token = await getToken();
      const response = await axios.delete(`/api/timeslot/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("TimeSlot deleted successfully");
        fetchTimeSlots();
      }
    } catch (error) {
      toast.error("Failed to delete timeslot");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            TimeSlots Management
          </h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Add TimeSlot
          </button>
        </div>

        {/* TimeSlots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <div key={slot._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <FaClock className="text-blue-500 text-2xl" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    slot.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {slot.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="text-sm text-gray-600">
                  {slot.duration} minutes
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xl font-bold text-blue-600">
                  Rp {slot.price.toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(slot)}
                  className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-1 text-sm"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(slot._id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-1 text-sm"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingSlot ? "Edit TimeSlot" : "Add New TimeSlot"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="30"
                      step="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rp)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Available
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                    >
                      {editingSlot ? "Update TimeSlot" : "Create TimeSlot"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotsManagementPage;
