// src/pages/LostRequestDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function LostRequestDetailPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // ← 여기 수정됨
  const [user, setUser] = useState(null);
  const isDark = document.body.classList.contains("dark");

  // 사용자 정보 로드
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // 상세 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`);
        if (!res.ok) throw new Error(t("loadFailed"));
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchData();
  }, [id, t]);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm(t("confirmDeleteRequest"))) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t("deleteFailed"));
      alert(t("deleteSuccess"));
      navigate("/");
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  // 에러 상태 UI
  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: isDark ? "#ffa88d" : "crimson",
        }}
      >
        <p style={{ fontSize: "1.1rem" }}>❌ {t("error")}: {error}</p>
      </div>
    );
  }

  // 로딩 상태 UI
  if (!data) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: isDark ? "#ffe4ad" : "#222",
        }}
      >
        ⏳ {t("loadingDetail")}
      </div>
    );
  }

  // 정상 렌더
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "480px",
        margin: "auto",
        background: isDark ? "#22242a" : "transparent",
        minHeight: "100vh",
        transition: "background 0.2s",
      }}
    >
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: isDark ? "#ffce81" : "#666",
          fontSize: "0.9rem",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        ← {t("back")}
      </button>

      {/* 카드 */}
      <div
        style={{
          border: `1px solid ${isDark ? "#393a4b" : "#eee"}`,
          borderRadius: "12px",
          boxShadow: isDark
            ? "0 4px 16px rgba(0,0,0,0.19)"
            : "0 4px 10px rgba(0,0,0,0.05)",
          padding: "20px",
          backgroundColor: isDark ? "#23242c" : "#fff",
          transition: "background 0.2s, border 0.2s",
        }}
      >
        {/* 제목 + 카테고리 */}
        <div style={{ marginBottom: "12px" }}>
          <h2
            style={{
              color: isDark ? "#ffd377" : "#d19c66",
              fontWeight: 700,
              fontSize: "1.5rem",
              marginBottom: "4px",
            }}
          >
            {data.title}
          </h2>
          <span
            style={{
              backgroundColor: isDark ? "#35364b" : "#f0f0f0",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              color: isDark ? "#ffe4ad" : "#555",
            }}
          >
            📁 {data.category || t("categoryOther")}
          </span>
        </div>

        {/* 이미지 */}
        {data.image && (
          <img
            src={`http://localhost:8090${data.image}`}
            alt={t("requestImageAlt")}
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
              marginBottom: "20px",
            }}
          />
        )}

        {/* 메타 정보 */}
        <div
          style={{
            fontSize: "0.95rem",
            color: isDark ? "#ffe4ad" : "#333",
            marginBottom: "18px",
          }}
        >
          <p>
            <strong>📍 {t("locationLabel")}</strong> {data.location}
          </p>
          <p>
            <strong>📅 {t("dateLabel")}</strong>{" "}
            {new Date(data.date).toLocaleDateString()}
          </p>
          <p>
            <strong>🕒 {t("createdAtLabel")}</strong>{" "}
            {data.created_at
              ? new Date(data.created_at).toLocaleDateString()
              : t("none")}
          </p>
        </div>

        {/* 설명 */}
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>📝 {t("descriptionLabel")}</strong>
          </p>
          <p
            style={{
              whiteSpace: "pre-line",
              background: isDark ? "#28293b" : "#f9f9f9",
              padding: "10px",
              borderRadius: "6px",
              color: isDark ? "#ffe4ad" : "#444",
            }}
          >
            {data.description}
          </p>
        </div>

        {/* 연락처 */}
        <div
          style={{
            fontSize: "0.95rem",
            color: isDark ? "#ffe4ad" : "#333",
          }}
        >
          {data.phone && (
            <p>
              <strong>📞 {t("contactLabel")}</strong> {data.phone}
            </p>
          )}
          {data.email && (
            <p>
              <strong>✉️ {t("emailLabel")}</strong> {data.email}
            </p>
          )}
        </div>

        {/* 쪽지 보내기 버튼 */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={() => {
              if (data.student_id) {
                navigate(`/send-message?receiver_id=${data.student_id}`);
              } else {
                alert(t("cannotSendMessage"));
              }
            }}
            style={{
              marginTop: "20px",
              backgroundColor: isDark ? "#d19c66" : "#d18800",
              color: isDark ? "#2b2522" : "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.18)"
                : "none",
            }}
          >
            {t("sendMessage")}
          </button>
        </div>

        {/* 관리자용 삭제 버튼 */}
        {user?.role === "admin" && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: isDark ? "#f35555" : "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: isDark
                  ? "0 2px 8px rgba(0,0,0,0.19)"
                  : "none",
              }}
            >
              🗑️ {t("delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
