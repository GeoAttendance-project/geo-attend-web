import { Link, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white min-h-screen p-4 border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-6">
          <img src="https://i.ibb.co/JRrGxpf3/images.jpg" alt="Logo" className="h-12" />
        </div>
        <nav>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className="block p-2 hover:bg-gray-200">📊 Dashboard</Link></li>
            <li><Link to="/attendance" className="block p-2 hover:bg-gray-200">🗓️ Attendance Management</Link></li>
            <li><Link to="/attendance-location" className="block p-2 hover:bg-gray-200">📍 Attendance Location</Link></li>
            <li><Link to="/students" className="block p-2 hover:bg-gray-200">🎓 Student Management</Link></li>
            <li><Link to="/announcements" className="block p-2 hover:bg-gray-200">📢 Announcements</Link></li>
            <li><Link to="/admin" className="block p-2 hover:bg-gray-200">👨🏻‍💻 Admin</Link></li>
          </ul>
        </nav>
      </div>
      <button 
        onClick={handleLogout} 
        className="mt-4 p-2 text-black border rounded  w-full">
        🚪 Logout
      </button>
    </div>
  );
};
