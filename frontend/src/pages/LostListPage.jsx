// src/pages/LostListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../locale";
import "../styles/LostListPage.css";
import emptyImage from "./assets/empty.png";

export default function LostListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  // 데이터 및 페이징 상태
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("desc");          // 최신순/오래된순
  const [status, setStatus] = useState("all");         // 상태 필터
  const [filterCat, setFilterCat] = useState("all");   // 카테고리 필터
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 검색어, 상태, 카테고리: URL 파라미터로부터
  const queryParams = new URLSearchParams(location.search);
  const urlQuery  = queryParams.get("query")  || "";
  const urlStatus = queryParams.get("status") || "all";
  const urlCat    = queryParams.get("cat")    || "all";

  // 로컬 스토리지에 저장된 사용자
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // URL 파라미터가 바뀌면 상태 업데이트
  useEffect(() => {
    setSearch(urlQuery);
    setStatus(urlStatus);
    setFilterCat(urlCat);
  }, [urlQuery, urlStatus, urlCat]);

  const [search, setSearch] = useState(urlQuery);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year:   "numeric",
      month:  "long",
      day:    "numeric",
      weekday:"short",
    });
  };
  const formatExpireDate = (dateString) => {
    const date = new Date(dateString);
    const expire = new Date(date.getTime() + 14 * 86400000);
    return expire.toLocaleDateString("ko-KR", {
      year:   "numeric",
      month:  "numeric",
      day:    "numeric",
      weekday:"short",
    });
  };

  // 백엔드에서 검색 결과 가져오기
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const statusParam = status   === "all" ? "" : `&status=${encodeURIComponent(status)}`;
        const catParam    = filterCat=== "all" ? "" : `&cat=${encodeURIComponent(filterCat)}`;
        // 검색 전용 엔드포인트 사용
        const url = `http://localhost:8090/api/lost-items/search?query=${encodeURIComponent(
          search
        )}${statusParam}${catParam}&order=${order}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(t("cannotLoadItems"));
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search, status, filterCat, order, t]);

  // 삭제 (관리자 전용)
  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteRequest"))) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t("deleteFailed"));
      alert(t("deleteSuccess"));
      window.location.reload();
    } catch (err) {
      alert(t("errorOccurred") + err.message);
    }
  };

  // 페이징
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginated = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageClick = (page) => setCurrentPage(page);

  return (
    <div className="lost-list-wrapper">
      <h1
        className="lost-list-title"
        style={{
          textAlign: "center",
          color: "#21761d",
          margin: "0 0 18px 0"
        }}
      >
        <span
          role="img"
          aria-label="box"
          style={{ fontSize: "2.1rem", verticalAlign: "-5px" }}
        >
          📦
        </span>
        <span style={{ fontSize: "2rem", fontWeight: 700, marginLeft: 8 }}>
          {t("lostListTitle")}
        </span>
      </h1>

      {/* 검색창 */}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", justifyContent: "center", margin: "0 0 22px 0" }}
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width:            "90%",
            minWidth:         "340px",
            maxWidth:         "620px",
            padding:          "6px 32px",
            height:           "38px",
            borderRadius:     "18px",
            border:           "1.5px solid #bcbcbc",
            outline:          "none",
            fontSize:         "1rem",
            color:            "#444",
            background:       "#fff",
            boxSizing:        "border-box",
            margin:           "0 auto",
            boxShadow:        "0 2px 8px rgba(60,100,80,0.04)",
            transition:       "border-color 0.2s",
          }}
        />
      </form>

      {/* 정렬 / 상태 필터 */}
      <div
        className="lost-list-filters"
        style={{
          display: "flex",
          justifyContent: "center",
          gap:        "16px",
          marginBottom: "24px"
        }}
      >
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{
            padding:     "8px 16px",
            borderRadius:"10px",
            border:      "1px solid #ccc",
            fontSize:    "0.95rem",
            background:  "#fff",
            cursor:      "pointer",
            minWidth:    "120px"
          }}
        >
          <option value="desc">{t("sortNew")}</option>
          <option value="asc">{t("sortOld")}</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding:     "8px 16px",
            borderRadius:"10px",
            border:      "1px solid #ccc",
            fontSize:    "0.95rem",
            background:  "#fff",
            cursor:      "pointer",
            minWidth:    "120px"
          }}
        >
          <option value="all">{t("statusAll")}</option>
          <option value="unclaimed">{t("statusUnclaimed")}</option>
          <option value="claimed">{t("statusClaimed")}</option>
        </select>
      </div>

      {/* 로딩 / 에러 / 빈 상태 */}
      {loading && <div className="spinner-container"><div className="spinner"></div></div>}
      {error   && <p className="lost-list-error">{error}</p>}
      {!loading && items.length === 0 && (
        <div className="lost-list-empty">
          <img src={emptyImage} alt={t("noResultsAlt")} />
          <p>{t("noResults")}</p>
        </div>
      )}

      {/* 아이템 카드 */}
      {!loading && paginated.map((item) => (
        <div
          key={item.id}
          className={`lost-item-card ${item.claimed_by ? "claimed" : ""}`}
          onClick={() => navigate(`/found/${item.id}`)}
        >
          <div className="thumbnail-box">
            <img
              src={`http://localhost:8090${item.image}`}
              alt={t("thumbnailAlt")}
            />
            {item.claimed_by && (
              <div className="claimed-badge">{t("statusClaimedBadge")}</div>
            )}
          </div>
          <div className="lost-item-body">
            <h3 className="lost-item-title">{item.title}</h3>
            <p className="meta">📍 {item.location}</p>
            <p className="meta">🗓 {formatDate(item.date)}</p>
            <p
              className="meta"
              style={{ color: "#d32f2f", fontWeight: 500 }}
            >
              ⏳ {t("expireLabel")}: {formatExpireDate(item.created_at)}
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              {t("delete")}
            </button>
          )}
        </div>
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              style={{
                padding:      "8px 12px",
                margin:       "0 4px",
                borderRadius: "8px",
                border:       "1px solid #ccc",
                background:   currentPage === pageNum ? "#ffcc80" : "#fff",
                fontWeight:   currentPage === pageNum ? "bold" : "normal",
                cursor:       "pointer",
              }}
            >
              {pageNum}
            </button>
          ))}
          <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            {t("pageInfo", { current: currentPage, total: totalPages })}
          </p>
        </div>
      )}
    </div>
  );
}
