import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        🏠<br />홈
      </NavLink>

      <NavLink to="/lost/list" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        📋<br />목록
      </NavLink>

      <div className="plus-popup-wrapper">
        <button className="small-plus" onClick={toggleMenu}>＋</button>
        {menuOpen && (
          <div className="popup-menu">
            <button onClick={() => goTo("/lost/create")}>분실물 등록</button>
            <button onClick={() => goTo("/found/create")}>습득물 등록</button>
          </div>
        )}
      </div>

      <NavLink to="/lost/create" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        ➕<br />등록
      </NavLink>

      <NavLink to="/my" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        👤<br />내정보
      </NavLink>
    </nav>
  );
}