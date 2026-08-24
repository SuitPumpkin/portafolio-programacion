import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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

const getCubeScale = (index) => {
  if (index === 0) return 1;
  const ratio = UNITS[index].bits / UNITS[index - 1].bits;
  return Math.cbrt(ratio);
};

const getAccumulatedScale = (index) => {
  let scale = 1;
  for (let i = 1; i <= index; i++) {
    scale *= getCubeScale(i);
  }
  return scale;
};

const SCALE_COMPRESSION = 0.5;

const getVisualScale = (index) => {
  const realScale = getAccumulatedScale(index);
  const maxScale = getAccumulatedScale(UNITS.length - 1);
  const logScale = Math.log10(realScale);
  const logMax = Math.log10(maxScale);
  return 1 + (logScale / logMax) * 6 * SCALE_COMPRESSION;
};

const Cube = ({ color, scale, isActive, position = [0, 0, 0], label }) => {
  const meshRef = useRef();
  const currentScaleRef = useRef(scale);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;

      const scaleDiff = scale - currentScaleRef.current;
      if (Math.abs(scaleDiff) > 0.01) {
        currentScaleRef.current += scaleDiff * delta * 4;
        meshRef.current.scale.setScalar(currentScaleRef.current);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={isActive ? 0.2 : 0.05}
        />
      </mesh>
    </group>
  );
};

const CameraController = ({ activeIndex }) => {
  useFrame((state, delta) => {
    const targetZ = 15 + activeIndex * 8;
    const currentZ = state.camera.position.z;
    const diff = targetZ - currentZ;
    if (Math.abs(diff) > 0.1) {
      state.camera.position.z += diff * delta * 3;
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
};

const Scene = ({ activeIndex }) => {
  const activeUnit = UNITS[activeIndex];
  const prevUnit = activeIndex > 0 ? UNITS[activeIndex - 1] : null;

  const activeScale = getVisualScale(activeIndex);
  const prevScale = activeIndex > 0 ? getVisualScale(activeIndex - 1) : 0;

  const prevPosition = prevUnit ? [-prevScale - 1.5, 0, 0] : [0, 0, 0];
  const activePosition = prevUnit ? [activeScale / 2 + 1.5, 0, 0] : [0, 0, 0];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

      <CameraController activeIndex={activeIndex} />

      {prevUnit && (
        <Cube
          color={prevUnit.color}
          scale={prevScale}
          isActive={false}
          position={prevPosition}
          label={prevUnit.symbol}
        />
      )}

      <Cube
        color={activeUnit.color}
        scale={activeScale}
        isActive={true}
        position={activePosition}
        label={activeUnit.symbol}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableRotate={false}
      />
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
  if (index === 0) return "La unidad más pequeña de información digital";
  const prev = UNITS[index - 1];
  const curr = UNITS[index];
  const ratio = curr.bits / prev.bits;
  return `1 ${curr.symbol} = ${ratio.toLocaleString()} ${prev.symbol}`;
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
            Visualización interactiva de la diferencia de escala entre las unidades
            de medida digitales. Desplázate para explorar cómo crece exponencialmente
            cada unidad respecto a la anterior.
          </p>
        </header>
      )}

      <div className="data-units-body">
        <div className="visualizer-wrapper">
          <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene activeIndex={activeIndex} />
              </Suspense>
            </Canvas>
            <div className="canvas-label">
              <div className="comparison-label">
                {activeIndex > 0 ? (
                  <>
                    <span className="prev-unit" style={{ color: UNITS[activeIndex - 1].color }}>
                      {UNITS[activeIndex - 1].symbol}
                    </span>
                    <span className="vs-text">vs</span>
                    <span className="active-unit" style={{ color: activeUnit.color }}>
                      {activeUnit.symbol}
                    </span>
                  </>
                ) : (
                  <span className="active-unit" style={{ color: activeUnit.color }}>
                    {activeUnit.symbol}
                  </span>
                )}
              </div>
              {activeIndex > 0 && (
                <span className="canvas-label-comparison">
                  1 {activeUnit.symbol} = {(activeUnit.bits / UNITS[activeIndex - 1].bits).toLocaleString()} {UNITS[activeIndex - 1].symbol}
                </span>
              )}
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
          <h4>Escala logarítmica (tamaño real = proporción al cubo)</h4>
          <div className="scale-grid">
            {UNITS.slice(1).map((unit, index) => (
              <div key={unit.symbol} className="scale-item">
                <span className="scale-arrow">→</span>
                <span className="scale-text">
                  {UNITS[index].symbol} → {unit.symbol}: ×{(unit.bits / UNITS[index].bits).toLocaleString()} volumen
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
