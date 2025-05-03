import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        🏠<br/>홈
      </NavLink>
      <NavLink to="/lost/list" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        📋<br/>목록
      </NavLink>
      <NavLink to="/lost/create" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        ➕<br/>등록
      </NavLink>
      <NavLink to="/my" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        👤<br/>내 정보
      </NavLink>
    </nav>
  );
}
