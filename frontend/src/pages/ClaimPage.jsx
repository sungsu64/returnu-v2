// src/pages/ClaimPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale";

export default function ClaimPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(t("claimNameRequired"));
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8090/api/lost-items/claim/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claimed_by: name }),
        }
      );
      if (!res.ok) throw new Error(t("claimServerError"));
      alert(t("claimSuccess"));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="title">{t("claimTitle")}</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder={t("claimPlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">
          {t("claimProcess")}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}
