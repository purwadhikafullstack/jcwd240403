import React from "react";
import DashboardSideBar from "../../components/sidebar/DashboardSideBar";

function Dashboard() {
  return (
    <div className="max-w-none w-screen mx-0">
      <DashboardSideBar>
        <p>Dashboard</p>
      </DashboardSideBar>
    </div>
  );
}

export default Dashboard;
