import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/v1/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(response.data.data.admins);
      } catch (err) {
        setError("Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(API_URL, newAdmin, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins([...admins, response.data]);
      setNewAdmin({ firstName: "", lastName: "", email: "", username: "" });
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      setError("Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Management</h2>

      {/* Display Errors */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Admin List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mb-4">
          {admins.map((admin, index) => (
            <li key={index} className="border p-2 mb-2 rounded">
              {admin.firstName} {admin.lastName} ({admin.username})
            </li>
          ))}
        </ul>
      )}

      {/* Add Admin Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
      >
        Add Admin
      </button>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Admin</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newAdmin.firstName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newAdmin.lastName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={newAdmin.username}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
