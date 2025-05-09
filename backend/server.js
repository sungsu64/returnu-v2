// express 서버 설정 관련 모듈들 불러오기
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8090; // 포트번호 (환경변수 없으면 기본값 8090)

// 공통 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 본문 파싱
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 업로드된 이미지 접근 허용
app.use(express.static(path.join(__dirname, "../frontend/build"))); // React 앱 정적 파일 서빙

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "returnu-v2",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
    return;
  }
  console.log("✅ MySQL 연결 성공!");
});

// 이미지 파일 저장 설정 (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 저장 경로
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 확장자 추출
    cb(null, `${Date.now()}${ext}`); // 파일명: 현재시간.확장자
  },
});
const upload = multer({ storage }); // multer 객체 생성

// 🔽 API 라우터 시작 🔽

// 최근 분실물 4개 조회
app.get("/api/lost-items", (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by
    FROM lost_items
    WHERE claimed_by IS NULL OR claimed_by = ''
    ORDER BY id DESC LIMIT ?
  `;
  connection.query(query, [limit], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// 분실물 등록 (이미지 포함)
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

// 분실물 검색
app.get("/api/lost-items/search", (req, res) => {
  const query = req.query.query || "";
  const cat = req.query.cat || "전체";
  const status = req.query.status || "전체";
  const order = req.query.order === "asc" ? "ASC" : "DESC";

  const likeQuery = `%${query}%`;
  let sql = `
    SELECT id, title, location, date, claimed_by, image
    FROM lost_items
    WHERE title LIKE ?
  `;
  const values = [likeQuery];

  if (cat !== "전체") {
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

// 분실물 상세 조회
app.get("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, title, location, date, description, image, claimed_by,
           IFNULL(created_at, NOW()) as created_at
    FROM lost_items WHERE id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    if (results.length === 0) return res.status(404).send("데이터 없음");
    res.json(results[0]);
  });
});

// 분실물 수령 처리
app.post("/api/lost-items/claim/:id", (req, res) => {
  const { id } = req.params;
  const { claimed_by } = req.body;  // 여기에는 수령자 이름이 들어감

  const query = `
    UPDATE lost_items
    SET claimed_by = ?, claimed_at = NOW()
    WHERE id = ?
  `;
  connection.query(query, [claimed_by, id], (err) => {
    if (err) return res.status(500).send("서버 에러");
    res.status(200).json({ message: "수령 처리 완료" });
  });
});

// 분실물 삭제
app.delete("/api/lost-items/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM lost_items WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("서버 에러");
    if (result.affectedRows === 0) return res.status(404).send("데이터 없음");
    res.status(200).json({ message: "삭제 완료" });
  });
});

// 로그인 처리
app.post("/api/login", (req, res) => {
  const { student_id, password } = req.body;
  if (!student_id || !password) {
    return res.status(400).json({ error: "학번과 비밀번호를 입력해주세요." });
  }

  const query = `
    SELECT name, student_id, role
    FROM users
    WHERE student_id = ? AND password = ?
  `;
  connection.query(query, [student_id, password], (err, results) => {
    if (err) return res.status(500).json({ error: "서버 오류" });
    if (results.length === 0) {
      return res.status(401).json({ error: "학번 또는 비밀번호가 일치하지 않습니다." });
    }
    res.json({ user: results[0] });
  });
});

// 공지사항 조회
app.get("/api/notices", (req, res) => {
  const query = `SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send("서버 에러");
    res.json(results);
  });
});

// React 앱 나머지 경로 처리 (SPA 라우팅용)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// 서버 실행 시작
app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});
