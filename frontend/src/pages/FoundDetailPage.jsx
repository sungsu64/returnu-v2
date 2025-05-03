import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FoundDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8090/api/lost-items/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  return (
    <div className="app-wrapper">
      <h1 className="title">습득물 상세</h1>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <>
          <div className="card">
            {item.image && (
              <img
                src={`http://localhost:8090${item.image}`}
                alt="분실물 이미지"
                style={{ width: "100%", borderRadius: "8px", marginBottom: "12px" }}
              />
            )}
            <h2 style={{ color: "#607d8b", marginBottom: "8px" }}>{item.title}</h2>
            <p className="meta">📍 위치: {item.location}</p>
            <p className="meta">
              🗓️ 습득일: {new Date(item.date).toLocaleDateString("ko-KR")}
            </p>
            <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "#444" }}>
              {item.description}
            </p>
          </div>

          <button className="btn-primary" onClick={() => navigate(`/claim/${id}`)}>
            ✅ 수령하러 가기
          </button>
        </>
      )}
    </div>
  );
}
