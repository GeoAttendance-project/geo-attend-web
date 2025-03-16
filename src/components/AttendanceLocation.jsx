import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

export const AttendanceLocation = () => {
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({
    department: "",
    year: "",
    latitude: "",
    longitude: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/attendance-location`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(response.data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setErrorMessage("Failed to fetch locations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openLocationModal = (location = null) => {
    if (location) {
      setForm({
        department: location.department,
        year: location.year,
        latitude: location.geoLocation.coordinates[1],
        longitude: location.geoLocation.coordinates[0],
      });
      setEditMode(true);
      setSelectedLocation(location);
    } else {
      setForm({ department: "", year: "", latitude: "", longitude: "" });
      setEditMode(false);
    }
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const locationData = {
      department: form.department,
      year: form.year,
      geoLocation: {
        type: "Point",
        coordinates: [Number(form.longitude), Number(form.latitude)],
      },
    };

    setIsLoading(true);
    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/api/v1/admin/attendance-location/${selectedLocation._id}`,
          locationData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocations(
          locations.map((loc) =>
            loc._id === selectedLocation._id ? { ...loc, ...locationData } : loc
          )
        );
      } else {
        const response = await axios.post(
          `${API_URL}/api/v1/admin/attendance-location`,
          locationData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocations([...locations, response.data.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving location:", err);
      setErrorMessage("Failed to save location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/api/v1/admin/attendance-location/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(locations.filter((loc) => loc._id !== id));
      } catch (err) {
        console.error("Error deleting location:", err);
        setErrorMessage("Failed to delete location. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Attendance Location
      </h2>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button
          onClick={() => openLocationModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
        >
          + Add Location
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">

          <p className="text-gray-600 text-lg">No locations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locations.map((loc) => (
                <tr key={loc._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loc.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loc.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loc.geoLocation.coordinates[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loc.geoLocation.coordinates[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openLocationModal(loc)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc._id)}
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

      {/* Add/Edit Location Modal */}
      <AnimatePresence>
        {modalOpen && (
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
              <h3 className="text-xl font-semibold mb-4 text-center">
                {editMode ? "Edit Location" : "Add Location"}
              </h3>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department"
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-2 transition duration-300"
              >
                {editMode ? "Update Location" : "Add Location"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full mt-2 transition duration-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};