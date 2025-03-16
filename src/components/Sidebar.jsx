import { Link, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64  min-h-screen p-6 border-r border-gray-200 flex flex-col justify-between shadow-lg">
      {/* Top Section */}
      <div>
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-8">
          <img
            src="https://i.ibb.co/JRrGxpf3/images.jpg" // Replace with your profile image URL
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">CSI College of Engineering</p>

          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">📊</span>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/attendance"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">🗓️</span>
                <span className="text-sm font-medium">Attendance Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/attendance-location"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">📍</span>
                <span className="text-sm font-medium">Attendance Location</span>
              </Link>
            </li>
            <li>
              <Link
                to="/students"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">🎓</span>
                <span className="text-sm font-medium">Student Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/announcements"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">📢</span>
                <span className="text-sm font-medium">Announcements</span>
              </Link>
            </li>
            <li>
              <Link
                to="/device-change"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">📱</span>
                <span className="text-sm font-medium">Device Change</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="flex items-center p-3 text-gray-700 hover:bg-blue-100 rounded-lg transition-all duration-200"
              >
                <span className="mr-3">👨🏻‍💻</span>
                <span className="text-sm font-medium">Admin</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center p-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
      >
        <span className="mr-2">🚪</span>
        Logout
      </button>
    </div>
  );
};