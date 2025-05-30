// src/pages/LostCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../mobile-ui.css";

// 카테고리 리스트
const CATEGORY_LIST = ["전자기기", "의류", "악세서리", "개인소지품", "문서/서류", "기타"];

export default function LostCreatePage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    category: "기타",   // ← 기본값 "기타"로!
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 체크
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      alert(t("loginRequired"));
      navigate("/login");
    }
  }, [navigate, t]);

  // 입력 변경 핸들러
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

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())      return setError(t("itemNameRequired"));
    if (!form.location.trim())   return setError(t("locationRequired"));
    if (!form.date)              return setError(t("dateRequired"));
    // category는 항상 값이 있으니 체크 안 해도 됨

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      // image 필드는 null이 아닌 경우만 추가
      if (k === "image" && !v) return;
      formData.append(k, v);
    });
    if (user?.student_id) {
      formData.append("student_id", user.student_id);
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8090/api/lost-items", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      alert(t("createSuccess"));
      navigate(`/found/${result.id}`);
    } catch {
      alert(t("createFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setForm({
      title: "",
      location: "",
      date: "",
      description: "",
      category: "기타",  // ← 초기화도 기본값!
      image: null,
    });
    setPreview(null);
    setError("");
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">📮 {t("lostCreateTitle")}</h1>

      <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
        <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "12px" }}>
          * {t("requiredNotice")}
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "12px", fontWeight: "bold" }}>
            ⚠️ {error}
          </p>
        )}

        <label className="input-label">{t("itemNameLabel")} *</label>
        <input
          className="input"
          name="title"
          placeholder={t("itemNamePlaceholder")}
          value={form.title}
          onChange={handleChange}
        />

        <label className="input-label">{t("locationLabel")} *</label>
        <input
          className="input"
          name="location"
          placeholder={t("locationPlaceholder")}
          value={form.location}
          onChange={handleChange}
        />

        <label className="input-label">{t("dateLabel")} *</label>
        <input
          className="input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <label className="input-label">{t("selectCategory")} *</label>
        <select
          name="category"
          className="input"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="input-label">{t("descriptionLabel")}</label>
        <textarea
          className="input"
          name="description"
          placeholder={t("descriptionPlaceholder")}
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <label className="input-label">{t("photoOptional")}</label>
        <input
          className="input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "0.85rem", color: "#888" }}>
              📷 {t("previewLabel")}
            </p>
            <img
              src={preview}
              alt={t("previewAlt")}
              style={{
                width: "100%",
                maxHeight: "240px",
                objectFit: "cover",
                borderRadius: "8px",
                marginTop: "4px",
              }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1, marginTop: "20px" }}
        >
          {isLoading ? t("creating") : t("createButton")}
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
          {t("resetButton")}
        </button>
      </form>
    </div>
  );
}
