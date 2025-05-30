// src/locale/index.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { messages } from "./langContent";

const LangContext = createContext({
  lang: "ko",
  t: (key) => key,
  setLang: () => {},
});

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "ko"
  );

  // 로컬스토리지에 언어 설정 저장
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // key가 “namespace.key” 형태일 때 .으로 분리해서 깊은 객체에서 가져오기도 가능
  const t = (key) => {
    const keys = key.split(".");
    let res = messages[lang] || {};
    for (const k of keys) {
      res = res[k];
      if (res == null) return key; // 없는 키면 키 자체 리턴
    }
    return res;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
