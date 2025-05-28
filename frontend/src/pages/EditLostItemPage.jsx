import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditLostItemPage.css";

export default function EditLostItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    category: "기타",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    fetch(`/api/lost-items/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("데이터 없음");
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title,
          location: data.location,
          date: data.date.split("T")[0],
          description: data.description,
          category: data.category,
          image: null,
        });
        setOriginalForm(data);
        setPreview(data.image);
      })
      .catch((err) => {
        console.error("❌ 데이터 불러오기 실패:", err);
        alert("피드백을 불러오지 못했습니다.");
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

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      const res = await fetch(`/api/lost-items/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error("수정 실패");
      alert("수정이 완료되었습니다.");
      navigate("/myposts");
    } catch (err) {
      console.error("❌ 수정 실패:", err);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (!originalForm) return;
    setForm({
      title: originalForm.title,
      location: originalForm.location,
      date: originalForm.date.split("T")[0],
      description: originalForm.description,
      category: originalForm.category,
      image: null,
    });
    setPreview(originalForm.image);
  };

  return (
    <div className="edit-lost-wrapper">
      <button onClick={() => navigate(-1)} className="back-btn">← 뒤로가기</button>
      <h2>분실물 수정</h2>
      <div className="edit-lost-form">
        <label>제목</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>보관 장소</label>
        <input name="location" value={form.location} onChange={handleChange} />

        <label>습득 일자</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} />

        <label>설명</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <label>카테고리</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="전자기기">전자기기</option>
          <option value="의류">의류</option>
          <option value="서류">서류</option>
          <option value="기타">기타</option>
        </select>

        <label>사진</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        <div className="edit-lost-btn-group">
          <button onClick={handleCancel}>초기화</button>
          <button onClick={handleSubmit}>수정 완료</button>
        </div>

        {preview && (
          <div className="edit-lost-preview">
            <strong>미리보기</strong>
            <img src={preview} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
}
