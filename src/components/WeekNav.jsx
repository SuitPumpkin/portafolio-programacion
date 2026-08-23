import { useEffect, useState } from "react";
import "./WeekNav.css";

const WeekNav = ({ weeks }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`week-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="week-nav-inner">
        <div className="week-nav-brand">
          <span className="week-nav-logo">{"</>"}</span>
          <span className="week-nav-title">Portafolio</span>
        </div>

        <div className="week-nav-links">
          {weeks.map((week) => (
            <button
              key={week.id}
              onClick={() => scrollTo(week.id)}
              className="week-nav-link"
            >
              <span className="week-nav-num">Semana {week.number}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default WeekNav;
