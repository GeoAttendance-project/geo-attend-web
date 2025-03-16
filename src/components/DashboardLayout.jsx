import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50">
        <Sidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};