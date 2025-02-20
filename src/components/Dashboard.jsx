import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
const API_URL = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-5">Loading...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard</h1>

      {/* Grid Layout for Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Students Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.totalStudents}
          </p>
        </div>

        {/* Total Attendance Locations Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Attendance Locations
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData.totalAttendanceLocations}
          </p>
        </div>

        {/* Students by Year Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Students by Year
          </h2>
          <ul className="space-y-2">
            {dashboardData.studentsByYear.map((item) => (
              <li key={item._id} className="text-gray-700">
                <span className="font-medium">Year {item._id}:</span>{" "}
                <span className="font-bold text-blue-600">{item.count}</span>{" "}
                students
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart for Students by Year */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Students Distribution by Year
          </h2>
          <BarChart
            width={500}
            height={300}
            data={dashboardData.studentsByYear}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart for Students by Department */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Students Distribution by Department
          </h2>
          <PieChart width={500} height={300}>
            <Pie
              data={dashboardData.studentsByDepartment}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              label
            >
              {dashboardData.studentsByDepartment.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};