import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale"; // 추가
import "../styles/AdminEditPage.css";

function AdminEditPage() {
  const { t } = useLang(); // 추가
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/admin/${type}/${id}`);
        if (!res.ok) throw new Error(t("dataLoadError"));
        const data = await res.json();
        setForm(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [type, id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(t("editError"));
      alert(t("editSuccess"));
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-edit-loading">⏳ {t("loading")}</div>;

  return (
    <div className="admin-edit-container">
      <h2 className="admin-edit-title">{t("adminEditTitle")}</h2>
      <div className="admin-edit-form">
        {form.title !== undefined && (
          <div className="form-field">
            <label>{t("titleLabel")}</label>
            <input name="title" value={form.title || ""} onChange={handleChange} />
          </div>
        )}

        {form.location !== undefined && (
          <div className="form-field">
            <label>{t("locationLabel")}</label>
            <input name="location" value={form.location || ""} onChange={handleChange} />
          </div>
        )}

        {form.date !== undefined && (
          <div className="form-field">
            <label>{t("dateLabel")}</label>
            <input
              name="date"
              type="date"
              value={form.date?.slice(0, 10) || ""}
              onChange={handleChange}
            />
          </div>
        )}

        {form.category !== undefined && (
          <div className="form-field">
            <label>{t("categoryLabel")}</label>
            <input name="category" value={form.category || ""} onChange={handleChange} />
          </div>
        )}

        {form.email !== undefined && (
          <div className="form-field">
            <label>{t("emailLabel")}</label>
            <input name="email" value={form.email || ""} onChange={handleChange} />
          </div>
        )}

        {form.phone !== undefined && (
          <div className="form-field">
            <label>{t("phoneLabel")}</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange} />
          </div>
        )}

        {(form.description !== undefined || form.message !== undefined || form.content !== undefined) && (
          <div className="form-field">
            <label>{t("descriptionLabel")}</label>
            <textarea
              name={form.description !== undefined ? "description" : form.message !== undefined ? "message" : "content"}
              value={
                form.description !== undefined
                  ? form.description
                  : form.message !== undefined
                  ? form.message
                  : form.content
              }
              onChange={handleChange}
            />
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          {t("saveButton")}
        </button>
      </div>
    </div>
  );
}

export default AdminEditPage;
