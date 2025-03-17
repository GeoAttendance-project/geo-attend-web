import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // For search functionality
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    examNo: "",
    department: "",
    year: "",
  });
  const [filters, setFilters] = useState({
    department: "IT",
    year: "4",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const token = localStorage.getItem("token");

  // Predefined options for department and year
  const departmentOptions = ["IT"];
  const yearOptions = [2, 3, 4];

  useEffect(() => {
    fetchStudents();
  }, []); // Fetch students on initial load

  useEffect(() => {
    // Ensure students is defined and is an array
    if (!Array.isArray(students)) return;
  
    const filtered = students.filter((student) => {
      const name = student?.name?.toLowerCase() || "";
      const examNo = student?.examNo?.toLowerCase() || "";
      return name.includes(searchQuery.toLowerCase()) || examNo.includes(searchQuery.toLowerCase());
    });
  
    setFilteredStudents(filtered);
  }, [searchQuery, students]);
  
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/student`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          department: filters.department,
          year: filters.year,
        },
      });
      setStudents(response.data.data);
      setFilteredStudents(response.data.data); // Initialize filteredStudents with all students
    } catch (error) {
      console.error("Error fetching students:", error);
      setErrorMessage("Failed to fetch students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const handleFilterSubmit = () => {
    fetchStudents(); // Call API with updated filters
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  const validate = () => {
    let tempErrors = {};
    if (!newStudent.name.trim()) tempErrors.name = "Name is required";
    if (!newStudent.email.trim()) tempErrors.email = "Email is required";
    if (!newStudent.examNo.trim()) tempErrors.examNo = "Exam No is required";
    if (!newStudent.department.trim())
      tempErrors.department = "Department is required";
    if (!newStudent.year) tempErrors.year = "Year is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const addOrEditStudent = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const url = studentToEdit
        ? `${API_URL}/api/v1/admin/student/${studentToEdit._id}`
        : `${API_URL}/api/v1/admin/student`;
      const method = studentToEdit ? "put" : "post";
      const response = await axios({
        method,
        url,
        data: newStudent,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (studentToEdit) {
        setStudents(
          students.map((s) => (s._id === response.data._id ? response.data : s))
        );
      } else {
        setStudents([...students, response.data]);
      }
      setIsModalOpen(false);
      setStudentToEdit(null);
      setNewStudent({
        name: "",
        email: "",
        examNo: "",
        department: "",
        year: "",
      });
      setErrors({});
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      setErrorMessage("Failed to save student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/v1/admin/student/${studentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(
        students.filter((student) => student._id !== studentToDelete)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      setErrorMessage("Failed to delete student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Management</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* Filter Inputs */}
      <div className="flex space-x-4 mb-6">
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange(e, "department")}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Department</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={filters.year}
          onChange={(e) => handleFilterChange(e, "year")}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilterSubmit}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Applying Filters..." : "Apply Filters"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or exam number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={() => {
          setNewStudent({
            name: "",
            email: "",
            examNo: "",
            department: "",
            year: "",
          });
          setIsModalOpen(true);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition duration-300 mb-6"
      >
        Add Student
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">

          <p className="text-gray-600 text-lg">No students found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.examNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setNewStudent(student);
                          setStudentToEdit(student);
                          setIsModalOpen(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setStudentToDelete(student._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-xl font-bold mb-4">
                {studentToEdit ? "Edit Student" : "Add Student"}
              </h2>
              {Object.keys(errors).map((key) => (
                <p key={key} className="text-red-500 text-sm">
                  {errors[key]}
                </p>
              ))}
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Exam No"
                value={newStudent.examNo}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, examNo: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newStudent.department}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, department: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={newStudent.year}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, year: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={addOrEditStudent}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full transition duration-300"
              >
                {studentToEdit ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-2 text-red-500 hover:text-red-600 w-full"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete this student?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteStudent}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};