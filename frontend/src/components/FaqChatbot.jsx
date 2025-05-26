// src/components/FaqChatbot.jsx
import React, { useState } from "react";
import "./FaqChatbot.css";

const FAQ_LIST = [
  {
    question: "물건을 주웠는데 어떻게 하나요?",
    answer: "학생지원팀(학생회관 1층)으로 제출해주세요.",
  },
  {
    question: "찾으러 가면 뭘 가져가야 하나요?",
    answer: "본인 확인 가능한 신분증이 필요해요.",
  },
  {
    question: "분실물은 얼마나 보관되나요?",
    answer: "최대 2주까지 보관되며 이후 폐기됩니다.",
  },
];

export default function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="faq-chatbot">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">❓ FAQ 챗봇</div>
          <div className="chat-body">
            {selected === null ? (
              FAQ_LIST.map((item, idx) => (
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
                <div className="chat-q">{FAQ_LIST[selected].question}</div>
                <div className="chat-a">{FAQ_LIST[selected].answer}</div>
                <button className="chat-back" onClick={() => setSelected(null)}>
                  🔙 돌아가기
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        ❓
      </button>
    </div>
  );
}
