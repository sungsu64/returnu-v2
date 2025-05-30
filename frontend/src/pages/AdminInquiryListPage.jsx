// src/pages/AdminInquiryListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/AdminInquiryListPage.css";

export default function AdminInquiryListPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert(t("loginRequired"));
      navigate("/login");
      return;
    }
    const { role } = JSON.parse(stored);
    if (role !== "admin") {
      alert(t("adminOnly"));
      navigate("/");
      return;
    }

    fetch(`/api/inquiries`)
      .then((res) => {
        if (!res.ok) throw new Error(t("serverError"));
        return res.json();
      })
      .then((data) => setInquiries(data))
      .catch(() => setError(t("loadInquiriesFailed")))
      .finally(() => setLoading(false));
  }, [navigate, t]);

  const handleViewDetail = async (id) => {
    console.log("🟡 클릭됨 inquiry id:", id);

    try {
      const res = await fetch(`http://localhost:8090/api/inquiries/${id}/check`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("PATCH 실패");
      const result = await res.json();
      console.log("✅ PATCH 성공:", result);
    } catch (err) {
      console.error("❌ PATCH 오류:", err.message);
    }

    navigate(`/contact/${id}`);
  };

  if (loading) return <div className="admin-inquiry-wrapper">⏳ {t("loading")}</div>;
  if (error) return <div className="admin-inquiry-wrapper error">{error}</div>;

  return (
    <div className="admin-inquiry-wrapper">
      <h2 className="admin-inquiry-title">📋 {t("adminAllInquiries")}</h2>

      {inquiries.length === 0 ? (
        <p className="admin-inquiry-status">{t("noInquiries")}</p>
      ) : (
        <div className="admin-inquiry-list">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => handleViewDetail(inq.id)}
              style={{
                backgroundColor: inq.is_checked === 0 ? "#fff9e0" : "white",
                border: inq.is_checked === 0 ? "2px solid #ffd369" : "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                cursor: "pointer",
                boxShadow: inq.is_checked === 0 ? "0 0 6px #ffe08c" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                className="admin-inquiry-card-header"
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
              >
                <span className="admin-inquiry-title-text" style={{ fontWeight: "bold", fontSize: "1rem" }}>
                  {inq.title}
                </span>
                <span className="admin-inquiry-date" style={{ fontSize: "0.85rem", color: "#777" }}>
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="admin-inquiry-meta" style={{ fontSize: "0.9rem", color: "#555" }}>
                👤 {inq.student_id} | 📧 {inq.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
