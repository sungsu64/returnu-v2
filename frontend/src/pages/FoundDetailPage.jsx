// src/pages/FoundDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/FoundDetailPage.css";

export default function FoundDetailPage() {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [claimedName, setClaimedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`http://localhost:8090/api/lost-items/${id}`);
        if (!res.ok) throw new Error(t("foundLoadError"));
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id, t]);

  const handleClaim = async () => {
    if (!claimedName.trim()) {
      alert(t("claimInputError"));
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8090/api/lost-items/claim/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claimed_by: claimedName }),
        }
      );
      if (!res.ok) throw new Error(t("claimError"));
      alert(t("claimSuccess"));
      window.location.reload();
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  return (
    <div className="found-detail-wrapper">
      <div className="found-detail-back-row">
        <button
          className="found-detail-back-btn"
          onClick={() => navigate(-1)}
          type="button"
        >
          ← {t("foundBack")}
        </button>
      </div>

      {loading && <p>{t("foundLoading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <div className="found-detail-card">
          {item.image ? (
            <img
              src={`http://localhost:8090${item.image}`}
              alt={t("foundImageAlt")}
              className="found-detail-image"
            />
          ) : (
            <div
              className="found-detail-image"
              style={{
                background: "var(--color-bg-empty, #f5f5f5)",
                textAlign: "center",
                lineHeight: "200px",
                color: "#aaa",
              }}
            >
              {t("noImage")}
            </div>
          )}

          <h2 className="found-detail-title">{item.title}</h2>
          <p className="found-detail-meta">
            📍 {t("locationLabel")}: {item.location}
          </p>
          <p className="found-detail-meta">
            🗓️ {t("foundDateLabel")}:{" "}
            {new Date(item.date).toLocaleDateString("ko-KR")}
          </p>

          {item.claimed_by && (
            <p className="found-detail-status">
              ✅ {t("foundClaimedStatus")}: {item.claimed_by}
            </p>
          )}

          <p className="found-detail-description">{item.description}</p>
          <p className="found-detail-created">
            {t("registrationDate")}:{" "}
            {new Date(item.created_at).toLocaleDateString("ko-KR")}
          </p>

          <div className="found-detail-storage-box">
            <p className="found-detail-storage-row">
              📌 <strong>{t("storagePlace")}:</strong>{" "}
              {t("storageLocationDetail")}
            </p>
            <p className="found-detail-storage-row">
              ⏳ <strong>{t("storageExpiryLabel")}:</strong>{" "}
              {new Date(
                new Date(item.created_at).getTime() + 14 * 86400000
              ).toLocaleDateString("ko-KR")}
            </p>
            <p className="found-detail-storage-desc">
              📋 {t("storageExpiryDesc")}
            </p>
          </div>

          {user?.role === "admin" && (
            <div className="found-detail-claim-input">
              <input
                type="text"
                placeholder={t("이름을 입력하세요")}
                value={claimedName}
                onChange={(e) => setClaimedName(e.target.value)}
              />
              <button
                className="found-detail-claim-button"
                onClick={handleClaim}
              >
                {t("claimButton")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
