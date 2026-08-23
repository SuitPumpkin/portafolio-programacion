import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AnimatePresence, motion } from "motion/react";
import "./Ikigai.css";

const SIZE = 768;
const RADIUS = 190;
const DISTANCE = 120;
const C = SIZE / 2;

const ORDER = ["passion", "mission", "vocation", "profession"];
const ORDER_INDEX = new Map(ORDER.map((id, i) => [id, i]));
const makeId = (ids) =>
  [...ids].sort((a, b) => ORDER_INDEX.get(a) - ORDER_INDEX.get(b)).join("-");

const COLORS = {
  passion: "#ff3b5c",
  mission: "#3b82f6",
  vocation: "#22c55e",
  profession: "#ff9d00",
};

const OFFSETS = {
  passion: [-DISTANCE, 0],
  mission: [0, -DISTANCE],
  vocation: [DISTANCE, 0],
  profession: [0, DISTANCE],
};

const BASE = ORDER.map((id) => ({
  id,
  cx: C + OFFSETS[id][0],
  cy: C + OFFSETS[id][1],
  color: COLORS[id],
}));

const mixColors = (ids) => {
  if (ids.length === 1) return COLORS[ids[0]];
  if (ids.length === 4) return "#ffffff";
  const rgb = ids.map((id) => d3.rgb(COLORS[id]));
  return d3
    .rgb(
      d3.mean(rgb, (c) => c.r),
      d3.mean(rgb, (c) => c.g),
      d3.mean(rgb, (c) => c.b)
    )
    .formatHex();
};

const REGION_SETS = [
  ["passion"],
  ["mission"],
  ["vocation"],
  ["profession"],
  ["passion", "mission"],
  ["mission", "vocation"],
  ["vocation", "profession"],
  ["profession", "passion"],
  ["passion", "mission", "profession"],
  ["passion", "mission", "vocation"],
  ["passion", "vocation", "profession"],
  ["mission", "vocation", "profession"],
  ["passion", "mission", "vocation", "profession"],
];

const META = {
  passion: { title: "Lo que amo", prop: "love" },
  mission: { title: "El mundo necesita", prop: "worldNeeds" },
  vocation: { title: "Por lo que me pagan", prop: "paidFor" },
  profession: { title: "En lo que soy bueno", prop: "goodAt" },
  "passion-mission": { title: "Misión", prop: "mission" },
  "mission-vocation": { title: "Vocación", prop: "vocation" },
  "passion-profession": { title: "Profesión", prop: "profession" },
  "vocation-profession": { title: "Pasión", prop: "passion" },
  "passion-mission-profession": { title: "Rareza", prop: "rarity" },
  "passion-mission-vocation": { title: "Carrera", prop: "career" },
  "passion-vocation-profession": { title: "Tarea", prop: "personality" },
  "mission-vocation-profession": { title: "Arquetipo", prop: "archetype" },
  "passion-mission-vocation-profession": { title: "Mi Ikigai", prop: "ikigai" },
};

const REGIONS = REGION_SETS.map((circles) => {
  const id = makeId(circles);
  return { id, circles, color: mixColors(circles), ...META[id] };
});

const LABELS = [
  { id: "passion", x: 150, y: 384, title: "AMOR" },
  { id: "mission", x: 384, y: 170, title: "MUNDO" },
  { id: "vocation", x: 625, y: 384, title: "PAGAN" },
  { id: "profession", x: 384, y: 600, title: "BUENO" },
  { id: "passion-mission", x: 280, y: 280, title: "Pasión" },
  { id: "mission-vocation", x: 488, y: 280, title: "Misión" },
  { id: "passion-profession", x: 280, y: 488, title: "Profesión" },
  { id: "vocation-profession", x: 488, y: 488, title: "Vocación" },
  { id: "passion-mission-profession", x: 270, y: 384, title: "Rareza", small: true },
  { id: "passion-mission-vocation", x: 384, y: 280, title: "Carrera", small: true },
  { id: "passion-vocation-profession", x: 384, y: 485, title: "Tarea", small: true },
  { id: "mission-vocation-profession", x: 488, y: 384, title: "Arquetipo", small: true },
  { id: "passion-mission-vocation-profession", x: 384, y: 384, title: "IKIGAI", subtitle: "Razón de ser", center: true },
];

const getMembership = (x, y, circles, radius) =>
  circles
    .filter((c) => {
      const dx = x - c.cx;
      const dy = y - c.cy;
      return dx * dx + dy * dy <= radius * radius;
    })
    .map((c) => c.id)
    .sort((a, b) => ORDER_INDEX.get(a) - ORDER_INDEX.get(b));

const Ikigai = (props) => {
  const svgRef = useRef(null);
  const projects = props.projects ?? [];

  const [activeRegion, setActiveRegion] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const dataMap = Object.fromEntries(
    REGIONS.map((r) => [
      r.id,
      { ...META[r.id], color: r.color, items: props[META[r.id].prop] ?? [] },
    ])
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    if (!svgNode) return;

    const svg = d3.select(svgNode);
    svg.selectAll("*").remove();

    const regionMap = new Map(REGIONS.map((r) => [r.id, r]));

    svg
      .attr("viewBox", `0 0 ${SIZE} ${SIZE}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const diagram = svg.append("g");

    const circleEls = diagram
      .append("g")
      .selectAll("circle")
      .data(BASE)
      .join("circle")
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("r", 0)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", 0.5)
      .attr("stroke", "rgba(255,255,255,0.8)")
      .attr("stroke-width", 4)
      .style("pointer-events", "none");

    circleEls
      .transition()
      .delay((_, i) => i * 100)
      .duration(700)
      .ease(d3.easeBackOut.overshoot(1.15))
      .attr("r", RADIUS);

    const makeRegionImage = (region) => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      const img = ctx.createImageData(SIZE, SIZE);
      const px = img.data;
      const color = d3.rgb(region.color);

      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const m = getMembership(x + 0.5, y + 0.5, BASE, RADIUS);
          if (m.length === region.circles.length && m.every((id) => region.circles.includes(id))) {
            const i = (y * SIZE + x) * 4;
            px[i] = color.r;
            px[i + 1] = color.g;
            px[i + 2] = color.b;
            px[i + 3] = 255;
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      return canvas.toDataURL("image/png");
    };

    const images = new Map(REGIONS.map((r) => [r.id, makeRegionImage(r)]));

    const hoverLayer = diagram.append("g").style("pointer-events", "none");
    let current = null;

    const clear = () => {
      current = null;
      setActiveRegion(null);
      setTooltip(null);
      circleEls.interrupt().transition().duration(180).attr("fill-opacity", 0.5);
      hoverLayer.selectAll("*").interrupt().transition().duration(120).attr("opacity", 0).remove();
    };

    const activate = (region, event) => {
      current = region.id;
      setActiveRegion(region.id);
      setTooltip({ x: event.clientX, y: event.clientY });
      circleEls.interrupt().transition().duration(180).attr("fill-opacity", 0.12);
      hoverLayer.selectAll("*").remove();
      const href = images.get(region.id);
      if (!href) return;
      hoverLayer
        .append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", SIZE)
        .attr("height", SIZE)
        .attr("preserveAspectRatio", "none")
        .attr("href", href)
        .attr("opacity", 0)
        .transition()
        .duration(160)
        .attr("opacity", 1);
    };

    diagram
      .append("rect")
      .attr("width", SIZE)
      .attr("height", SIZE)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mousemove", (event) => {
        const rect = svgNode.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * SIZE;
        const y = ((event.clientY - rect.top) / rect.height) * SIZE;
        const m = getMembership(x, y, BASE, RADIUS);
        if (!m.length) return clear();
        const region = regionMap.get(makeId(m));
        if (!region) return clear();
        if (current !== region.id) activate(region, event);
        else setTooltip({ x: event.clientX, y: event.clientY });
      })
      .on("mouseleave", clear);

    diagram
      .append("g")
      .style("pointer-events", "none")
      .selectAll("circle")
      .data(BASE)
      .join("circle")
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("r", RADIUS)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.85)")
      .attr("stroke-width", 4);

    return () => svg.selectAll("*").remove();
  }, []);

  const onLabelEnter = (label, event) => {
    if (!dataMap[label.id].items.length) return;
    setActiveRegion(label.id);
    setTooltip({ x: event.clientX, y: event.clientY });
  };
  const onLabelMove = (event) =>
    setTooltip((p) => (p ? { ...p, x: event.clientX, y: event.clientY } : p));
  const onLabelLeave = () => {
    setActiveRegion(null);
    setTooltip(null);
  };

  const activeData = activeRegion ? dataMap[activeRegion] : null;

  return (
    <section className="ikigai-container">
      <div className="ikigai-header">
        <span className="ikigai-eyebrow">EXPLORACIÓN PERSONAL</span>
        <h2>Mi Ikigai</h2>
        <p>
          La intersección entre lo que amo, aquello en lo que soy bueno,
          lo que el mundo necesita y aquello por lo que puedo aportar valor.
        </p>
      </div>

      <div className="ikigai-canvas">
        <svg ref={svgRef} className="ikigai-svg" />

        <div className="ikigai-label-layer">
          {LABELS.map((label, index) => {
            const isActive = activeRegion === label.id;
            return (
              <div
                key={label.id}
                className={[
                  "ikigai-label-anchor",
                  label.center ? "is-center" : "",
                  label.small ? "is-small" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  left: `${(label.x / SIZE) * 100}%`,
                  top: `${(label.y / SIZE) * 100}%`,
                }}
                onMouseEnter={(e) => onLabelEnter(label, e)}
                onMouseMove={onLabelMove}
                onMouseLeave={onLabelLeave}
              >
                <motion.div
                  className="ikigai-label"
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{
                    opacity: isActive ? 1 : 0.82,
                    scale: isActive ? 1.08 : 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.04,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="ikigai-label-title">{label.title}</span>
                  <span className="ikigai-label-subtitle">{label.subtitle}</span>
                </motion.div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {activeData && activeData.items.length > 0 && tooltip && (
            <motion.div
              className="ikigai-tooltip"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16 }}
              style={{
                left: tooltip.x,
                top: tooltip.y,
                "--accent-color": activeData.color,
              }}
            >
              <div className="ikigai-tooltip-header">
                <span
                  className="ikigai-tooltip-dot"
                  style={{
                    background: activeData.color,
                    boxShadow: `0 0 14px ${activeData.color}`,
                  }}
                />
                <div>
                  <h4>{activeData.title}</h4>
                  <span>
                    {activeData.items.length}{" "}
                    {activeData.items.length === 1 ? "idea" : "ideas"}
                  </span>
                </div>
              </div>

              <div className="ikigai-tooltip-divider" />

              <ul>
                {activeData.items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <span
                      className="ikigai-tooltip-item-dot"
                      style={{ background: activeData.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {projects.length > 0 && (
        <div className="ikigai-projects">
          <div className="ikigai-projects-title">
            <span>03</span>
            <h3>Proyectos</h3>
          </div>

          <div className="ikigai-projects-list">
            {projects.map((project, index) => (
              <motion.div
                key={project.titulo}
                className="ikigai-project"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
              >
                <span className="ikigai-project-dot" />
                <div>
                  <h4>{project.titulo}</h4>
                  <p>{project.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Ikigai;
