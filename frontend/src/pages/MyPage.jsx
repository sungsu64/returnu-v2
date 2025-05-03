import React from "react";

export default function MyPage() {
  return (
    <div className="app-wrapper">
      <h1 className="title">👤 내 정보</h1>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>내 프로필</h2>
        <p>이름: 홍길동</p>
        <p>이메일: example@domain.com</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>내 등록 내역</h2>
        <p style={{ color: "#888" }}>아직 등록한 분실물이 없습니다.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>설정</h2>
        <button className="btn-primary" onClick={() => alert("로그아웃 기능은 아직 구현되지 않았습니다.")}>로그아웃</button>
      </section>
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
