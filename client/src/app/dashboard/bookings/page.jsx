"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

const BookingsManagementPage = () => {
  const { axios, getToken } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get("/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("jalan ");

      console.log("fecth admin booking", response.data);

      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filter));
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `/api/booking/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking status updated");
        fetchBookings();
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const updatePaymentStatus = async (bookingId, newStatus) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `/api/booking/${bookingId}/payment`,
        { paymentStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Payment status updated");
        fetchBookings();
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Failed to update payment status");
      console.error(error);
    }
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filter, bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Bookings Management
        </h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            {["all", "pending", "confirmed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status} (
                {
                  bookings.filter(
                    (b) => status === "all" || b.status === status
                  ).length
                }
                )
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      #{booking._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.user}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.items.length} items
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      Rp {booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-semibold">#{selectedBooking._id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-semibold">{selectedBooking.user}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Booked Items</p>
                    <div className="space-y-2">
                      {selectedBooking.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-semibold">
                            {item.court?.name || "Court"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.timeSlot?.startTime} -{" "}
                            {item.timeSlot?.endTime}
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            Rp {item.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-blue-600">
                      Rp {selectedBooking.totalPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-3">Update Status</p>
                    <div className="flex gap-3 flex-wrap">
                      {selectedBooking.status !== "confirmed" && (
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              selectedBooking._id,
                              "confirmed"
                            )
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                          <FaCheck /> Confirm
                        </button>
                      )}
                      {selectedBooking.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              selectedBooking._id,
                              "cancelled"
                            )
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                      )}
                      {selectedBooking.paymentStatus !== "paid" && (
                        <button
                          onClick={() =>
                            updatePaymentStatus(selectedBooking._id, "paid")
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManagementPage;
