import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditFoundItemPage.css";

export default function EditFoundItemPage() {
  const { id } = useParams();
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

  useEffect(() => {
    fetch(`/api/lost_requests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          location: data.location || "",
          date: data.date ? data.date.slice(0, 10) : "",
          description: data.description || "",
          category: data.category || "",
          image: null,
        });
        setPreview(data.image || null);
      })
      .catch((err) => {
        console.error("❌ 데이터 불러오기 실패:", err);
        alert("데이터를 불러오지 못했습니다.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }
    try {
      const res = await fetch(`/api/lost_requests/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error();
      alert("수정이 완료되었습니다.");
      navigate("/myposts");
    } catch {
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setForm({ title: "", location: "", date: "", description: "", category: "", image: null });
    setPreview(null);
  };

  return (
    <div className="edit-found-wrapper">
      <h1 className="edit-found-title">📦 습득물 수정</h1>
      <form className="edit-found-form" onSubmit={handleSubmit}>
        <label>제목
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>습득 장소
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>습득 날짜
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>카테고리
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">선택</option>
            <option value="전자기기">전자기기</option>
            <option value="서류">서류</option>
            <option value="지갑">지갑</option>
            <option value="의류">의류</option>
            <option value="기타">기타</option>
          </select>
        </label>
        <label>상세 설명
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>이미지 업로드
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>
        {preview && <img src={preview} alt="미리보기" className="edit-found-preview" />}
        <div className="edit-found-btns">
          <button type="submit" className="btn edit">✅ 수정</button>
          <button type="button" className="btn reset" onClick={handleReset}>🌀 초기화</button>
          <button type="button" className="btn back" onClick={() => navigate(-1)}>🔙 뒤로가기</button>
        </div>
      </form>
    </div>
  );
}
