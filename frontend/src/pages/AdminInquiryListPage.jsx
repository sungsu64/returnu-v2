import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminInquiryListPage.css";

export default function AdminInquiryListPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const { role } = JSON.parse(stored);
    if (role !== "admin") {
      alert("관리자만 접근 가능합니다.");
      navigate("/");
      return;
    }

    fetch(`/api/inquiries`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => setInquiries(data))
      .catch((err) => {
        console.error("❌ 전체 문의 목록 불러오기 실패:", err);
        setError("문의 목록을 불러올 수 없습니다.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleViewDetail = (id) => {
    navigate(`/contact/${id}`);
  };

  if (loading) return <div className="admin-inquiry-wrapper">⏳ 로딩 중...</div>;
  if (error) return <div className="admin-inquiry-wrapper error">{error}</div>;

  return (
    <div className="admin-inquiry-wrapper">
      <h2 className="admin-inquiry-title">📋 전체 문의 내역 (관리자 전용)</h2>

      {inquiries.length === 0 ? (
        <p className="admin-inquiry-status">등록된 문의가 없습니다.</p>
      ) : (
        <div className="admin-inquiry-list">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => handleViewDetail(inq.id)}
              className="admin-inquiry-card"
            >
              <div className="admin-inquiry-card-header">
                <span className="admin-inquiry-title-text">{inq.title}</span>
                <span className="admin-inquiry-date">
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="admin-inquiry-meta">
                👤 {inq.student_id} | 📧 {inq.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
