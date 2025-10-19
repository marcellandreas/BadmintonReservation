"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FaCalendar, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const MyBookingsPage = () => {
  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, cancelled

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await axios.get("/api/booking/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = await getToken();

      const response = await axios.put(
        `/api/booking/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="bg-neutral-800 rounded-2xl shadow-md p-2 mb-8 flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold capitalize transition-all duration-200 ${
                filter === status
                  ? "bg-red-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-neutral-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-neutral-400">No bookings found</p>
            <button
              onClick={() => (window.location.href = "/booking")}
              className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
            >
              Make a Booking
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-neutral-800 rounded-2xl shadow-lg overflow-hidden border border-neutral-700"
              >
                {/* Header */}
                <div className="bg-neutral-900 text-white p-6 border-b border-neutral-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Booking #{booking._id.slice(-6)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <FaCalendar />
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-500">
                        Rp {booking.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {booking.items.length} item(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Status Badges */}
                  <div className="flex gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Booking Items */}
                  <div className="space-y-3 mb-4">
                    {booking.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-neutral-700/50 rounded-xl"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-lg font-semibold text-white">
                            <FaMapMarkerAlt className="text-red-500" />
                            {item.court.name}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-400 mt-1">
                            <FaClock />
                            {item.timeSlot.startTime} - {item.timeSlot.endTime}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">
                            {item.court.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-500">
                            Rp {item.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {item.timeSlot.duration} minutes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-neutral-700 pt-4">
                    {booking.status === "pending" &&
                      booking.paymentStatus === "unpaid" && (
                        <>
                          <button
                            onClick={() =>
                              (window.location.href = `/payment/${booking._id}`)
                            }
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-6 py-3 bg-neutral-700 text-neutral-200 rounded-xl font-semibold hover:bg-neutral-600 transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                    {booking.status === "confirmed" && (
                      <div className="flex-1 text-center py-3 bg-green-700/20 text-green-400 rounded-xl font-semibold">
                        ✓ Booking Confirmed
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="flex-1 text-center py-3 bg-neutral-700 text-neutral-400 rounded-xl font-semibold">
                        Booking Cancelled
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  {booking.paidAt && (
                    <div className="mt-4 p-3 bg-green-800/20 rounded-xl text-sm">
                      <span className="text-green-400 font-semibold">
                        Paid at:{" "}
                        {new Date(booking.paidAt).toLocaleString("id-ID")}
                      </span>
                      {booking.transactionId && (
                        <span className="text-neutral-400 ml-4">
                          Transaction ID: {booking.transactionId}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-blue-800/20 rounded-xl text-sm">
                      <span className="font-semibold text-blue-300">
                        Notes:{" "}
                      </span>
                      <span className="text-blue-200">{booking.notes}</span>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-4 text-xs text-neutral-500 text-right">
                    Created:{" "}
                    {new Date(booking.createdAt).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
