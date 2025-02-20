import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filters, setFilters] = useState({
    department: "IT",
    year: "4",
    date: new Date().toISOString().split("T")[0],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/admin/attendance`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setAttendanceData(response.data.data))
      .catch((error) => console.error("Error fetching attendance data", error));
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Attendance Management
      </h1>

      {/* Filter Section */}
      <div className="w-full max-w-4xl mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
          <div className="flex space-x-4">
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IT">IT</option>
            </select>

            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              max={new Date().toISOString().split("T")[0]} // Sets max date to today
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Attendance List
          </h2>
          {attendanceData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-3 text-gray-600">Name</th>
                  <th className="p-3 text-gray-600">Roll No</th>
                  <th className="p-3 text-gray-600">Department</th>
                  <th className="p-3 text-gray-600">Year</th>
                  <th className="p-3 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((student) => (
                  <tr
                    key={student.rollNo}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-gray-700">{student.name}</td>
                    <td className="p-3 text-gray-700">{student.rollNo}</td>
                    <td className="p-3 text-gray-700">{student.department}</td>
                    <td className="p-3 text-gray-700">{student.year}</td>
                    <td
                      className={`p-3 font-semibold ${
                        student.present ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {student.present ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-4">
              No attendance data found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
