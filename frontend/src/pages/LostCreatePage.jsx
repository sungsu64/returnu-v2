import React, { useState } from "react";

export default function LostCreatePage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("✅ 등록 데이터:", form);
    alert("분실물 등록 완료 (임시)");
    // 실제 API 연결은 나중에!
  };

  return (
    <>
      <h1 className="title">분실물 등록</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          name="title"
          placeholder="물건 이름"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="location"
          placeholder="분실 장소"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <textarea
          className="input"
          name="description"
          placeholder="자세한 설명"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit" className="btn-primary">
          등록하기
        </button>
      </form>
    </>
  );
}
