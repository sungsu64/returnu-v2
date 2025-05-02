import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FoundDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ 임시 더미 데이터
  const item = {
    id,
    title: "검정색 지갑",
    location: "학생회관 1층",
    date: "2024-04-29",
    description: "카드 3장과 현금이 들어 있습니다. 지갑 겉면에 흠집이 있어요.",
  };

  return (
    <>
      <h1 className="title">습득물 상세</h1>

      <div className="card">
        <h2 style={{ color: "#ff6f00", marginBottom: "8px" }}>{item.title}</h2>
        <p className="meta">📍 위치: {item.location}</p>
        <p className="meta">🗓️ 습득일: {item.date}</p>
        <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "#444" }}>
          {item.description}
        </p>
      </div>

      <button
        className="btn-primary"
        onClick={() => navigate(`/claim/${id}`)}
      >
        ✅ 수령하러 가기
      </button>
    </>
  );
}
