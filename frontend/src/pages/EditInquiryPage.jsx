import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditInquiryPage.css";

export default function EditInquiryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    fetch(`/api/inquiries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          message: data.message || "",
        });
      })
      .catch((err) => {
        console.error("❌ 문의 데이터 불러오기 실패:", err);
        alert("문의 데이터를 불러오지 못했습니다.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      alert("수정이 완료되었습니다.");
      navigate("/myposts");
    } catch {
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setForm({ title: "", message: "" });
  };

  return (
    <div className="edit-inquiry-wrapper">
      <h1 className="edit-inquiry-title">📩 문의하기 수정</h1>
      <form className="edit-inquiry-form" onSubmit={handleSubmit}>
        <label>
          제목
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          내용
          <textarea name="message" value={form.message} onChange={handleChange} required />
        </label>
        <div className="edit-inquiry-btns">
          <button type="submit" className="btn edit">✅ 수정</button>
          <button type="button" className="btn reset" onClick={handleReset}>🌀 초기화</button>
          <button type="button" className="btn back" onClick={() => navigate(-1)}>🔙 뒤로가기</button>
        </div>
      </form>
    </div>
  );
}