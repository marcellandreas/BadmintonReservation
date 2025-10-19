"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";

const DashboardPage = () => {
  const { axios, getToken } = useAppContext();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalCourts: 0,
    totalTimeSlots: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch all bookings
      const bookingsRes = await axios.get("/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch courts
      const courtsRes = await axios.get("/api/court");

      // Fetch timeslots
      const timeslotsRes = await axios.get("/api/timeslot");

      const bookings = bookingsRes.data.data || [];
      const courts = courtsRes.data.data || [];
      const timeslots = timeslotsRes.data.data || [];

      console.log("booking", bookings);
      console.log("courts", courts);
      console.log("timeslots", timeslots);

      // Calculate stats
      const totalRevenue = bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        confirmedBookings: bookings.filter((b) => b.status === "confirmed")
          .length,
        totalRevenue,
        totalCourts: courts.length,
        totalTimeSlots: timeslots.length,
      });

      // Get recent 5 bookings
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );

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
          Dashboard Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FaCalendarCheck}
            title="Total Bookings"
            value={stats.totalBookings}
            color="bg-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={FaClock}
            title="Pending Bookings"
            value={stats.pendingBookings}
            color="bg-yellow-500"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={FaUsers}
            title="Confirmed Bookings"
            value={stats.confirmedBookings}
            color="bg-green-500"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={FaMoneyBillWave}
            title="Total Revenue"
            value={`Rp ${stats.totalRevenue.toLocaleString()}`}
            color="bg-purple-500"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={MdSportsTennis}
            title="Total Courts"
            value={stats.totalCourts}
            color="bg-red-500"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={FaClock}
            title="Total Time Slots"
            value={stats.totalTimeSlots}
            color="bg-indigo-500"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      #{booking._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      Rp {booking.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
