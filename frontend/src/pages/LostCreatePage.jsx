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
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return setError("물건 이름을 입력해주세요.");
    if (!form.location.trim()) return setError("분실 장소를 입력해주세요.");
    if (!form.date) return setError("분실 날짜를 선택해주세요.");
    if (!form.category) return setError("카테고리를 선택해주세요.");

    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8090/api/lost-items", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("등록 실패");
      const result = await res.json();

      alert("분실물 등록 완료!");
      navigate(`/found/${result.id}`); // ✅ 등록 후 상세 페이지 이동
    } catch (err) {
      alert("에러 발생: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      location: "",
      date: "",
      description: "",
      category: "",
      image: null,
    });
    setPreview(null);
    setError("");
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">📮 분실물 등록</h1>

      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "12px" }}>
          * 필수 항목은 모두 입력해야 합니다.
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "12px", fontWeight: "bold" }}>
            ⚠️ {error}
          </p>
        )}

        <label className="input-label">물건 이름 *</label>
        <input className="input" name="title" placeholder="예: 검정색 지갑" value={form.title} onChange={handleChange} />

        <label className="input-label">분실 장소 *</label>
        <input className="input" name="location" placeholder="예: 도서관 2층" value={form.location} onChange={handleChange} />

        <label className="input-label">분실 날짜 *</label>
        <input className="input" name="date" type="date" value={form.date} onChange={handleChange} />

        <label className="input-label">카테고리 *</label>
        <select name="category" className="input" value={form.category} onChange={handleChange}>
          <option value="">카테고리 선택</option>
          <option value="지갑">지갑</option>
          <option value="휴대폰">휴대폰</option>
          <option value="노트북">노트북</option>
          <option value="이어폰">이어폰</option>
          <option value="열쇠">열쇠</option>
          <option value="기타">기타</option>
        </select>

        <label className="input-label">자세한 설명</label>
        <textarea
          className="input"
          name="description"
          placeholder="특징, 색상, 브랜드 등"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <label className="input-label">사진 업로드</label>
        <input className="input" type="file" name="image" accept="image/*" onChange={handleChange} />

        {preview && (
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "0.85rem", color: "#888" }}>📷 업로드된 이미지</p>
            <img
              src={preview}
              alt="미리보기"
              style={{ width: "100%", maxHeight: "240px", objectFit: "cover", borderRadius: "8px", marginTop: "4px" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1, marginTop: "20px" }}
        >
          {isLoading ? "등록 중..." : "등록하기"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            textDecoration: "underline",
            fontSize: "0.85rem",
            marginTop: "8px",
            cursor: "pointer",
          }}
        >
          초기화
        </button>
      </form>
    </div>
  );
}
