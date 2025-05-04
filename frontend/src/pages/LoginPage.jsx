// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, password }),
      });

      if (!res.ok) throw new Error("로그인 실패");

      const { user } = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      alert("로그인 성공!");
      navigate("/my");
    } catch (err) {
      setError("❌ 로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">🔐 로그인</h1>
      <form onSubmit={handleLogin} style={{ padding: "16px" }}>
        <input
          className="input"
          type="text"
          placeholder="학번 (숫자만)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          로그인
        </button>
        {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
      </form>
    </div>
  );
}
