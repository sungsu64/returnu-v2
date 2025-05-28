import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditFeedbackPage.css";

export default function EditFeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/feedbacks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || "");
      })
      .catch((err) => {
        console.error("❌ 피드백 불러오기 실패:", err);
        alert("피드백을 불러오지 못했습니다.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      alert("수정이 완료되었습니다.");
      navigate("/myposts");
    } catch {
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="edit-feedback-wrapper">
      <h1 className="edit-feedback-title">📝 피드백 수정</h1>
      <form className="edit-feedback-form" onSubmit={handleSubmit}>
        <label>
          내용
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <div className="edit-feedback-btns">
          <button type="submit" className="btn submit">✅ 수정</button>
          <button type="button" className="btn back" onClick={() => navigate(-1)}>🔙 뒤로가기</button>
        </div>
      </form>
    </div>
  );
}