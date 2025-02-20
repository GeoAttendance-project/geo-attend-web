import axios from "axios";
import { useEffect, useState } from "react";
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

  if (loading) return <h2 className="p-5">Loading...</h2>;
  if (error) return <h2 className="p-5 text-red-500">Error: {error}</h2>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Announcements</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
        >
          Post Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          announcements.map(({ _id, title, content, createdAt }) => (
            <div
              key={_id}
              className="p-4 bg-white shadow rounded-lg border-l-4 border-blue-600"
            >
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 mt-2">{content}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Post Announcement</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePostAnnouncement}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
