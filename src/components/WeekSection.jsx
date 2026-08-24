import { useState, useEffect } from "react";
import { Skeleton } from "boneyard-js/react";
import { motion } from "motion/react";
import TaskShowcase from "./TaskShowcase";
import "./WeekSection.css";

const WeekSection = ({ week }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskLoading, setTaskLoading] = useState(true);
  const task = week.tasks[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => setTaskLoading(false), 400);
    return () => clearTimeout(timer);
  }, [currentIndex, task.id]);

  const goTo = (index) => {
    setCurrentIndex(index);
    setTaskLoading(true);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => {
      const next = prev > 0 ? prev - 1 : week.tasks.length - 1;
      setTaskLoading(true);
      return next;
    });
  };

  const goNext = () => {
    setCurrentIndex((prev) => {
      const next = prev < week.tasks.length - 1 ? prev + 1 : 0;
      setTaskLoading(true);
      return next;
    });
  };

  return (
    <section id={week.id} className="week-section">
      <div className="week-section-inner">
        <motion.div
          className="week-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="week-eyebrow">
            <span className="week-eyebrow-num">{week.number}</span>
            <span className="week-eyebrow-sep">/</span>
            <span>SEMANA</span>
          </span>
          <h2 className="week-title">{week.title}</h2>
          <p className="week-description">{week.description}</p>
        </motion.div>

        <div className="week-showcase">
          
          <div className="week-showcase-controls">
            <button
              className="showcase-btn showcase-btn-prev"
              onClick={goPrev}
              aria-label="Anterior"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Anterior</span>
            </button>

            <div className="showcase-dots">
              {week.tasks.map((t, index) => (
                <button
                  key={t.id}
                  className={`showcase-dot ${index === currentIndex ? "is-active" : ""}`}
                  onClick={() => goTo(index)}
                  aria-label={`Ir a ${t.title}`}
                />
              ))}
            </div>

            <button
              className="showcase-btn showcase-btn-next"
              onClick={goNext}
              aria-label="Siguiente"
            >
              <span>Siguiente</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          <div className="week-showcase-viewport">
            {week.tasks.map((t, index) => (
              <div
                key={t.id}
                className={`week-showcase-slide ${index === currentIndex ? "is-active" : ""}`}
              >
                <Skeleton key={`skeleton-${t.id}`} name={`task-${t.id}`} loading={taskLoading && index === currentIndex}>
                  <TaskShowcase task={t} index={index} />
                </Skeleton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekSection;
