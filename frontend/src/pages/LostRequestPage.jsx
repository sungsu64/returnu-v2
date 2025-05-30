// src/pages/LostRequestPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/LostRequestPage.css";

const CATEGORY_LIST = [
  "전자기기",
  "의류",
  "악세서리",
  "개인소지품",
  "문서/서류",
  "기타"
];

export default function LostRequestPage() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    category: "기타",
    phone: "",
    email: "",
    image: null,
    student_id: "",
  });

  // 로그인 체크 & student_id 동기화
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setForm(f => ({ ...f, student_id: user.student_id }));
    } else {
      alert(t("loginRequired"));
      navigate("/login");
    }
  }, [navigate, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(f => ({ ...f, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.date ||
      !form.location ||
      !form.description ||
      (!form.phone && !form.email)
    ) {
      alert(t("fillRequiredFields"));
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) formData.append(k, v);
    });

    try {
      const res = await fetch("http://localhost:8090/api/lost-requests", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(t("submitFailed"));
      alert(t("requestCreated"));
      navigate("/");
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  return (
    <div className="lost-request-wrapper">
      <h2>📝 {t("lostRequestTitle")}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>{t("titleLabel")}</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder={t("exampleTitle")}
        />

        <label>{t("lostDate")}</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <label>{t("lostLocation")}</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder={t("locationPlaceholder")}
        />

        <label>{t("categoryLabel")}</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">{t("selectCategory")}</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>{t("descriptionLabel")}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder={t("descriptionPlaceholder")}
        />

        <label>{t("phoneLabel")}</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t("phonePlaceholder")}
        />

        <label>{t("emailLabel")}</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
        />

        <label>{t("photoOptional")}</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit" className="btn-submit">
          {t("submitPost")}
        </button>
      </form>
    </div>
  );
}
