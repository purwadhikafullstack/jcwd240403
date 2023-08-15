import { useState } from "react";
import MobileSidebar from "./MobileSideBar";
import DesktopSideBar from "./DesktopSideBar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function DashboardSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
  );
}
