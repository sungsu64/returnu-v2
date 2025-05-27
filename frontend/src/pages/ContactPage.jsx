import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ContactPage.css";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    email: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, student_id, email, title, message } = formData;
    if (!name || !student_id || !email || !title || !message) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.");
        setFormData({ name: "", student_id: "", email: "", title: "", message: "" });
        navigate("/");
      } else {
        alert("❌ 문의 전송 실패: " + (result.error || "서버 오류"));
      }
    } catch (err) {
      console.error("문의 전송 중 오류:", err);
      alert("서버 연결 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">📩 문의하기</h1>
      <p className="contact-description">
        궁금한 점이나 개선사항이 있다면 아래 양식을 통해 문의해주세요.
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
          required
        />

        <label htmlFor="student_id">학번</label>
        <input
          type="text"
          id="student_id"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder="학번을 입력하세요"
          required
        />

        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />

        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="문의 제목을 입력하세요"
          required
        />

        <label htmlFor="message">문의 내용</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="문의 내용을 입력해주세요"
          required
        ></textarea>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "16px" }}>
          <button type="button" onClick={() => navigate(-1)} className="contact-submit" style={{ backgroundColor: "#ccc" }}>
            ← 뒤로가기
          </button>
          <button type="submit" className="contact-submit">
            문의 보내기
          </button>
        </div>
      </form>
    </div>
  );
}
