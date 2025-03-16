import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from "recharts";
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Transform studentsByYear object into an array for the BarChart
  const studentsByYearArray = dashboardData.studentsByYear
    ? Object.keys(dashboardData.studentsByYear).map((year) => ({
        _id: year,
        count: dashboardData.studentsByYear[year],
      }))
    : [];

  // Transform studentsByDepartment object into an array for the PieChart
  const studentsByDepartmentArray = dashboardData.studentsByDepartment
    ? Object.keys(dashboardData.studentsByDepartment).map((department) => ({
        name: department,
        count: dashboardData.studentsByDepartment[department],
      }))
    : [];

  // Transform todaysAttendance object into an array for the Grouped Bar Chart
  const todaysAttendanceArray = dashboardData.todaysAttendance
    ? Object.keys(dashboardData.todaysAttendance).map((year) => {
        const yearNumber = year.split("_")[1]; // Extract year number (e.g., "year_2" -> "2")
        const totalStudents = dashboardData.studentsByYear[year] || 0; // Get total students for the year
        return {
          year: yearNumber,
          morning: dashboardData.todaysAttendance[year].morning,
          afternoon: dashboardData.todaysAttendance[year].afternoon,
          totalStudents: totalStudents, // Include total students
        };
      })
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Today's Attendance Report Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Today's Attendance Report
        </h2>
        <BarChart
          width={window.innerWidth > 768 ? 800 : 350}
          height={300}
          data={todaysAttendanceArray}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="morning" fill="#0088FE" name="Morning Attendance" />
          <Bar dataKey="afternoon" fill="#00C49F" name="Afternoon Attendance" />
          <Bar dataKey="totalStudents" fill="#FF8042" name="Total Students" />
        </BarChart>
      </div>

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
            {studentsByYearArray.map((item) => (
              <li key={item._id} className="text-gray-700">
                <span className="font-medium">Year {item._id.split("_")[1]}:</span>{" "}
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
            width={window.innerWidth > 768 ? 500 : 350}
            height={300}
            data={studentsByYearArray}
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
          <PieChart width={window.innerWidth > 768 ? 500 : 350} height={300}>
            <Pie
              data={studentsByDepartmentArray}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              label
            >
              {studentsByDepartmentArray.map((entry, index) => (
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