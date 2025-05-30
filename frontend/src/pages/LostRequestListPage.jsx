// src/pages/LostRequestListPage.jsx
import React, { useEffect, useState } from "react";
import placeholderImg from "../pages/assets/empty.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../locale";

// URL 쿼리 파싱 훅
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function LostRequestListPage() {
  const { t } = useLang();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const isDark =
    typeof document !== "undefined" &&
    document.body.classList.contains("dark");

  const query = useQuery();
  const urlSearch = query.get("query") || "";
  const [search, setSearch] = useState(urlSearch);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8090/api/lost-requests");
        if (!res.ok) throw new Error(t("cannotLoadRequests"));
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteRequest"))) return;
    try {
      const res = await fetch(
        `http://localhost:8090/api/lost-requests/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(t("deleteFailed"));
      alert(t("deleted"));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  const filtered = requests.filter((req) => {
    const txt = search.toLowerCase();
    return (
      !search ||
      (req.title && req.title.toLowerCase().includes(txt)) ||
      (req.description && req.description.toLowerCase().includes(txt))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.date || a.created_at);
    const dateB = new Date(b.date || b.created_at);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  if (loading)
    return (
      <p
        className="loading-text"
        style={{ color: isDark ? "#ffe4ad" : "#222" }}
      >
        ⏳ {t("loading")}
      </p>
    );
  if (error)
    return (
      <p
        className="error-text"
        style={{ color: isDark ? "#ffa88d" : "crimson" }}
      >
        {t("error")}: {error}
      </p>
    );

  return (
    <div
      className="request-list-wrapper"
      style={{
        paddingBottom: "80px",
        background: isDark ? "#23242c" : "#fafafa",
        minHeight: "100vh",
        transition: "background 0.2s",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: isDark ? "#ffd377" : "#222",
        }}
      >
        📢 {t("lostRequestListTitle")}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          margin: "10px 0 24px 0",
        }}
      >
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "10px",
            border: `1px solid ${isDark ? "#393a4b" : "#ccc"}`,
            fontSize: "0.95rem",
            background: isDark ? "#35364b" : "#fff",
            color: isDark ? "#ffe4ad" : "#222",
            cursor: "pointer",
            minWidth: "120px",
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        >
          <option value="desc">{t("sortNew")}</option>
          <option value="asc">{t("sortOld")}</option>
        </select>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "68%",
            padding: "10px 16px",
            borderRadius: "20px",
            border: `1px solid ${isDark ? "#393a4b" : "#ccc"}`,
            outline: "none",
            fontSize: "0.97rem",
            background: isDark ? "#232533" : "#fff",
            color: isDark ? "#ffe4ad" : "#222",
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        />
      </div>

      {paginated.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: isDark ? "#bbb" : "#888",
          }}
        >
          {t("noResults")}
        </p>
      ) : (
        paginated.map((req) => (
          <div
            key={req.id}
            style={{
              position: "relative",
              width: "92%",
              maxWidth: "440px",
              margin: "0 auto 20px",
              background: isDark ? "#232533" : "#fff",
              borderRadius: "18px",
              boxShadow: isDark
                ? "0 2px 8px rgba(0,0,0,0.18)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              fontSize: "0.9rem",
              display: "flex",
              flexDirection: "column",
              border: isDark ? "1px solid #393a4b" : "none",
              transition: "background 0.2s, border 0.2s",
            }}
          >
            <div
              onClick={() => navigate(`/requests/${req.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  req.image
                    ? `http://localhost:8090${req.image}`
                    : placeholderImg
                }
                alt={t("requestImageAlt")}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                  background: isDark ? "#35364b" : "#f3f3f3",
                }}
              />
              <div style={{ padding: "14px 18px", lineHeight: "1.5" }}>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "1.05rem",
                    color: isDark ? "#ffd377" : "#222",
                  }}
                >
                  {req.title}
                </h3>
                <p
                  style={{
                    margin: "4px 0",
                    color: isDark ? "#a5b6d3" : "#666",
                  }}
                >
                  📍 {req.location}
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    color: isDark ? "#a5b6d3" : "#666",
                  }}
                >
                  📅{" "}
                  {new Date(req.date || req.created_at).toLocaleDateString()}
                </p>
                <p
                  style={{
                    margin: "6px 0",
                    color: isDark ? "#ffe4ad" : "#444",
                  }}
                >
                  {req.description}
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    color: isDark ? "#ffe4ad" : "#444",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {req.phone && <>📞 {req.phone}</>}
                  {req.email && <>✉️ {req.email}</>}
                </p>
              </div>

              {user?.role === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(req.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "12px",
                    backgroundColor: "#ff6b6b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: isDark
                      ? "0 2px 8px rgba(0,0,0,0.18)"
                      : "none",
                  }}
                >
                  {t("delete")}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  padding: "8px 12px",
                  margin: "0 4px",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "#393a4b" : "#ccc"}`,
                  background:
                    currentPage === pageNum
                      ? isDark
                        ? "#ffd377"
                        : "#ffcc80"
                      : isDark
                      ? "#232533"
                      : "#fff",
                  color:
                    currentPage === pageNum
                      ? isDark
                        ? "#22242a"
                        : "#d18800"
                      : isDark
                      ? "#ffe4ad"
                      : "#222",
                  fontWeight: currentPage === pageNum ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                }}
              >
                {pageNum}
              </button>
            )
          )}
          <p
            style={{
              marginTop: "8px",
              fontSize: "0.85rem",
              color: isDark ? "#aaa" : "#666",
            }}
          >
            {t("pageInfo", { current: currentPage, total: totalPages })}
          </p>
        </div>
      )}
    </div>
  );
}
