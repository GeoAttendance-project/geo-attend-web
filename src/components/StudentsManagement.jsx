import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
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
  const token = localStorage.getItem("token");

  // Predefined options for department and year
  const departmentOptions = ["IT"];
  const yearOptions = [2, 3, 4];

  useEffect(() => {
    fetchStudents();
  }, []); // Fetch students on initial load

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
    <div className="p-5 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Student Management
      </h2>
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
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition duration-300 my-3"
      >
        Add Student
      </button>
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Exam No</th>
                <th className="p-4 font-semibold text-gray-700">Department</th>
                <th className="p-4 font-semibold text-gray-700">Year</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className=" hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-4 text-gray-700">{student.name}</td>
                  <td className="p-4 text-gray-700">{student.email}</td>
                  <td className="p-4 text-gray-700">{student.examNo}</td>
                  <td className="p-4 text-gray-700">{student.department}</td>
                  <td className="p-4 text-gray-700">{student.year}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setNewStudent(student);
                        setStudentToEdit(student);
                        setIsModalOpen(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setStudentToDelete(student._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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