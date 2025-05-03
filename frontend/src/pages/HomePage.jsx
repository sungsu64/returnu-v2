import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile-ui.css";

const CATEGORY_LIST = ["전체", "지갑", "휴대폰", "노트북", "이어폰", "열쇠", "기타"];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCat(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8090/api/lost-items?limit=10");
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다");
        const data = await res.json();
        console.log("최근 분실물:", data);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/lost/list?query=${encodeURIComponent(search)}&cat=${encodeURIComponent(category)}`);
  };

  return (
    <div className="app-wrapper">
      <h1 className="title">📦 ReturnU</h1>
      <p style={{ textAlign: "center", color: "#607d8b", marginBottom: "24px" }}>학교 분실물 검색 서비스</p>

      <form onSubmit={handleSearch} style={{ maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div
            ref={catRef}
            style={{
              padding: "0 12px",
              background: "#f0f0f0",
              color: "#333",
              fontSize: "0.9rem",
              height: "48px",
              lineHeight: "48px",
              border: "1px solid #ccc",
              borderRadius: "8px 0 0 8px",
              cursor: "pointer",
              userSelect: "none",
              boxSizing: "border-box"
            }}
            onClick={() => setOpenCat((o) => !o)}
          >
            {category} ▾
            {openCat && (
              <ul style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "#fff",
                border: "1px solid #ccc",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 10,
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}>
                {CATEGORY_LIST.map((cat) => (
                  <li
                    key={cat}
                    style={{ padding: "10px 12px", cursor: "pointer", fontSize: "0.9rem" }}
                    onClick={() => {
                      setCategory(cat);
                      setOpenCat(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ position: "relative", flex: 1, height: "48px" }}>
            <input
              type="text"
              className="input"
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: "0 48px 0 16px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderLeft: "none",
                borderRadius: "0 8px 8px 0",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button type="submit" style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: "#888",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}>🔍</button>
          </div>
        </div>
      </form>

      <section style={{ marginTop: "32px", padding: "0 16px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#607d8b" }}>최근 등록된 분실물</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && posts.length === 0 && <p>등록된 분실물이 없습니다.</p>}

        {!loading && posts.map((post) => (
          <div
            className="card"
            key={post.id}
            onClick={() => navigate(`/found/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 style={{ margin: 0, color: "#263238" }}>{post.title}</h3>
            <p className="meta">📍 {post.location}</p>
            <p className="meta">🗓️ {new Date(post.date).toLocaleDateString("ko-KR")}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
