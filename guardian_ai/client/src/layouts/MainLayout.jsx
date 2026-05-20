import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => (
  <div className="layout">
    <Navbar />
    <div className="layout-body">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  </div>
);

export default MainLayout;
