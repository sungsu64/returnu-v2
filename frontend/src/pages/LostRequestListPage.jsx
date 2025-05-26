import React, { useEffect, useState } from "react";
import placeholderImg from "../pages/assets/empty.png";
import { useNavigate } from "react-router-dom";

export default function LostRequestListPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8090/api/lost-requests");
        if (!res.ok) throw new Error("요청글을 불러올 수 없습니다.");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:8090/api/lost-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제되었습니다.");
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert("에러: " + err.message);
    }
  };

  const filtered = requests.filter((req) =>
    req.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p className="loading-text">⏳ 로딩 중...</p>;
  if (error) return <p className="error-text">에러: {error}</p>;

  return (
    <div className="request-list-wrapper" style={{ paddingBottom: "80px" }}>
      <h2 style={{ textAlign: "center" }}>📮 물건을 찾아주세요!</h2>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <input
          type="text"
          placeholder="제목으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "80%",
            padding: "10px 16px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "0.95rem",
            marginBottom: "20px",
          }}
        />
      </div>

      {paginated.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>검색 결과가 없습니다.</p>
      ) : (
        paginated.map((req) => (
          <div
            key={req.id}
            style={{
              position: "relative",
              width: "92%",
              maxWidth: "440px",
              margin: "0 auto 20px",
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              fontSize: "0.9rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div onClick={() => navigate(`/requests/${req.id}`)} style={{ cursor: "pointer" }}>
              <img
                src={req.image ? `http://localhost:8090${req.image}` : placeholderImg}
                alt="요청 이미지"
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: "14px 18px", lineHeight: "1.5" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", color: "#222" }}>{req.title}</h3>
                <p style={{ margin: "4px 0", color: "#666" }}>📍 {req.location}</p>
                <p style={{ margin: "4px 0", color: "#666" }}>📅 {new Date(req.date).toLocaleDateString()}</p>
                <p style={{ margin: "6px 0", color: "#444" }}>{req.description}</p>
                <p style={{ margin: "4px 0", color: "#444", display: "flex", flexWrap: "wrap", gap: "6px" }}>
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
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* 페이지네이션 번호 버튼 */}
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              style={{
                padding: "8px 12px",
                margin: "0 4px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: currentPage === pageNum ? "#ffcc80" : "#fff",
                fontWeight: currentPage === pageNum ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {pageNum}
            </button>
          ))}
          <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            현재 페이지: {currentPage} / {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
