// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LostListPage from "./pages/LostListPage";
import LostCreatePage from "./pages/LostCreatePage";
import FoundDetailPage from "./pages/FoundDetailPage";
import ClaimPage from "./pages/ClaimPage";
import MyPage from "./pages/MyPage";
import NavBar from "./components/NavBar";
import "./mobile-ui.css";
import LoginPage from "./pages/LoginPage";
import LostRequestPage from "./pages/LostRequestPage";
import LostRequestListPage from "./pages/LostRequestListPage";
import NoticeManagerPage from "./pages/NoticeManagerPage";
import LostRequestDetailPage from "./pages/LostRequestDetailPage";
import MessageSendPage from "./pages/MessageSendPage";
import MessageInboxPage from "./pages/MessageInboxPage";
import MessageSentPage from "./pages/MessageSentPage";
import MessageDetailPage from "./pages/MessageDetailPage";
import SendMessagePage from "./pages/SendMessagePage";
import InquiryListPage from "./pages/InquiryListPage";
import InquiryDetailPage from "./pages/InquiryDetailPage";
import ContactPage from "./pages/ContactPage";
import AdminInquiryListPage from "./pages/AdminInquiryListPage";
import MyPostsPage from "./pages/MyPostsPage";
import AdminPostsPage from "./pages/AdminPostsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SettingsPage from "./pages/SettingsPage";
import EasterEggPage from "./pages/EasterEggPage";
import EditFeedbackPage from "./pages/EditFeedbackPage";
import EditInquiryPage from "./pages/EditInquiryPage";
import EditFoundItemPage from "./pages/EditFoundItemPage";
import EditLostItemPage from "./pages/EditLostItemPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminEditPage from "./pages/AdminEditPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          {/* 여기에 모든 Route 정의 */}
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact/history" element={<InquiryListPage />} />
          <Route path="/contact/:id" element={<InquiryDetailPage />} />
          <Route path="/admin/inquiries" element={<AdminInquiryListPage />} />
          <Route path="/myposts" element={<MyPostsPage />} />
          <Route path="/admin/posts" element={<AdminPostsPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/easter-egg" element={<EasterEggPage />} />
          <Route path="/edit/피드백/:id" element={<EditFeedbackPage />} />
          <Route path="/edit/문의하기/:id" element={<EditInquiryPage />} />
          <Route path="/edit/습득물/:id" element={<EditFoundItemPage />} />
          <Route path="/edit/분실물/:id" element={<EditLostItemPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/edit/:type/:id" element={<AdminEditPage />} />
          
        </Routes>
      </div>
      <NavBar />
    </BrowserRouter>
  );
}

export default App;
