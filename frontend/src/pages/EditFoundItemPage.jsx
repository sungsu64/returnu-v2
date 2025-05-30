import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/EditFoundItemPage.css";

export default function EditFoundItemPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();

  // 카테고리 한글 배열 (DB값과 100% 일치)
  const CATEGORY_LIST = [
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
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetch(`/api/lost_requests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t("loadError"));
        return res.json();
      })
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
        console.error(err);
        alert(t("loadError"));
      });
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((p) => ({ ...p, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });
    try {
      const res = await fetch(`/api/lost_requests/${id}`, {
        method: "PATCH",
        body: fd,
      });
      if (!res.ok) throw new Error(t("editFailed"));
      alert(t("editSuccess"));
      navigate("/myposts");
    } catch {
      alert(t("editError"));
    }
  };

  const handleReset = () => {
    setForm({ title: "", location: "", date: "", description: "", category: "", image: null });
    setPreview(null);
  };

  return (
    <div className="edit-found-wrapper">
      <h1 className="edit-found-title">📦 {t("editFoundTitle")}</h1>
      <form className="edit-found-form" onSubmit={handleSubmit}>
        <label>
          {t("titleLabel")}
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          {t("locationLabel")}
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          {t("dateLabel")}
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          {t("categoryLabel")}
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">{t("selectCategory")}</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("descriptionLabel")}
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>
          {t("photoLabel")}
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>
        {preview && (
          <img src={preview} alt={t("previewAlt")} className="edit-found-preview" />
        )}
        <div className="edit-found-btns">
          <button type="submit" className="btn edit">✅ {t("saveButton")}</button>
          <button type="button" className="btn reset" onClick={handleReset}>🌀 {t("resetButton")}</button>
          <button type="button" className="btn back" onClick={() => navigate(-1)}>🔙 {t("back")}</button>
        </div>
      </form>
    </div>
  );
}
