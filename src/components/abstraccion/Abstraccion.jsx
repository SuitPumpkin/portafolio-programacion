import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Abstraccion.css";

function useTypewriter(text, active, speed = 25) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!active) {
            return;
        }

        let index = 0;

        const interval = setInterval(() => {
            index++;

            setDisplayedText(text.slice(0, index));

            if (index >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, active, speed]);

    return displayedText;
}

function CodePreview({ code }) {
    const typedCode = useTypewriter(code, true);

    return (
        <motion.div
            className="abstraction-code"
            initial={{
                opacity: 0,
                height: 0,
                y: -5,
            }}
            animate={{
                opacity: 1,
                height: "auto",
                y: 0,
            }}
            exit={{
                opacity: 0,
                height: 0,
                y: -5,
            }}
        >
            <div className="code-header">
                <span />
                <span />
                <span />

                <label>ejemplo.js</label>
            </div>

            <pre>
                <code>
                    {typedCode}
                    <span className="typing-cursor">▋</span>
                </code>
            </pre>
        </motion.div>
    );
}

function AbstractionNode({
    item,
    active,
    onEnter,
    onLeave,
    side,
}) {
    return (
        <motion.div
            className={`abstraction-node ${side === "left"
                ? "node-left"
                : "node-right"
                } ${active ? "is-active" : ""}`}
            animate={{
                scale: active ? 1.05 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        >
            <div className="node-title">
                <span className="node-dot" />

                <span>{item.titulo}</span>
            </div>

            <AnimatePresence>
                {active && (
                    <CodePreview code={item.ejemplificacion} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Abstraccion({
    titulo = "Abstracción",
    descripcion = "",
    svg,
    propiedades = [],
    metodos = [],
}) {
    const [active, setActive] = useState(null);

    const maxItems = Math.max(
        propiedades.length,
        metodos.length,
        1
    );

    const stageHeight = Math.max(
        500,
        maxItems * 115 + 80
    );

    const getY = (index) => {
        return (
            ((index + 0.5) / maxItems) *
            100
        );
    };

    const activeType =
        active?.type ?? null;

    const activeIndex =
        active?.index ?? null;

    return (
        <section className="abstraction-container">

            <div className="abstraction-header">
                <span className="abstraction-eyebrow">
                    PROGRAMACIÓN ORIENTADA A OBJETOS
                </span>

                <h2>{titulo}</h2>

                {descripcion && (
                    <p>{descripcion}</p>
                )}
            </div>

            <div
                className="abstraction-scroll"
            >
                <div
                    className="abstraction-stage"
                    style={{
                        height: `${stageHeight}px`,
                    }}
                >

                    <svg
                        className="abstraction-lines"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <filter id="abstraction-glow">
                                <feGaussianBlur
                                    stdDeviation="0.7"
                                    result="blur"
                                />

                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {propiedades.map((item, index) => {
                            const isActive =
                                activeType === "property" &&
                                activeIndex === index;

                            return (
                                <motion.line
                                    key={`property-line-${index}`}
                                    x1="31"
                                    y1={getY(index)}
                                    x2="46"
                                    y2="50"
                                    stroke={
                                        isActive
                                            ? "#a855f7"
                                            : "#d4d4d8"
                                    }
                                    strokeWidth={
                                        isActive ? "0.7" : "0.35"
                                    }
                                    strokeLinecap="round"
                                    initial={{
                                        opacity: 0.3,
                                    }}
                                    animate={{
                                        opacity: isActive
                                            ? 1
                                            : 0.3,
                                    }}
                                    filter={
                                        isActive
                                            ? "url(#abstraction-glow)"
                                            : undefined
                                    }
                                />
                            );
                        })}

                        {metodos.map((item, index) => {
                            const isActive =
                                activeType === "method" &&
                                activeIndex === index;

                            return (
                                <motion.line
                                    key={`method-line-${index}`}
                                    x1="69"
                                    y1={getY(index)}
                                    x2="54"
                                    y2="50"
                                    stroke={
                                        isActive
                                            ? "#a855f7"
                                            : "#d4d4d8"
                                    }
                                    strokeWidth={
                                        isActive ? "0.7" : "0.35"
                                    }
                                    strokeLinecap="round"
                                    initial={{
                                        opacity: 0.3,
                                    }}
                                    animate={{
                                        opacity: isActive
                                            ? 1
                                            : 0.3,
                                    }}
                                    filter={
                                        isActive
                                            ? "url(#abstraction-glow)"
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </svg>

                    <div className="abstraction-column properties-column">
                        <div className="column-label">
                            <span>01</span>
                            <h3>Propiedades</h3>
                        </div>

                        {propiedades.map(
                            (item, index) => (
                                <div
                                    key={item.titulo}
                                    className="node-position"
                                    style={{
                                        top: `${getY(index)}%`,
                                    }}
                                >
                                    <AbstractionNode
                                        item={item}
                                        side="left"
                                        active={
                                            activeType ===
                                            "property" &&
                                            activeIndex === index
                                        }
                                        onEnter={() =>
                                            setActive({
                                                type: "property",
                                                index,
                                            })
                                        }
                                        onLeave={() =>
                                            setActive(null)
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>

                    <motion.div
                        className="abstraction-object"
                        animate={
                            active
                                ? {
                                    rotate: [
                                        0,
                                        -1.5,
                                        1.5,
                                        -1,
                                        0,
                                    ],
                                }
                                : {
                                    rotate: 0,
                                }
                        }
                        transition={{
                            duration: 0.45,
                            repeat: active ? 1 : 0,
                        }}
                    >
                        <div className="object-glow" />

                        <div className="object-svg">
                            {svg}
                        </div>

                        <span className="object-name">
                            OBJETO
                        </span>
                    </motion.div>

                    <div className="abstraction-column methods-column">
                        <div className="column-label">
                            <span>02</span>
                            <h3>Métodos</h3>
                        </div>

                        {metodos.map(
                            (item, index) => (
                                <div
                                    key={item.titulo}
                                    className="node-position"
                                    style={{
                                        top: `${getY(index)}%`,
                                    }}
                                >
                                    <AbstractionNode
                                        item={item}
                                        side="right"
                                        active={
                                            activeType === "method" &&
                                            activeIndex === index
                                        }
                                        onEnter={() =>
                                            setActive({
                                                type: "method",
                                                index,
                                            })
                                        }
                                        onLeave={() =>
                                            setActive(null)
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}