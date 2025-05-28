// src/pages/SettingsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>⚙️ 설정</h2>

      <div style={cardStyle} onClick={() => navigate("/change-password")}>
        🔑 비밀번호 변경
      </div>

      <div style={cardStyle} onClick={handleLogout}>
        🔓 로그아웃
      </div>

      <div style={{ marginTop: "40px", textAlign: "center", color: "#888", fontSize: "0.9rem" }}>
        ReturnU 설정 페이지
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f5f5f5",
  padding: "16px",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: "bold",
  marginBottom: "12px",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
};
