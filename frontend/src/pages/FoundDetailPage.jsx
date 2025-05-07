import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FoundDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [claimedName, setClaimedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    async function fetchItem() {
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

  const handleClaim = async () => {
    if (!claimedName.trim()) {
      alert("수령자 이름을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/claim/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimed_by: claimedName }),
      });

      if (!res.ok) throw new Error("수령 처리 실패");
      alert("수령 처리가 완료되었습니다.");
      window.location.reload();
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">습득물 상세</h1>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <div className="card">
          {item.image ? (
            <img
              src={`http://localhost:8090${item.image}`}
              alt="분실물 이미지"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "12px" }}
            />
          ) : (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f0f0",
                borderRadius: "8px",
                marginBottom: "12px",
                color: "#888",
              }}
            >
              이미지 없음
            </div>
          )}

          <h2 style={{ color: "#607d8b", marginBottom: "8px" }}>{item.title}</h2>
          <p className="meta">📍 위치: {item.location}</p>
          <p className="meta">🗓️ 습득일: {new Date(item.date).toLocaleDateString("ko-KR")}</p>

          {item.claimed_by && (
            <p
              style={{
                background: "#dcedc8",
                color: "#33691e",
                padding: "6px 12px",
                borderRadius: "8px",
                marginTop: "12px",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              ✅ 수령 완료 ({item.claimed_by})
            </p>
          )}

          <p style={{ marginTop: "16px", fontSize: "0.95rem", color: "#444" }}>
            {item.description}
          </p>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#999",
              marginTop: "8px",
            }}
          >
            등록일: {new Date(item.created_at).toLocaleDateString("ko-KR")}
          </p>

          {/* 관리자만 수령자 입력 가능 */}
          {user?.role === "admin" && (
            <div style={{ marginTop: "20px" }}>
              <input
                className="input"
                placeholder="수령자 이름 입력"
                value={claimedName}
                onChange={(e) => setClaimedName(e.target.value)}
              />
              <button onClick={handleClaim} className="btn-primary" style={{ marginTop: "10px" }}>
                수령 처리하기
              </button>
            </div>
          )}

          {/* 🔙 뒤로가기 버튼 */}
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: "24px",
              background: "#ccc",
              color: "#333",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← 뒤로가기
          </button>
        </div>
      )}
    </div>
  );
}
