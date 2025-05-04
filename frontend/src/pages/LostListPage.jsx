import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./spinner.css";
import emptyImage from "./assets/empty.png";

export default function LostListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("desc");
  const [status, setStatus] = useState("전체");

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const cat = queryParams.get("cat") || "전체";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const catParam = cat === "전체" ? "" : `&cat=${encodeURIComponent(cat)}`;
        const statusParam = status === "전체" ? "" : `&status=${encodeURIComponent(status)}`;
        const url = `http://localhost:8090/api/lost-items/search?query=${encodeURIComponent(
          query
        )}${catParam}${statusParam}&order=${order}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("목록을 불러올 수 없습니다.");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query, cat, order, status]);

  return (
    <div className="app-wrapper">
      <h1 className="title">분실물 목록</h1>

      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            style={{ padding: "6px", fontSize: "0.9rem" }}
          >
            <option value="desc">📅 최신순</option>
            <option value="asc">📆 오래된순</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "6px", fontSize: "0.9rem" }}
          >
            <option value="전체">📦 전체</option>
            <option value="미수령">📭 미수령</option>
            <option value="수령완료">✅ 수령완료</option>
          </select>
        </div>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <img src={emptyImage} alt="결과 없음" style={{ width: "180px", opacity: 0.6 }} />
            <p style={{ color: "#888", marginTop: "12px" }}>검색 결과가 없습니다.</p>
          </div>
        )}

        {!loading &&
          items.map((item) => (
            <div
              className="card"
              key={item.id}
              onClick={() => navigate(`/found/${item.id}`)}
              style={{
                cursor: "pointer",
                opacity: item.claimed_by ? 0.6 : 1,
                backgroundColor: item.claimed_by ? "#f0f0f0" : "white",
                marginBottom: "16px",
              }}
            >
              {/* ✅ 썸네일 이미지 */}
              {item.image && (
                <img
                  src={`http://localhost:8090${item.image}`}
                  alt="분실물 썸네일"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
              )}

              <h3 style={{ margin: 0, color: "#263238" }}>
                {item.title}{" "}
                {item.claimed_by && (
                  <span style={{ color: "#009688", fontSize: "0.8rem" }}>✅ 수령완료</span>
                )}
              </h3>
              <p className="meta">📍 {item.location}</p>
              <p className="meta">🗓️ {item.date}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
