import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LostRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제 완료");
      navigate("/");
    } catch (err) {
      alert("에러: " + err.message);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ color: "crimson", fontSize: "1.1rem" }}>❌ 에러: 데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        ⏳ 상세 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "auto", fontFamily: "'Noto Sans KR', sans-serif" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#666",
          fontSize: "0.9rem",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        ← 뒤로가기
      </button>

      <div style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        padding: "20px",
        backgroundColor: "white"
      }}>
        <div style={{ marginBottom: "12px" }}>
          <h2 style={{ color: "#d19c66", fontWeight: "700", fontSize: "1.5rem", marginBottom: "4px" }}>
            {data.title}
          </h2>
          <span style={{
            backgroundColor: "#f0f0f0",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.8rem",
            color: "#555"
          }}>
            📁 {data.category || "기타"}
          </span>
        </div>

        {data.image && (
          <img
            src={`http://localhost:8090${data.image}`}
            alt="요청 이미지"
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
              marginBottom: "20px"
            }}
          />
        )}

        <div style={{ fontSize: "0.95rem", color: "#333", marginBottom: "18px" }}>
          <p><strong>📍 위치:</strong> {data.location}</p>
          <p><strong>📅 날짜:</strong> {new Date(data.date).toLocaleDateString()}</p>
          <p><strong>🕒 등록일:</strong> {data.created_at ? new Date(data.created_at).toLocaleDateString() : "없음"}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p><strong>📝 설명:</strong></p>
          <p style={{ whiteSpace: "pre-line", background: "#f9f9f9", padding: "10px", borderRadius: "6px", color: "#444" }}>
            {data.description}
          </p>
        </div>

        <div style={{ fontSize: "0.95rem", color: "#333" }}>
          {data.phone && <p><strong>📞 연락처:</strong> {data.phone}</p>}
          {data.email && <p><strong>✉️ 이메일:</strong> {data.email}</p>}
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={() => {
              if (data.student_id) {
                navigate(`/send-message?receiver_id=${data.student_id}`);
              } else {
                alert("쪽지를 보낼 수 없습니다. 작성자 정보가 없습니다.");
              }
            }}
            style={{
              marginTop: "20px",
              backgroundColor: "#d18800",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            쪽지 보내기
          </button>
        </div>

        {user?.role === "admin" && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              🗑️ 삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
