import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/history">History</Link></li>
      <li><Link to="/analytics">Analytics</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
