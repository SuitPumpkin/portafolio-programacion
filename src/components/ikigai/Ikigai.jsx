import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Ikigai.css";

const positions = [
    { x: 50, y: 7 },
    { x: 84, y: 25 },
    { x: 84, y: 75 },
    { x: 50, y: 93 },
    { x: 16, y: 75 },
    { x: 16, y: 25 },
];

function ListContent({ items }) {
    return (
        <ul className="ikigai-list">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

function IkigaiSection({ title, items, className }) {
    return (
        <div className={`ikigai-section ${className}`}>
            <h3>{title}</h3>

            <ListContent items={items} />
        </div>
    );
}

export default function Ikigai({
    love = [],
    goodAt = [],
    worldNeeds = [],
    paidFor = [],

    mission = [],
    profession = [],
    passion = [],
    vocation = [],

    career = [],
    rarity = [],
    archetype = [],
    personality = [],

    projects = [],
}) {
    const [activeProject, setActiveProject] = useState(null);

    const activeProjectData =
        activeProject !== null ? projects[activeProject] : null;

    return (
        <section className="ikigai-container">
            <div className="ikigai-header">
                <span className="ikigai-eyebrow">SEMANA 01</span>

                <h2>Mi Ikigai</h2>

                <p>
                    Una representación visual de lo que me apasiona, mis habilidades,
                    lo que puedo aportar y las oportunidades que puedo desarrollar.
                </p>
            </div>

            <div className="ikigai-stage">
                {/* =========================================================
            CONECTORES DE PROYECTOS
        ========================================================= */}

                <svg
                    className="ikigai-project-lines"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <filter id="ikigai-glow">
                            <feGaussianBlur stdDeviation="0.8" result="blur" />

                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <marker
                            id="arrow-normal"
                            markerWidth="4"
                            markerHeight="4"
                            refX="3"
                            refY="2"
                            orient="auto"
                        >
                            <path d="M0,0 L4,2 L0,4 Z" fill="#7c3aed" />
                        </marker>

                        <marker
                            id="arrow-active"
                            markerWidth="4"
                            markerHeight="4"
                            refX="3"
                            refY="2"
                            orient="auto"
                        >
                            <path d="M0,0 L4,2 L0,4 Z" fill="#c084fc" />
                        </marker>
                    </defs>

                    {projects.map((project, index) => {
                        const position = positions[index % positions.length];
                        const isActive = activeProject === index;

                        return (
                            <motion.line
                                key={project.nombre}
                                x1="50"
                                y1="50"
                                x2={position.x}
                                y2={position.y}
                                className="ikigai-project-line"
                                animate={{
                                    opacity: isActive ? 1 : 0.35,
                                    strokeWidth: isActive ? 0.8 : 0.35,
                                }}
                                transition={{ duration: 0.25 }}
                                stroke={isActive ? "#c084fc" : "#7c3aed"}
                                markerEnd={
                                    isActive
                                        ? "url(#arrow-active)"
                                        : "url(#arrow-normal)"
                                }
                                filter={isActive ? "url(#ikigai-glow)" : undefined}
                            />
                        );
                    })}
                </svg>

                {/* =========================================================
            DIAGRAMA IKIGAI
        ========================================================= */}

                <motion.div
                    className="ikigai-diagram"
                    animate={{
                        scale: activeProject !== null ? 1.015 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 20,
                    }}
                >
                    {/* Círculos principales */}

                    <div className="ikigai-circle circle-love">
                        <IkigaiSection
                            title="Lo que amo"
                            items={love}
                            className="section-love"
                        />
                    </div>

                    <div className="ikigai-circle circle-world">
                        <IkigaiSection
                            title="El mundo necesita"
                            items={worldNeeds}
                            className="section-world"
                        />
                    </div>

                    <div className="ikigai-circle circle-good">
                        <IkigaiSection
                            title="Para lo que soy bueno"
                            items={goodAt}
                            className="section-good"
                        />
                    </div>

                    <div className="ikigai-circle circle-paid">
                        <IkigaiSection
                            title="Por lo que pueden pagarme"
                            items={paidFor}
                            className="section-paid"
                        />
                    </div>

                    {/* Intersecciones */}

                    <div className="ikigai-intersection intersection-mission">
                        <strong>Misión</strong>
                        <ListContent items={mission} />
                    </div>

                    <div className="ikigai-intersection intersection-vocation">
                        <strong>Vocación</strong>
                        <ListContent items={vocation} />
                    </div>

                    <div className="ikigai-intersection intersection-profession">
                        <strong>Profesión</strong>
                        <ListContent items={profession} />
                    </div>

                    <div className="ikigai-intersection intersection-passion">
                        <strong>Pasión</strong>
                        <ListContent items={passion} />
                    </div>

                    {/* Segunda capa */}

                    <div className="ikigai-small-label label-personality">
                        <span>Personalidad</span>

                        <ListContent items={personality} />
                    </div>

                    <div className="ikigai-small-label label-career">
                        <span>Carrera</span>

                        <ListContent items={career} />
                    </div>

                    <div className="ikigai-small-label label-rarity">
                        <span>Rareza</span>

                        <ListContent items={rarity} />
                    </div>

                    <div className="ikigai-small-label label-archetype">
                        <span>Arquetipo</span>

                        <ListContent items={archetype} />
                    </div>

                    {/* Centro */}

                    <motion.div
                        className={`ikigai-core ${activeProject !== null ? "is-active" : ""
                            }`}
                        animate={{
                            scale: activeProject !== null ? 1.08 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                        }}
                    >
                        <span>IKIGAI</span>
                    </motion.div>
                </motion.div>

                {/* =========================================================
            PROYECTOS
        ========================================================= */}

                {projects.map((project, index) => {
                    const position = positions[index % positions.length];
                    const isActive = activeProject === index;

                    return (
                        <motion.div
                            key={project.nombre}
                            className={`ikigai-project ${isActive ? "is-active" : ""
                                }`}
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{
                                opacity: 1,
                                scale: isActive ? 1.08 : 1,
                            }}
                            transition={{
                                duration: 0.35,
                                delay: index * 0.08,
                            }}
                            onMouseEnter={() => setActiveProject(index)}
                            onMouseLeave={() => setActiveProject(null)}
                        >
                            <div className="project-card">
                                <span className="project-number">
                                    0{index + 1}
                                </span>

                                <h3>{project.nombre}</h3>

                                <div className="project-technologies">
                                    {project.tecnologias.map((technology) => (
                                        <span key={technology}>
                                            {technology}
                                        </span>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            className="project-description"
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                        >
                                            {project.descripcion}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}