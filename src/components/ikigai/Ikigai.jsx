import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Ikigai.css";


const sectionColors = {
    love: "#ff3b5c",
    world: "#3b82f6",
    goodAt: "#ff9d00",
    paidFor: "#22c55e",

    mission: "#a78bfa",
    vocation: "#38bdf8",
    profession: "#fbbf24",
    passion: "#fb923c",

    personality: "#f472b6",
    career: "#60a5fa",
    rarity: "#f59e0b",
    archetype: "#4ade80",

    ikigai: "#ffffff",
};


/* =========================================================
   TOOLTIP
   ========================================================= */

function DetailTooltip({
    title,
    items,
    color,
    position,
}) {
    return (
        <motion.div
            className="ikigai-tooltip"
            style={{
                left: position.x,
                top: position.y,
                "--accent-color": color,
            }}
            initial={{
                opacity: 0,
                scale: 0.96,
                y: 8,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.96,
                y: 8,
            }}
            transition={{
                duration: 0.16,
                ease: "easeOut",
            }}
        >
            <div
                className="ikigai-tooltip-arrow"
                style={{
                    borderBottomColor: color,
                }}
            />

            <div className="ikigai-tooltip-header">
                <span
                    className="ikigai-tooltip-dot"
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 14px ${color}`,
                    }}
                />

                <div>
                    <h4>{title}</h4>

                    <span>
                        {items.length}{" "}
                        {items.length === 1
                            ? "idea"
                            : "ideas"}
                    </span>
                </div>
            </div>

            <div className="ikigai-tooltip-divider" />

            <ul>
                {items.map((item, index) => (
                    <li key={`${item}-${index}`}>
                        <span
                            className="ikigai-tooltip-item-dot"
                            style={{
                                backgroundColor: color,
                            }}
                        />

                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}


/* =========================================================
   CÍRCULO PRINCIPAL
   ========================================================= */

function MainCircle({
    titlePrefix,
    titleHighlight,
    items,
    className,
    color,
    active,
    onMouseMove,
}) {
    return (
        <motion.div
            className={`ikigai-circle ${className} ${active ? "is-active" : ""
                }`}
            animate={{
                scale: active ? 1.015 : 1,
            }}
            transition={{
                duration: 0.2,
            }}
            onMouseMove={onMouseMove}
        >
            <div className="ikigai-circle-content">
                <div className="ikigai-circle-title">
                    <span
                        className="ikigai-circle-dot"
                        style={{
                            backgroundColor: color,
                            boxShadow: `0 0 14px ${color}`,
                        }}
                    />

                    <h3>
                        <span>
                            {titlePrefix}
                        </span>

                        <strong>
                            {titleHighlight}
                        </strong>
                    </h3>
                </div>

                <span
                    className="ikigai-circle-badge"
                    style={{
                        "--badge-color": color,
                    }}
                >
                    {items.length} elementos
                </span>
            </div>
        </motion.div>
    );
}


/* =========================================================
   INTERSECCIÓN
   ========================================================= */

function Intersection({
    title,
    items,
    className,
    active,
    onMouseMove,
}) {
    return (
        <div
            className={`ikigai-intersection-wrapper ${className}`}
            onMouseMove={onMouseMove}
        >
            <motion.div
                className={`ikigai-intersection ${active ? "is-active" : ""
                    }`}
                animate={{
                    scale: active ? 1.06 : 1,
                }}
                transition={{
                    duration: 0.18,
                }}
            >
                <strong>{title}</strong>

                <span>
                    {items.length} ideas
                </span>
            </motion.div>
        </div>
    );
}


/* =========================================================
   LABEL DE INTERSECCIÓN TRIPLE
   ========================================================= */

function SmallLabel({
    title,
    items,
    className,
    active,
    onMouseMove,
}) {
    return (
        <div
            className={`ikigai-small-label-wrapper ${className}`}
            onMouseMove={onMouseMove}
        >
            <motion.div
                className={`ikigai-small-label ${active ? "is-active" : ""
                    }`}
                animate={{
                    scale: active ? 1.06 : 1,
                }}
                transition={{
                    duration: 0.18,
                }}
            >
                <span>{title}</span>

                <small>
                    {items.length} ideas
                </small>
            </motion.div>
        </div>
    );
}


/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

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

    ikigai = [],
}) {
    const [activeSection, setActiveSection] =
        useState(null);

    const [tooltipPosition, setTooltipPosition] =
        useState({
            x: 0,
            y: 0,
        });


    /* =====================================================
       DATOS
       ===================================================== */

    const sectionData = {
        love: {
            title: "Lo que amo",
            items: love,
            color: sectionColors.love,
        },

        world: {
            title: "El mundo necesita",
            items: worldNeeds,
            color: sectionColors.world,
        },

        goodAt: {
            title: "En lo que soy bueno",
            items: goodAt,
            color: sectionColors.goodAt,
        },

        paidFor: {
            title: "Por lo que me pueden pagar",
            items: paidFor,
            color: sectionColors.paidFor,
        },

        mission: {
            title: "Misión",
            items: mission,
            color: sectionColors.mission,
        },

        vocation: {
            title: "Vocación",
            items: vocation,
            color: sectionColors.vocation,
        },

        profession: {
            title: "Profesión",
            items: profession,
            color: sectionColors.profession,
        },

        passion: {
            title: "Pasión",
            items: passion,
            color: sectionColors.passion,
        },

        personality: {
            title: "Personalidad",
            items: personality,
            color: sectionColors.personality,
        },

        career: {
            title: "Carrera",
            items: career,
            color: sectionColors.career,
        },

        rarity: {
            title: "Rareza",
            items: rarity,
            color: sectionColors.rarity,
        },

        archetype: {
            title: "Arquetipo",
            items: archetype,
            color: sectionColors.archetype,
        },

        ikigai: {
            title: "Mi Ikigai",
            items: ikigai,
            color: sectionColors.ikigai,
        },
    };


    const activeSectionData =
        activeSection !== null
            ? sectionData[activeSection]
            : null;


    /* =====================================================
       MOUSE / TOOLTIP
       ===================================================== */

    const handleSectionMouseMove =
        (section) => (event) => {
            const stage =
                event.currentTarget.closest(
                    ".ikigai-stage"
                );

            if (!stage) {
                return;
            }

            const stageRect =
                stage.getBoundingClientRect();

            const mouseX =
                event.clientX - stageRect.left;

            const mouseY =
                event.clientY - stageRect.top;

            const offsetX = 18;
            const offsetY = 22;

            const tooltipWidth = 370;
            const tooltipHeight = 360;

            let x =
                mouseX + offsetX;

            let y =
                mouseY + offsetY;


            if (
                x + tooltipWidth >
                stageRect.width - 16
            ) {
                x =
                    mouseX -
                    tooltipWidth -
                    offsetX;
            }


            if (
                y + tooltipHeight >
                stageRect.height - 16
            ) {
                y =
                    mouseY -
                    tooltipHeight -
                    offsetY;
            }


            x = Math.max(16, x);
            y = Math.max(16, y);


            setTooltipPosition({
                x,
                y,
            });

            setActiveSection(section);
        };


    const clearActiveState = () => {
        setActiveSection(null);
    };


    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <section className="ikigai-container">

            {/* =================================================
                HEADER
                ================================================= */}

            <header className="ikigai-header">

                <span className="ikigai-eyebrow">
                    EXPLORACIÓN PERSONAL
                </span>

                <h2>
                    Mi Ikigai
                </h2>

                <p>
                    La intersección entre lo que amo,
                    aquello en lo que soy bueno,
                    lo que el mundo necesita y aquello
                    por lo que puedo aportar valor.
                </p>

            </header>


            {/* =================================================
                DIAGRAMA
                ================================================= */}

            <div
                className="ikigai-stage"
                onMouseLeave={clearActiveState}
            >

                <div className="ikigai-diagram">

                    <div className="ikigai-diagram-inner">


                        {/* =====================================
                            LO QUE AMO
                            ===================================== */}

                        <MainCircle
                            titlePrefix="Lo que"
                            titleHighlight="AMO"
                            items={love}
                            className="circle-love"
                            color={sectionColors.love}
                            active={
                                activeSection === "love"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "love"
                            )}
                        />


                        {/* =====================================
                            EL MUNDO NECESITA
                            ===================================== */}

                        <MainCircle
                            titlePrefix="El mundo"
                            titleHighlight="NECESITA"
                            items={worldNeeds}
                            className="circle-world"
                            color={sectionColors.world}
                            active={
                                activeSection === "world"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "world"
                            )}
                        />


                        {/* =====================================
                            EN LO QUE SOY BUENO
                            ===================================== */}

                        <MainCircle
                            titlePrefix="En lo que soy"
                            titleHighlight="BUENO"
                            items={goodAt}
                            className="circle-good"
                            color={sectionColors.goodAt}
                            active={
                                activeSection === "goodAt"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "goodAt"
                            )}
                        />


                        {/* =====================================
                            POR LO QUE ME PUEDEN PAGAR
                            ===================================== */}

                        <MainCircle
                            titlePrefix="Por lo que me pueden"
                            titleHighlight="PAGAR"
                            items={paidFor}
                            className="circle-paid"
                            color={sectionColors.paidFor}
                            active={
                                activeSection === "paidFor"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "paidFor"
                            )}
                        />


                        {/* =====================================
                            MISIÓN
                            ===================================== */}

                        <Intersection
                            title="Misión"
                            items={mission}
                            className="intersection-mission"
                            active={
                                activeSection === "mission"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "mission"
                            )}
                        />


                        {/* =====================================
                            VOCACIÓN
                            ===================================== */}

                        <Intersection
                            title="Vocación"
                            items={vocation}
                            className="intersection-vocation"
                            active={
                                activeSection === "vocation"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "vocation"
                            )}
                        />


                        {/* =====================================
                            PROFESIÓN
                            ===================================== */}

                        <Intersection
                            title="Profesión"
                            items={profession}
                            className="intersection-profession"
                            active={
                                activeSection === "profession"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "profession"
                            )}
                        />


                        {/* =====================================
                            PASIÓN
                            ===================================== */}

                        <Intersection
                            title="Pasión"
                            items={passion}
                            className="intersection-passion"
                            active={
                                activeSection === "passion"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "passion"
                            )}
                        />


                        {/* =====================================
                            PERSONALIDAD
                            ===================================== */}

                        <SmallLabel
                            title="Personalidad"
                            items={personality}
                            className="label-personality"
                            active={
                                activeSection ===
                                "personality"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "personality"
                            )}
                        />


                        {/* =====================================
                            CARRERA
                            ===================================== */}

                        <SmallLabel
                            title="Carrera"
                            items={career}
                            className="label-career"
                            active={
                                activeSection === "career"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "career"
                            )}
                        />


                        {/* =====================================
                            RAREZA
                            ===================================== */}

                        <SmallLabel
                            title="Rareza"
                            items={rarity}
                            className="label-rarity"
                            active={
                                activeSection === "rarity"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "rarity"
                            )}
                        />


                        {/* =====================================
                            ARQUETIPO
                            ===================================== */}

                        <SmallLabel
                            title="Arquetipo"
                            items={archetype}
                            className="label-archetype"
                            active={
                                activeSection ===
                                "archetype"
                            }
                            onMouseMove={handleSectionMouseMove(
                                "archetype"
                            )}
                        />


                        {/* =====================================
                            IKIGAI CENTRAL
                            ===================================== */}

                        <div
                            className="ikigai-core-wrapper"
                            onMouseMove={handleSectionMouseMove(
                                "ikigai"
                            )}
                        >

                            <motion.div
                                className={`ikigai-core ${activeSection ===
                                        "ikigai"
                                        ? "is-active"
                                        : ""
                                    }`}
                                animate={{
                                    scale:
                                        activeSection ===
                                            "ikigai"
                                            ? 1.07
                                            : 1,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 18,
                                }}
                            >

                                <span>
                                    IKIGAI
                                </span>

                                <small>
                                    Explorar
                                </small>

                            </motion.div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    TOOLTIP
                    ================================================= */}

                <AnimatePresence>
                    {activeSectionData && (
                        <DetailTooltip
                            key={activeSection}
                            title={
                                activeSectionData.title
                            }
                            items={
                                activeSectionData.items
                            }
                            color={
                                activeSectionData.color
                            }
                            position={
                                tooltipPosition
                            }
                        />
                    )}
                </AnimatePresence>

            </div>

        </section>
    );
}
