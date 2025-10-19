"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { GiShuttlecock } from "react-icons/gi";
import { MdOutlineHome } from "react-icons/md";
import { TbTexture } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";

const BookingPage = () => {
  const { axios, getToken } = useAppContext();

  // State Management
  const [selectedDate, setSelectedDate] = useState(null);
  const [courts, setCourts] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Array of { courtId, timeSlotId, courtName, timeRange, price }
  const [loading, setLoading] = useState(false);

  // Generate dates for next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date) =>
    date.toLocaleDateString("id-ID", { weekday: "long" });
  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const toDateValue = (date) => date.toISOString().split("T")[0];

  // Fetch courts and timeslots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchCourtsAndTimeSlots();
    }
  }, [selectedDate]);

  const fetchCourtsAndTimeSlots = async () => {
    try {
      setLoading(true);

      // Fetch all courts
      const courtsRes = await axios.get("/api/court");

      // Fetch timeslots with availability info for selected date
      const timeSlotsRes = await axios.get(
        `/api/timeslot/available?date=${selectedDate}`
      );

      setCourts(courtsRes.data.data || []);
      setTimeSlots(timeSlotsRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load courts and timeslots");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Check if court-timeslot combination is already selected
  const isItemSelected = (courtId, timeSlotId) => {
    return selectedItems.some(
      (item) => item.courtId === courtId && item.timeSlotId === timeSlotId
    );
  };

  // Check if court-timeslot combination is already booked
  const isItemBooked = async (courtId, timeSlotId) => {
    try {
      const res = await axios.get(
        `/api/court/available?date=${selectedDate}&timeSlotId=${timeSlotId}`
      );
      const availableCourts = res.data.data || [];
      return !availableCourts.some((court) => court._id === courtId);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Add item to cart
  const handleAddItem = (court, timeSlot) => {
    if (isItemSelected(court._id, timeSlot._id)) {
      toast.error("Item already added");
      return;
    }

    const newItem = {
      courtId: court._id,
      timeSlotId: timeSlot._id,
      courtName: court.name,
      timeRange: `${timeSlot.startTime} - ${timeSlot.endTime}`,
      price: timeSlot.price,
    };

    setSelectedItems([...selectedItems, newItem]);
    toast.success("Item added to booking");
  };

  // Remove item from cart
  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
    toast.success("Item removed");
  };

  // Calculate total price
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // Submit booking
  const handleSubmitBooking = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please select at least one court and timeslot");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        bookingDate: selectedDate,
        items: selectedItems.map((item) => ({
          courtId: item.courtId,
          timeSlotId: item.timeSlotId,
          price: item.price,
        })),
        notes: "",
      };

      console.log(bookingData, "data");

      const token = await getToken();
      console.log("Booking Data Sent:", JSON.stringify(bookingData, null, 2));
      console.log("Token", token);

      const response = await axios.post("/api/booking", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Booking created successfully!");

        // Redirect to payment or booking detail page
        // window.location.href = `/payment/${response.data.data._id}`;

        // Or reset form
        setSelectedItems([]);
        setSelectedDate(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Book Your Court</h1>

        {/* Step 1: Select Date */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Date</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {days.map((date, index) => {
              const dateValue = toDateValue(date);
              const isSelected = selectedDate === dateValue;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(dateValue)}
                  className={`min-w-[100px] text-center border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 scale-105"
                      : "border-gray-300 bg-white hover:border-indigo-300"
                  }`}
                >
                  <h5 className="text-sm font-semibold text-gray-700 capitalize">
                    {formatDay(date)}
                  </h5>
                  <span className="text-xs text-gray-600">
                    {formatDate(date)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Custom date picker */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-gray-600">Or select custom date:</span>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={toDateValue(new Date())}
              max={(() => {
                const d = new Date();
                d.setMonth(d.getMonth() + 3);
                return toDateValue(d);
              })()}
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate || ""}
            />
          </div>
        </div>

        {/* Step 2: Select Courts & Timeslots */}
        {selectedDate && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Select Courts & Timeslots
            </h2>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-8">
                {courts.map((court) => (
                  <div key={court._id} className="border rounded-xl p-6">
                    <div className="flex gap-6 mb-4">
                      <img
                        src={court.image}
                        alt={court.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">
                          {court.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {court.description}
                        </p>
                        <div className="flex flex-col gap-2 text-gray-700 text-sm">
                          <div className="flex items-center gap-2">
                            <GiShuttlecock /> <span>Badminton</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MdOutlineHome /> <span>{court.courtType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TbTexture /> <span>{court.surfaceType}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeslots */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {timeSlots.map((slot) => {
                        const isSelected = isItemSelected(court._id, slot._id);
                        const isBooked = slot.availableCourts === 0;

                        return (
                          <button
                            key={slot._id}
                            onClick={() => handleAddItem(court, slot)}
                            disabled={isBooked || isSelected}
                            className={`p-3 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? "border-green-500 bg-green-50 cursor-not-allowed"
                                : isBooked
                                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                                : "border-indigo-500 bg-white hover:bg-indigo-50 cursor-pointer"
                            }`}
                          >
                            <span className="text-xs text-gray-600">
                              {slot.duration} min
                            </span>
                            <span className="font-bold text-sm">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-sm font-semibold text-indigo-600">
                              {isBooked
                                ? "Booked"
                                : `Rp ${slot.price.toLocaleString()}`}
                            </span>
                            {isSelected && (
                              <span className="text-xs text-green-600 mt-1">
                                ✓ Added
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {selectedItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 3: Review Your Booking
            </h2>

            <div className="space-y-3 mb-6">
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.courtName}</h4>
                    <p className="text-sm text-gray-600">{item.timeRange}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-indigo-600">
                      Rp {item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleSubmitBooking}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selectedDate && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Please select a date to start booking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
