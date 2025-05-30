// src/components/NavBar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/NavBar.css";

export default function NavBar() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* 중앙 고정된 +버튼 */}
      <div className="fab-fixed-area">
        <button className="fab-button" onClick={toggleMenu}>＋</button>
        {menuOpen && (
          <div className="popup-menu">
            <button onClick={() => goTo("/lost/create")}>{t("navCreateLost")}</button>
            <button onClick={() => goTo("/lost-request")}>{t("navCreateFound")}</button>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          🏠<br />{t("navHome")}
        </NavLink>

        <NavLink to="/lost/list" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          📋<br />{t("navLost")}
        </NavLink>

        <div className="nav-item spacer"></div> {/* 가운데 간격 확보용 */}

        <NavLink to="/requests" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          📮<br />{t("navRequests")}
        </NavLink>

        <NavLink to="/my" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          👤<br />{t("navMy")}
        </NavLink>
      </nav>
    </>
  );
}
