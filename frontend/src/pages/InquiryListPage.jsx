import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InquiryListPage.css";

export default function InquiryListPage() {
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

    const { student_id } = JSON.parse(stored);

    fetch(`/api/inquiries/by-student/${student_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => setInquiries(data))
      .catch((err) => {
        console.error("❌ 문의 목록 불러오기 실패:", err);
        setError("문의 목록을 불러올 수 없습니다.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleWriteInquiry = () => {
    navigate("/contact");
  };

  const handleViewDetail = (id) => {
    navigate(`/contact/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="inquiry-wrapper">⏳ 로딩 중...</div>;
  if (error) return <div className="inquiry-wrapper inquiry-status error">{error}</div>;

  return (
    <div className="inquiry-wrapper">
      <div className="inquiry-list-header">
        <h2 className="inquiry-header">📨 나의 문의 내역</h2>
        <button className="inquiry-write-btn" onClick={handleWriteInquiry}>
          ➕ 문의하기
        </button>
      </div>

      {inquiries.length === 0 ? (
        <p className="inquiry-status">문의 내역이 없습니다.</p>
      ) : (
        <div className="inquiry-list">
          {inquiries.map((inq) => (
            <div key={inq.id} onClick={() => handleViewDetail(inq.id)} className="inquiry-card">
              <div className="inquiry-card-header">
                <div className="inquiry-title">{inq.title}</div>
                <div className="inquiry-date">
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </div>
              </div>
              <div className="inquiry-meta">📧 {inq.email}</div>
            </div>
          ))}
        </div>
      )}

      <div className="inquiry-back-wrapper">
        <button className="inquiry-back-btn" onClick={handleBack}>
          ⬅ 뒤로가기
        </button>
      </div>
    </div>
  );
}
