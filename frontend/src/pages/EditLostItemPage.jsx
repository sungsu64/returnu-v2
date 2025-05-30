import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/EditLostItemPage.css";

export default function EditLostItemPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { id } = useParams();

  // 카테고리 리스트 (한글)
  const CATEGORY_LIST = [
    "전체", // 보통 등록/수정에서는 제외하지만 필요하면 남겨두세요!
    "전자기기",
    "의류",
    "악세서리",
    "개인소지품",
    "문서/서류",
    "기타"
  ];

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    category: "기타", // 한글 기본값
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    fetch(`/api/lost-items/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("dataNotFound"));
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
        console.error("❌", err);
        alert(t("loadError"));
      });
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] != null) formData.append(key, form[key]);
    });
    try {
      const res = await fetch(`/api/lost-items/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) throw new Error(t("editFailed"));
      alert(t("editSuccess"));
      navigate("/myposts");
    } catch (err) {
      console.error("❌", err);
      alert(t("editError"));
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
      <button onClick={() => navigate(-1)} className="back-btn">
        ← {t("back")}
      </button>
      <h2>{t("editLostTitle")}</h2>

      <div className="edit-lost-form">
        <label>{t("titleLabel")}</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>{t("locationLabel")}</label>
        <input name="location" value={form.location} onChange={handleChange} />

        <label>{t("dateLabel")}</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <label>{t("descriptionLabel")}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>{t("categoryLabel")}</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {/* "전체" 카테고리는 등록/수정용에서는 제외하고, 목록/검색용에서만 사용하세요 */}
          {CATEGORY_LIST.filter(cat => cat !== "전체").map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>{t("photoLabel")}</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="edit-lost-btn-group">
          <button type="button" onClick={handleCancel}>{t("resetButton")}</button>
          <button type="button" onClick={handleSubmit}>{t("saveButton")}</button>
        </div>

        {preview && (
          <div className="edit-lost-preview">
            <strong>{t("previewLabel")}</strong>
            <img src={preview} alt={t("previewAlt")} />
          </div>
        )}
      </div>
    </div>
  );
}
