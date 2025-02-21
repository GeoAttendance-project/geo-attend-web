import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/admin/attendance-location`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLocations(res.data.data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

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

  const handleSubmit = () => {
    const locationData = {
      department: form.department,
      year: form.year,
      geoLocation: {
        type: "Point",
        coordinates: [Number(form.latitude), Number(form.longitude)],
      },
    };

    if (editMode) {
      axios
        .put(
          `${API_URL}/api/v1/admin/attendance-location/${selectedLocation._id}`,
          locationData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setLocations(
            locations.map((loc) =>
              loc._id === selectedLocation._id
                ? { ...loc, ...locationData }
                : loc
            )
          );
          setModalOpen(false);
        })
        .catch((err) => console.error("Error updating location:", err));
    } else {
      axios
        .post(`${API_URL}/api/v1/admin/attendance-location`, locationData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setLocations([...locations, res.data.data]);
          setModalOpen(false);
        })
        .catch((err) => console.error("Error adding location:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      axios
        .delete(`${API_URL}/api/v1/admin/attendance-location/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setLocations(locations.filter((loc) => loc._id !== id)))
        .catch((err) => console.error("Error deleting location:", err));
    }
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Attendance Location
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openLocationModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          + Add Location
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">Department</th>
              <th className="p-4">Year</th>
              <th className="p-4">Longitude</th>
              <th className="p-4">Latitude</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className=" hover:bg-gray-50">
                <td className="p-4">{loc.department}</td>
                <td className="p-4">{loc.year}</td>
                <td className="p-4">{loc.geoLocation.coordinates[0]}</td>
                <td className="p-4">{loc.geoLocation.coordinates[1]}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => openLocationModal(loc)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {editMode ? "Edit Location" : "Add Location"}
            </h3>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder="Latitude"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="Longitude"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-2"
            >
              {editMode ? "Update Location" : "Add Location"}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
