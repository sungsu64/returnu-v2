// ✅ backend/server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 8090;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "returnu-v2",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ 최근 분실물
app.get("/api/lost-items", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by
    FROM lost_items
    WHERE claimed_by IS NULL OR claimed_by = ''
    ORDER BY id DESC
    LIMIT ?
  `;
  connection.query(query, [limit], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});


// ✅ 분실물 등록
app.post("/api/lost-items", upload.single("image"), (req, res) => {
  const { title, location, date, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !location || !date || !category) {
    return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
  }

  const sql = `
    INSERT INTO lost_items (title, location, date, description, category, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [title, location, date, description, category, imagePath];

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    res.status(201).json({ message: "등록 성공", id: result.insertId });
  });
});

// ✅ 검색 + 필터 (항상 상세 조회보다 먼저!)
app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const cat = req.query.cat || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  const status = req.query.status || "전체";

  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

  if (cat && cat !== "전체") {
    sql += ` AND category = ?`;
    values.push(cat);
  }

  if (status === "미수령") {
    sql += ` AND (claimed_by IS NULL OR claimed_by = '')`;
  } else if (status === "수령완료") {
    sql += ` AND claimed_by IS NOT NULL AND claimed_by != ''`;
  }

  sql += ` ORDER BY date ${order}`;

  connection.query(sql, values, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results);
  });
});

// ✅ 분실물 상세 (search보다 항상 뒤에 위치해야 함)
app.get("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by,
           IFNULL(created_at, NOW()) as created_at
    FROM lost_items
    WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results[0]);
  });
});

// ✅ 수령 처리
app.post("/api/lost-items/claim/:id", (req, res) => {
  const { id } = req.params;
  const { claimed_by } = req.body;

  const query = `
    UPDATE lost_items
    SET claimed_by = ?, claimed_at = NOW()
    WHERE id = ?
  `;

  connection.query(query, [claimed_by, id], (err, result) => {
    if (err) return res.status(500).send("서버 에러");
    res.status(200).json({ message: "수령 처리 완료" });
  });
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
