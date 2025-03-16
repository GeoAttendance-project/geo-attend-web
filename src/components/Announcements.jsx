import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/admin/announcement`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status === "success") {
          setAnnouncements(response.data.data);
        } else {
          throw new Error("Failed to fetch announcements");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handlePostAnnouncement = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/admin/announcement`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (response.data.status === "success") {
        setAnnouncements([...announcements, response.data.data]);
        setTitle("");
        setContent("");
        setIsModalOpen(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

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
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
        >
          Post Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076388.png"
              alt="No announcements"
              className="w-24 h-24 mb-4"
            />
            <p className="text-gray-600 text-lg">No announcements available.</p>
          </div>
        ) : (
          announcements.map(({ _id, title, content, createdAt }) => (
            <div
              key={_id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500"
            >
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 mt-2">{content}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Post Announcement Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h3 className="text-xl font-semibold mb-4">Post Announcement</h3>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostAnnouncement}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};