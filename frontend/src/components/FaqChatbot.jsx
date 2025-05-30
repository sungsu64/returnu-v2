// src/components/FaqChatbot.jsx
import React, { useState } from "react";
import { useLang } from "../locale";
import "../styles/FaqChatbot.css";

export default function FaqChatbot() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const faqList = t("faqList"); // 배열 형태의 { question, answer } 리스트

  return (
    <div className="faq-chatbot">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">❓ {t("faqTitle")}</div>
          <div className="chat-body">
            {selected === null ? (
              faqList.map((item, idx) => (
                <button
                  key={idx}
                  className="chat-question"
                  onClick={() => setSelected(idx)}
                >
                  {item.question}
                </button>
              ))
            ) : (
              <>
                <div className="chat-q">{faqList[selected].question}</div>
                <div className="chat-a">{faqList[selected].answer}</div>
                <button
                  className="chat-back"
                  onClick={() => setSelected(null)}
                >
                  🔙 {t("back")}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        ❓
      </button>
    </div>
  );
}
