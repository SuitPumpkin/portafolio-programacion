import { motion } from "motion/react";
import "./TaskShowcase.css";

const TaskShowcase = ({ task }) => {
  const Component = task.component;

  return (
    <motion.article
      className="task-showcase"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="task-showcase-header">
        <div className="task-showcase-meta">
          <span className="task-showcase-num">{task.number}</span>
          <div>
            <h3 className="task-showcase-title">{task.title}</h3>
            <p className="task-showcase-desc">{task.description}</p>
          </div>
        </div>
      </div>

      <div className="task-showcase-body">
        <Component {...task.props} />
      </div>
    </motion.article>
  );
};

export default TaskShowcase;
