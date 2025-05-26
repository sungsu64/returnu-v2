// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LostListPage from "./pages/LostListPage";
import LostCreatePage from "./pages/LostCreatePage";
import FoundDetailPage from "./pages/FoundDetailPage";
import ClaimPage from "./pages/ClaimPage";
import MyPage from "./pages/MyPage"; // ✅ 내 정보 페이지 추가
import NavBar from "./components/NavBar"; // 하단 내비게이션 바
import "./mobile-ui.css";
import LoginPage from "./pages/LoginPage"; // ✅ 로그인 페이지 import 추가
import LostRequestPage from "./pages/LostRequestPage";
import LostRequestListPage from "./pages/LostRequestListPage";
import NoticeManagerPage from "./pages/NoticeManagerPage";
import LostRequestDetailPage from "./pages/LostRequestDetailPage";
import MessageSendPage from "./pages/MessageSendPage";
import MessageInboxPage from "./pages/MessageInboxPage";
import MessageSentPage from "./pages/MessageSentPage";
import MessageDetailPage from "./pages/MessageDetailPage";
import SendMessagePage from "./pages/SendMessagePage";


function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lost/list" element={<LostListPage />} />
          <Route path="/lost/create" element={<LostCreatePage />} />
          <Route path="/found/:id" element={<FoundDetailPage />} />
          <Route path="/claim/:id" element={<ClaimPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lost-request" element={<LostRequestPage />} />
          <Route path="/requests" element={<LostRequestListPage />} />
          <Route path="/notices/manage" element={<NoticeManagerPage />} />
          <Route path="/requests/:id" element={<LostRequestDetailPage />} />
          <Route path="/message/send" element={<MessageSendPage />} />
          <Route path="/messages/inbox" element={<MessageInboxPage />} />
          <Route path="/messages/sent" element={<MessageSentPage />} />
          <Route path="/message/:id" element={<MessageDetailPage />} />
          <Route path="/send-message" element={<SendMessagePage />} />
        </Routes>
      </div>

      <NavBar /> {/* ✅ app-wrapper 바깥으로 이동 */}
    </BrowserRouter>
  );
}


export default App;
