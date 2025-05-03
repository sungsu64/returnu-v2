import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile-ui.css";

export default function LostCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError(""); // 입력 시 오류 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 유효성 검사
    if (!form.title.trim()) return setError("물건 이름을 입력해주세요.");
    if (!form.location.trim()) return setError("분실 장소를 입력해주세요.");
    if (!form.date) return setError("분실 날짜를 선택해주세요.");
    if (!form.category) return setError("카테고리를 선택해주세요.");

    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://localhost:8090/api/lost-items", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("등록 실패");

      alert("분실물 등록 완료!");
      navigate("/");
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">분실물 등록</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red", marginBottom: "8px" }}>{error}</p>}
        <input className="input" name="title" placeholder="물건 이름" value={form.title} onChange={handleChange} />
        <input className="input" name="location" placeholder="분실 장소" value={form.location} onChange={handleChange} />
        <input className="input" name="date" type="date" value={form.date} onChange={handleChange} />
        <select name="category" className="input" value={form.category} onChange={handleChange}>
          <option value="">카테고리 선택</option>
          <option value="지갑">지갑</option>
          <option value="휴대폰">휴대폰</option>
          <option value="노트북">노트북</option>
          <option value="이어폰">이어폰</option>
          <option value="열쇠">열쇠</option>
          <option value="기타">기타</option>
        </select>
        <textarea className="input" name="description" placeholder="자세한 설명" rows="4" value={form.description} onChange={handleChange} />
        <input className="input" type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit" className="btn-primary">등록하기</button>
      </form>
    </div>
  );
}
