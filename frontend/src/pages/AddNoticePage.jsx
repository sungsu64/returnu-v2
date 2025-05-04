import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile-ui.css";

export default function AddNoticePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8090/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("등록 실패");

      alert("공지사항이 등록되었습니다.");
      navigate("/"); // 홈으로 이동
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">공지사항 등록</h1>
      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <input
          className="input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ resize: "none" }}
        />
        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
        <button type="submit" className="btn-primary">
          등록하기
        </button>
      </form>
    </div>
  );
}
