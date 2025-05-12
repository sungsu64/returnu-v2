import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LostRequestPage.css";

export default function LostRequestPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    category: "기타",
    phone: "",
    email: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목, 날짜, 장소, 설명 필수 + 연락수단은 전화번호나 이메일 중 하나만 있어도 OK
    if (
      !form.title ||
      !form.date ||
      !form.location ||
      !form.description ||
      (!form.phone && !form.email)
    ) {
      alert("모든 필수 항목을 입력해주세요. (전화번호 또는 이메일은 하나 이상 필수)");
      return;
    }

    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://localhost:8090/api/lost-requests", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("등록 실패");
      alert("요청이 등록되었습니다!");
      navigate("/");
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="lost-request-wrapper">
      <h2>📝 물건을 찾아주세요!</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>제목</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예: 검정색 지갑을 잃어버렸어요"
        />

        <label>분실 날짜</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} />

        <label>분실 장소</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="예: 학생회관, 도서관"
        />

        <label>분류</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="지갑">지갑</option>
          <option value="노트북">노트북</option>
          <option value="휴대폰">휴대폰</option>
          <option value="이어폰">이어폰</option>
          <option value="기타">기타</option>
        </select>

        <label>상세 설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="잃어버린 상황을 최대한 자세히 적어주세요"
        />

        <label>전화번호</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
        />

        <label>이메일</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
        />

        <label>사진 첨부 (선택)</label>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="btn-submit">요청 등록</button>
      </form>
    </div>
  );
}
