// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LostListPage from "./pages/LostListPage";
import LostCreatePage from "./pages/LostCreatePage";
import FoundDetailPage from "./pages/FoundDetailPage";
import ClaimPage from "./pages/ClaimPage";

import NavBar from "./components/NavBar";    // ← 추가
import "./mobile-ui.css";

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lost/list" element={<LostListPage />} />
          <Route path="/lost/create" element={<LostCreatePage />} />
          <Route path="/found/:id" element={<FoundDetailPage />} />
          <Route path="/claim/:id" element={<ClaimPage />} />
        </Routes>

        <NavBar />  {/* ← 하단 네비게이션 */}
      </BrowserRouter>
    </div>
  );
}

export default App;
//sugnsu
