import { useState, useMemo } from "react";
import { motion } from "motion/react";
import "./InternetSpeed.css";

const BITS_PER_BYTE = 8;
const MB_PER_GB = 1000;

const mbpsToMBps = (mbps) => mbps / BITS_PER_BYTE;
const gbToMB = (gb) => gb * MB_PER_GB;

const formatNumber = (num) => {
    if (num === null || num === undefined || Number.isNaN(num)) return "—";
    return num.toLocaleString("es-MX");
};

const formatTime = (totalSeconds) => {
    if (totalSeconds === null || Number.isNaN(totalSeconds)) return "—";
    if (totalSeconds < 1) return "< 1 s";
    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} s`;
    if (totalSeconds < 3600) {
        const m = Math.floor(totalSeconds / 60);
        const s = Math.round(totalSeconds % 60);
        return `${m} m ${s} s`;
    }
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.round((totalSeconds % 3600) / 60);
    if (totalSeconds < 86400) return `${h} h ${m} m`;
    const d = Math.floor(totalSeconds / 86400);
    const remH = Math.round((totalSeconds % 86400) / 3600);
    return `${d} d ${remH} h`;
};

export default function InternetSpeed({
    provider = "",
    theoreticalMbps = 0,
    measuredMbps = 0,
    downloadSongs = 200,
    songSizeMB = 4,
    uploadGameSizeGB = 78,
    showHeader = true,
}) {
    const [speedMode, setSpeedMode] = useState("measured");

    const theoreticalMBps = useMemo(
        () => mbpsToMBps(theoreticalMbps),
        [theoreticalMbps]
    );
    const measuredMBps = useMemo(
        () => mbpsToMBps(measuredMbps),
        [measuredMbps]
    );

    const downloadTotalMB = useMemo(
        () => downloadSongs * songSizeMB,
        [downloadSongs, songSizeMB]
    );
    const uploadTotalMB = useMemo(
        () => gbToMB(uploadGameSizeGB),
        [uploadGameSizeGB]
    );

    const selectedMbps = speedMode === "measured" ? measuredMbps : theoreticalMbps;
    const selectedMBps = speedMode === "measured" ? measuredMBps : theoreticalMBps;

    const downloadSeconds = useMemo(() => {
        if (selectedMBps <= 0) return null;
        return downloadTotalMB / selectedMBps;
    }, [selectedMBps, downloadTotalMB]);

    const uploadSeconds = useMemo(() => {
        if (selectedMBps <= 0) return null;
        return uploadTotalMB / selectedMBps;
    }, [selectedMBps, uploadTotalMB]);

    return (
        <section className="internet-speed-container">
            {showHeader && (
                <header className="internet-speed-header">
                    <span className="internet-speed-eyebrow">REDES Y CONECTIVIDAD</span>
                    <h2>Velocidad de Internet</h2>
                    <p>
                        Comparativa entre la velocidad teórica del plan del proveedor
                        y la velocidad real medida con speedtest.net, con cálculo de
                        tiempos de descarga y subida.
                    </p>
                </header>
            )}

            <div className="internet-speed-body">
                <div className="isp-section">
                    <span className="isp-label">Proveedor de internet</span>
                    <span className="isp-name">{provider || "No especificado"}</span>
                </div>

                <div className="speed-cards">
                    <motion.div
                        className="speed-card card-theoretical"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                    >
                        <div className="speed-card-header">
                            <span className="speed-card-dot" />
                            <span className="speed-card-title">Velocidad teórica (plan)</span>
                        </div>
                        <div className="speed-card-values">
                            <div className="speed-card-main">
                                {formatNumber(theoreticalMbps)}
                                <span className="speed-unit"> Mbps</span>
                            </div>
                            <div className="speed-card-converted">
                                = {theoreticalMBps.toFixed(2)}
                                <span className="speed-unit"> MB/s</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="speed-card card-measured"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        <div className="speed-card-header">
                            <span className="speed-card-dot" />
                            <span className="speed-card-title">Velocidad medida (speedtest.net)</span>
                        </div>
                        <div className="speed-card-values">
                            <div className="speed-card-main">
                                {formatNumber(measuredMbps)}
                                <span className="speed-unit"> Mbps</span>
                            </div>
                            <div className="speed-card-converted">
                                = {measuredMBps.toFixed(2)}
                                <span className="speed-unit"> MB/s</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="speed-selector">
                    <span className="selector-label">Velocidad para cálculos:</span>
                    <div className="selector-toggle">
                        <motion.button
                            className={`selector-btn ${speedMode === "theoretical" ? "is-active" : ""}`}
                            onClick={() => setSpeedMode("theoretical")}
                            whileTap={{ scale: 0.96 }}
                        >
                            Teórica
                        </motion.button>
                        <motion.button
                            className={`selector-btn ${speedMode === "measured" ? "is-active" : ""}`}
                            onClick={() => setSpeedMode("measured")}
                            whileTap={{ scale: 0.96 }}
                        >
                            Medida
                        </motion.button>
                    </div>
                </div>

                <div className="selected-speed-banner">
                    <span>Usando velocidad</span>
                    <strong>
                        {selectedMbps !== null && selectedMbps > 0
                            ? `${formatNumber(selectedMbps)} Mbps = ${selectedMBps.toFixed(2)} MB/s`
                            : "—"}
                    </strong>
                </div>

                <div className="calculation-cards">
                    <motion.div
                        className="calc-card calc-download"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                    >
                        <div className="calc-card-header">
                            <span className="calc-icon calc-icon-download">↓</span>
                            <h3>Descargar 200 canciones</h3>
                        </div>
                        <div className="calc-card-details">
                            <div className="calc-detail-row">
                                <span>Canciones</span>
                                <span className="detail-value">{formatNumber(downloadSongs)} piezas</span>
                            </div>
                            <div className="calc-detail-row">
                                <span>Tamaño por canción</span>
                                <span className="detail-value">{songSizeMB} MB</span>
                            </div>
                            <div className="calc-detail-row detail-total">
                                <span>Tamaño total</span>
                                <span className="detail-value">{formatNumber(downloadTotalMB)} MB</span>
                            </div>
                        </div>
                        <div className="calc-card-result">
                            <span className="result-label">Tiempo estimado de descarga</span>
                            <span className="result-value">{formatTime(downloadSeconds)}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="calc-card calc-upload"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        <div className="calc-card-header">
                            <span className="calc-icon calc-icon-upload">↑</span>
                            <h3>Subir videojuego compilado</h3>
                        </div>
                        <div className="calc-card-details">
                            <div className="calc-detail-row">
                                <span>Tamaño del juego</span>
                                <span className="detail-value">{uploadGameSizeGB} GB ({formatNumber(uploadTotalMB)} MB)</span>
                            </div>
                            <div className="calc-detail-row detail-total">
                                <span>Velocidad de subida</span>
                                <span className="detail-value">
                                    {selectedMbps > 0
                                        ? `${selectedMBps.toFixed(2)} MB/s`
                                        : "—"}
                                </span>
                            </div>
                        </div>
                        <div className="calc-card-result">
                            <span className="result-label">Tiempo estimado de subida</span>
                            <span className="result-value">{formatTime(uploadSeconds)}</span>
                        </div>
                    </motion.div>
                </div>

                <div className="conversion-reference">
                    <h4>Fórmulas de conversión</h4>
                    <div className="conversion-grid">
                        <div className="conversion-item">
                            <span className="conversion-eq">Mbps ÷ {BITS_PER_BYTE} = MB/s</span>
                            <span className="conversion-desc">Bits a Bytes</span>
                        </div>
                        <div className="conversion-item">
                            <span className="conversion-eq">GB × {MB_PER_GB} = MB</span>
                            <span className="conversion-desc">Gigabytes a Megabytes</span>
                        </div>
                        <div className="conversion-item">
                            <span className="conversion-eq">Tiempo = Tamaño ÷ Velocidad</span>
                            <span className="conversion-desc">Cálculo del tiempo</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
