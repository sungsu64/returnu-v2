import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AdminEditPage.css";

function AdminEditPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/admin/${type}/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("수정 중 오류 발생");
      alert("수정이 완료되었습니다.");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-edit-loading">⏳ 불러오는 중...</div>;

  return (
    <div className="admin-edit-container">
      <h2 className="admin-edit-title">관리자 글 수정</h2>
      <div className="admin-edit-form">
        {form.title !== undefined && (
          <div className="form-field">
            <label>제목</label>
            <input name="title" value={form.title || ""} onChange={handleChange} />
          </div>
        )}

        {form.location !== undefined && (
          <div className="form-field">
            <label>위치</label>
            <input name="location" value={form.location || ""} onChange={handleChange} />
          </div>
        )}

        {form.date !== undefined && (
          <div className="form-field">
            <label>날짜</label>
            <input
              name="date"
              type="date"
              value={form.date?.slice(0, 10) || ""}
              onChange={handleChange}
            />
          </div>
        )}

        {form.category !== undefined && (
          <div className="form-field">
            <label>카테고리</label>
            <input name="category" value={form.category || ""} onChange={handleChange} />
          </div>
        )}

        {form.email !== undefined && (
          <div className="form-field">
            <label>이메일</label>
            <input name="email" value={form.email || ""} onChange={handleChange} />
          </div>
        )}

        {form.phone !== undefined && (
          <div className="form-field">
            <label>전화번호</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange} />
          </div>
        )}

        {(form.description !== undefined || form.message !== undefined || form.content !== undefined) && (
          <div className="form-field">
            <label>내용</label>
            <textarea
              name={form.description !== undefined ? "description" : form.message !== undefined ? "message" : "content"}
              value={
                form.description !== undefined
                  ? form.description
                  : form.message !== undefined
                  ? form.message
                  : form.content
              }
              onChange={handleChange}
            />
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          저장하기
        </button>
      </div>
    </div>
  );
}

export default AdminEditPage;
