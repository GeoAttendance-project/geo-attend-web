import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};
