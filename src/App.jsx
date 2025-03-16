import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { StudentsManagement } from "./components/StudentsManagement";
import { Sidebar } from "./components/Sidebar";
import { AttendanceManagement } from "./components/AttendanceManagement";
import { Announcements } from "./components/Announcements";
import { Login } from "./components/Login";
import { AttendanceLocation } from "./components/AttendanceLocation";
import { AdminManagement } from "./components/AdminManagement";
import DeviceChangeRequests from "./components/DeviceChangeRequets";

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/login";

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" />;
  }
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar (hidden on login page) */}
      {!isLoginPage && (
        <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50">
          <Sidebar />
        </div>
      )}

      {/* Scrollable Main Content */}
      <div className={`flex-1 ${!isLoginPage ? "ml-64" : ""} overflow-y-auto`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentsManagement />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/attendance-location" element={<AttendanceLocation />} />
          <Route path="/device-change" element={<DeviceChangeRequests />} />
          <Route path="/admin" element={<AdminManagement />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;