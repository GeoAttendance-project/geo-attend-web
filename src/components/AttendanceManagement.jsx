import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

export const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filters, setFilters] = useState({
    department: "IT",
    year: "4",
    date: new Date().toISOString().split("T")[0],
    session: "morning",
  });
  const [exportFilter, setExportFilter] = useState("all"); // "all", "present", "absent"
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttendanceData();
  }, [filters]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/attendance`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceData(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance data", error);
      setErrorMessage("Failed to fetch attendance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportFilterChange = (e) => {
    setExportFilter(e.target.value);
  };

  const handleExport = () => {
    let filteredData = attendanceData;

    if (exportFilter === "present") {
      filteredData = attendanceData.filter((student) => student.present);
    } else if (exportFilter === "absent") {
      filteredData = attendanceData.filter((student) => !student.present);
    }

    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }

    const headerRows = [
      ["CSI College of Engineering"],
      [`Department: ${filters.department}`],
      [`Year: ${filters.year}`],
      [`Date: ${filters.date}`],
      [
        `Session: ${
          filters.session.charAt(0).toUpperCase() + filters.session.slice(1)
        }`,
      ],
      [
        `Export Filter: ${
          exportFilter.charAt(0).toUpperCase() + exportFilter.slice(1)
        }`,
      ],
      [""],
      ["Total Students", "Present", "Absent", "Attendance %"],
      [
        filteredData.length,
        filteredData.filter((s) => s.present).length,
        filteredData.filter((s) => !s.present).length,
        `${
          filteredData.length > 0
            ? (
                (filteredData.filter((s) => s.present).length /
                  filteredData.length) *
                100
              ).toFixed(2)
            : 0
        }%`,
      ],
      [""],
      ["Name", "ExamNo", "Department", "Year", "Status"],
    ];

    const studentRows = filteredData.map((student) => [
      student.name,
      student.examNo,
      student.department,
      student.year,
      student.present ? "Present" : "Absent",
    ]);

    const fullData = [...headerRows, ...studentRows];

    const worksheet = XLSX.utils.aoa_to_sheet(fullData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      file,
      `attendance_${filters.date}_${filters.session}_${exportFilter}.xlsx`
    );
  };

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter((s) => s.present).length;
  const absentCount = totalStudents - presentCount;
  const attendancePercentage =
    totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(2) : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CSI College of Engineering
        </h1>
        <h2 className="text-xl text-gray-700 font-medium">
          Department of {filters.department} | Year {filters.year}
        </h2>
        <p className="text-gray-600">
          Date: {filters.date} | Session:{" "}
          {filters.session.charAt(0).toUpperCase() + filters.session.slice(1)}
        </p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
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
              max={new Date().toISOString().split("T")[0]}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="session"
              value={filters.session}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>

          {/* Export Filter Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Filter
            </label>
            <select
              value={exportFilter}
              onChange={handleExportFilterChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
            >
              <option value="all">All</option>
              <option value="present">Only Present</option>
              <option value="absent">Only Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      {attendanceData.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalStudents}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {presentCount}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Attendance %</p>
              <p className="text-2xl font-bold text-indigo-600">
                {attendancePercentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Attendance List
            </h2>
            <button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            >
              Export to Excel
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : attendanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceData.map((student) => (
                    <tr
                      key={student.rollNo}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            student.present
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-600 text-lg">No attendance data found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
