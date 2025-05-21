import React, { useEffect, useState } from "react";
import "../mobile-ui.css";

export default function NoticeManagerPage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // 공지사항 목록 불러오기
  useEffect(() => {
    fetch("http://localhost:8090/api/notices")
      .then((res) => res.json())
      .then(setNotices)
      .catch(() => alert("공지사항 불러오기 실패"));
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
    setError("");
  };

  // 등록 or 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8090/api/notices/${editId}`
        : "http://localhost:8090/api/notices";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("실패");

      alert(editId ? "수정 완료" : "등록 완료");
      window.location.reload();
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    }
  };

  // 수정 버튼 클릭 → 값 세팅
  const handleEdit = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setEditId(notice.id);
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8090/api/notices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      alert("삭제되었습니다.");
      window.location.reload();
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">📢 공지사항 관리</h1>

      <form onSubmit={handleSubmit} style={{ padding: "0 16px", marginBottom: "24px" }}>
        <input
          className="input"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="내용"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p style={{ color: "red", marginBottom: "8px" }}>{error}</p>}
        <button className="btn-primary" type="submit">
          {editId ? "공지 수정하기" : "공지 등록하기"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              background: "transparent",
              color: "#888",
              textDecoration: "underline",
              marginTop: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            취소
          </button>
        )}
      </form>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ padding: "0 16px" }}>
        {notices.map((n) => (
          <div key={n.id} style={noticeBox}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <p style={{ fontSize: "0.8rem", color: "#999" }}>
              📅 {new Date(n.created_at).toLocaleDateString("ko-KR")}
            </p>
            <div style={{ marginTop: "8px" }}>
              <button onClick={() => handleEdit(n)} style={editBtn}>수정</button>
              <button onClick={() => handleDelete(n.id)} style={deleteBtn}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const noticeBox = {
  border: "1px solid #eee",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: "#fff",
};

const editBtn = {
  padding: "6px 12px",
  marginRight: "8px",
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 12px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
