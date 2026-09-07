import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import "./DataUnitsVisualizer.css";

const UNITS = [
  { name: "Bit", symbol: "b", bits: 1, color: "#f87171" },
  { name: "Byte", symbol: "B", bits: 8, color: "#fb923c" },
  { name: "Kilobyte", symbol: "KB", bits: 8 * 1024, color: "#fbbf24" },
  { name: "Megabyte", symbol: "MB", bits: 8 * 1024 ** 2, color: "#a3e635" },
  { name: "Gigabyte", symbol: "GB", bits: 8 * 1024 ** 3, color: "#34d399" },
  { name: "Terabyte", symbol: "TB", bits: 8 * 1024 ** 4, color: "#22d3ee" },
  { name: "Petabyte", symbol: "PB", bits: 8 * 1024 ** 5, color: "#60a5fa" },
  { name: "Exabyte", symbol: "EB", bits: 8 * 1024 ** 6, color: "#a78bfa" },
  { name: "Zettabyte", symbol: "ZB", bits: 8 * 1024 ** 7, color: "#f472b6" },
];

const getEdgeRatio = (index) => {
  if (index === 0) return 1;
  return Math.cbrt(UNITS[index].bits / UNITS[index - 1].bits);
};

const CUBE_GAP = 1.5;
const CAMERA_PADDING = 1.18;
const MIN_CAMERA_ZOOM = 0.0001;
const MAX_CAMERA_ZOOM = 1000;
const WORLD_SCALE = 0.1;
const CAMERA_STEP = 28;

const getUnitScale = (index) => Math.cbrt(UNITS[index].bits) * WORLD_SCALE;

const getUnitPositions = () => {
  let cursor = 0;

  return UNITS.map((unit, index) => {
    const scale = getUnitScale(index);
    const left = cursor;
    const right = left + scale;
    const position = (left + right) / 2;
    cursor = right + CUBE_GAP;

    return { ...unit, scale, position, left, right };
  });
};

const UNIT_LAYOUT = getUnitPositions();

const Cube = ({ color, scale, isHighlighted, position = [0, 0, 0] }) => {
  const meshRef = useRef();
  const currentScaleRef = useRef(scale);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const scaleDiff = scale - currentScaleRef.current;
      if (Math.abs(scaleDiff) > 0.01) {
        currentScaleRef.current += scaleDiff * delta * 4;
        meshRef.current.scale.setScalar(currentScaleRef.current);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.3}
          emissive={isHighlighted ? color : "#101827"}
          emissiveIntensity={isHighlighted ? 0.24 : 0.015}
          transparent
          opacity={isHighlighted ? 1 : 0.22}
          wireframe={!isHighlighted}
          depthWrite={isHighlighted}
        />
      </mesh>
    </group>
  );
};

const CameraController = ({ focusCenter, focusWidth, focusHeight }) => {
  useFrame((state, delta) => {
    const viewWidth = state.camera.right - state.camera.left;
    const viewHeight = state.camera.top - state.camera.bottom;
    const targetZoom = Math.min(
      viewWidth / (focusWidth * CAMERA_PADDING),
      viewHeight / (focusHeight * CAMERA_PADDING),
    );
    const clampedZoom = Math.min(MAX_CAMERA_ZOOM, Math.max(MIN_CAMERA_ZOOM, targetZoom));
    const lookAtY = focusHeight / 2;
    const targetY = lookAtY;
    const xDiff = focusCenter - state.camera.position.x;
    const yDiff = targetY - state.camera.position.y;
    const zoomDiff = clampedZoom - state.camera.zoom;

    if (Math.abs(xDiff) > 0.1 || Math.abs(yDiff) > 0.1 || Math.abs(zoomDiff) > 0.001) {
      const positionSmoothing = 1 - Math.exp(-delta * 7);
      const zoomSmoothing = 1 - Math.exp(-delta * 9);

      state.camera.position.x += xDiff * positionSmoothing;
      state.camera.position.y += yDiff * positionSmoothing;
      state.camera.position.z = 20;
      state.camera.zoom += zoomDiff * zoomSmoothing;
      state.camera.lookAt(focusCenter, lookAtY, 0);
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
};

const Scene = ({ activeIndex }) => {
  const comparisonIndex = activeIndex < UNITS.length - 1 ? activeIndex + 1 : activeIndex - 1;
  const visibleUnits = [UNIT_LAYOUT[activeIndex], UNIT_LAYOUT[comparisonIndex]];
  const pairScale = 20 / Math.max(...visibleUnits.map((unit) => unit.scale));
  let cursor = 0;
  const comparisonUnits = visibleUnits.map((unit) => {
    const scale = unit.scale * pairScale;
    const position = cursor + scale / 2;
    cursor += scale + CUBE_GAP;
    return { ...unit, scale, position };
  });
  const focusWidth = cursor - CUBE_GAP;
  const sceneOffset = activeIndex * CAMERA_STEP;
  const focusCenter = sceneOffset + focusWidth / 2;
  const focusHeight = Math.max(...comparisonUnits.map((unit) => unit.scale));
  const planeSize = Math.max(8, focusWidth * 1.12);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

      <CameraController
        focusCenter={focusCenter}
        focusWidth={focusWidth}
        focusHeight={focusHeight}
      />

      <gridHelper args={[planeSize, 16, "#334155", "#172033"]} position={[focusCenter, 0, 0]} />

      {comparisonUnits.map((unit) => (
        <Cube
          key={unit.symbol}
          color={unit.color}
          scale={unit.scale}
          isHighlighted={unit.symbol === UNITS[activeIndex].symbol}
          position={[unit.position + sceneOffset, unit.scale / 2, 0]}
        />
      ))}

    </>
  );
};

const formatBits = (bits) => {
  if (bits >= 8 * 1024 ** 7) return `${(bits / (8 * 1024 ** 7)).toLocaleString()} Zb`;
  if (bits >= 8 * 1024 ** 6) return `${(bits / (8 * 1024 ** 6)).toLocaleString()} Eb`;
  if (bits >= 8 * 1024 ** 5) return `${(bits / (8 * 1024 ** 5)).toLocaleString()} Pb`;
  if (bits >= 8 * 1024 ** 4) return `${(bits / (8 * 1024 ** 4)).toLocaleString()} Tb`;
  if (bits >= 8 * 1024 ** 3) return `${(bits / (8 * 1024 ** 3)).toLocaleString()} Gb`;
  if (bits >= 8 * 1024 ** 2) return `${(bits / (8 * 1024 ** 2)).toLocaleString()} Mb`;
  if (bits >= 8 * 1024) return `${(bits / (8 * 1024)).toLocaleString()} Kb`;
  if (bits >= 8) return `${(bits / 8).toLocaleString()} B`;
  return `${bits} b`;
};

const getComparisonText = (index) => {
  const nextIndex = index < UNITS.length - 1 ? index + 1 : index - 1;
  const current = UNITS[index];
  const next = UNITS[nextIndex];
  const ratio = index < UNITS.length - 1 ? next.bits / current.bits : current.bits / next.bits;

  return index < UNITS.length - 1
    ? `1 ${next.symbol} = ${ratio.toLocaleString()} ${current.symbol}`
    : `1 ${current.symbol} = ${ratio.toLocaleString()} ${next.symbol}`;
};

export default function DataUnitsVisualizer({ showHeader = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const itemRefs = useRef([]);

  const handleScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const centerScroll = scrollLeft + containerWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(centerScroll - itemCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex >= 0 && closestIndex < UNITS.length) {
      setActiveIndex(closestIndex);
    }
  };

  const scrollToIndex = (index) => {
    setActiveIndex(index);
    if (itemRefs.current[index]) {
      const item = itemRefs.current[index];
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const activeUnit = UNITS[activeIndex];

  return (
    <section className="data-units-container">
      {showHeader && (
        <header className="data-units-header">
          <span className="data-units-eyebrow">REPRESENTACIÓN DE DATOS</span>
          <h2>De un Bit a un Zettabyte</h2>
          <p>
            Todas las unidades permanecen juntas y ordenadas sobre el plano. Selecciona
            una para enfocar su diferencia real con la siguiente.
          </p>
        </header>
      )}

      <div className="data-units-body">
        <div className="visualizer-wrapper">
          <div className="canvas-container">
            <Canvas
              orthographic
              camera={{
                position: [0, 0, 20],
                left: -1,
                right: 1,
                top: 1,
                bottom: -1,
                zoom: MAX_CAMERA_ZOOM,
                near: 0.01,
                far: 10000,
              }}
            >
              <Suspense fallback={null}>
                <Scene activeIndex={activeIndex} />
              </Suspense>
            </Canvas>
            <div className="canvas-label">
              <div className="comparison-label">
                <span className="active-unit" style={{ color: activeUnit.color }}>
                  {activeUnit.symbol}
                </span>
                <span className="vs-text">vs</span>
                <span
                  className="prev-unit"
                  style={{
                    color: UNITS[activeIndex < UNITS.length - 1 ? activeIndex + 1 : activeIndex - 1].color,
                  }}
                >
                  {UNITS[activeIndex < UNITS.length - 1 ? activeIndex + 1 : activeIndex - 1].symbol}
                </span>
              </div>
              <span className="canvas-label-comparison">{getComparisonText(activeIndex)}</span>
            </div>
          </div>

          <div className="unit-info-panel">
            <motion.div
              key={activeIndex}
              className="unit-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="unit-badge" style={{ backgroundColor: activeUnit.color }}>
                {activeUnit.symbol}
              </div>
              <div className="unit-details">
                <h3>{activeUnit.name}</h3>
                <p className="unit-comparison">{getComparisonText(activeIndex)}</p>
                <p className="unit-bits">{formatBits(activeUnit.bits)}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="scroll-section">
          <div className="scroll-track-wrapper">
            <div
              className="scroll-track"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {UNITS.map((unit, index) => (
                <motion.button
                  key={unit.symbol}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`scroll-item ${index === activeIndex ? "is-active" : ""}`}
                  onClick={() => scrollToIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    "--item-color": unit.color,
                  }}
                >
                  <span className="scroll-item-symbol">{unit.symbol}</span>
                  <span className="scroll-item-name">{unit.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="scroll-indicators">
            {UNITS.map((unit, index) => (
              <button
                key={unit.symbol}
                className={`indicator ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => scrollToIndex(index)}
                style={{ "--indicator-color": unit.color }}
              />
            ))}
          </div>
        </div>

        <div className="scale-reference">
          <h4>Escala física de la arista (proporción real de volumen)</h4>
          <div className="scale-grid">
            {UNITS.slice(1).map((unit, index) => {
              const volumeRatio = unit.bits / UNITS[index].bits;
              const edgeRatio = getEdgeRatio(index + 1);

              return (
                <div key={unit.symbol} className="scale-item">
                  <span className="scale-arrow">→</span>
                  <span className="scale-text">
                    {UNITS[index].symbol} → {unit.symbol}: ×{volumeRatio.toLocaleString()} volumen · ×{edgeRatio.toLocaleString(undefined, { maximumFractionDigits: 2 })} arista
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
