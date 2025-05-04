import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("먼저 로그인해주세요.");
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleDelete = async () => {
    const id = prompt("삭제할 분실물 ID를 입력하세요:");
    if (!id) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("✅ 삭제 완료");
    } catch (err) {
      alert("❌ 에러: " + err.message);
    }
  };

  const handleClaim = async () => {
    const id = prompt("수령 처리할 분실물 ID를 입력하세요:");
    if (!id) return;

    const claimed_by = user?.name;

    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/claim/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimed_by }),
      });
      if (!res.ok) throw new Error("수령 실패");
      alert("✅ 수령 처리 완료");
    } catch (err) {
      alert("❌ 에러: " + err.message);
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">👤 내 정보</h1>

      <section style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={sectionTitleStyle}>내 프로필</h2>
          <button
            onClick={handleLogout}
            style={{
              fontSize: "0.8rem",
              padding: "4px 8px",
              backgroundColor: "#ccc",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
        <p>이름: {user?.name}</p>
        <p>학번: {user?.student_id}</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>내 등록 내역</h2>
        <p style={{ color: "#888" }}>아직 등록한 분실물이 없습니다.</p>
      </section>

      {user?.role === "admin" && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🛠 관리자 도구</h2>

          <button
            className="btn-primary"
            style={{ marginBottom: "8px", backgroundColor: "#0288d1" }}
            onClick={handleClaim}
          >
            📦 분실물 수령 처리
          </button>

          <button
            className="btn-primary"
            style={{ backgroundColor: "#d32f2f" }}
            onClick={handleDelete}
          >
            🔥 분실물 삭제
          </button>
        </section>
      )}
    </div>
  );
}

const sectionStyle = {
  margin: "16px",
  padding: "16px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const sectionTitleStyle = {
  fontSize: "1.1rem",
  marginBottom: "10px",
  color: "#607d8b",
};
