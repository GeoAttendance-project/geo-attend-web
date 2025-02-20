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

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/login";

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentsManagement />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/attendance-location" element={<AttendanceLocation />} />
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
