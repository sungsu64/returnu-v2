import { useEffect, useState } from "react";
import "../styles/NoticeSlider.css"; // ✔︎ 정확한 파일 경로로 수정

export default function NoticeSlider({ notices }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notices.length]);

  if (!notices || notices.length === 0) return null;

  return (
    <div className="notice-slider">
    📢 <strong>{notices[index].title}</strong><br />
    <span className="notice-content">{notices[index].content}</span>
  </div>
  
  );
}
