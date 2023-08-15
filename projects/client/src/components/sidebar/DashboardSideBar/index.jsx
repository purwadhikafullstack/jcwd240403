import { useState } from "react";
import MobileSidebar from "./MobileSideBar";
import DesktopSideBar from "./DesktopSideBar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { selectCurrentUser } from "../../../store/auth/authSlice";
import { useSelector } from "react-redux";

export default function DashboardSideBar() {
  const user = useSelector(selectCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(user?.role === "TENANT", user?.role);

  return user?.role === "TENANT" ? (
    <div>
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Static sidebar for desktop */}
      <DesktopSideBar />
      <TopBar openSideBar={() => setSidebarOpen(true)} />
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  ) : (
    <Outlet />
  );
}
