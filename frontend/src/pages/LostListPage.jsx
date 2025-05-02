import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LostListPage() {
  const navigate = useNavigate();

  // 🔹 더미 데이터
  const [items] = useState([
    { id: 1, title: "지갑", location: "학생회관", date: "2024-04-29" },
    { id: 2, title: "이어폰", location: "도서관", date: "2024-04-28" },
    { id: 3, title: "노트북", location: "컴퓨터실", date: "2024-04-27" },
  ]);

  return (
    <>
      <h1 className="title">분실물 목록</h1>

      {items.map((item) => (
        <div
          className="card"
          key={item.id}
          onClick={() => navigate(`/found/${item.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3 style={{ fontSize: "1.1rem", color: "#ff6f00", marginBottom: "6px" }}>
            {item.title}
          </h3>
          <p className="meta">📍 {item.location}</p>
          <p className="meta">🗓️ {item.date}</p>
        </div>
      ))}
    </>
  );
}
