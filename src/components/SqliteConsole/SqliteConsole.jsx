import { useState, useEffect, useRef, useCallback } from "react";
import initSqlJs from "sql.js";
import "./SqliteConsole.css";

const SAMPLE_SCHEMA = `
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE,
    telefono TEXT,
    ciudad TEXT,
    fecha_registro TEXT
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT,
    precio REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    estado TEXT DEFAULT 'activo'
);

CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    total REAL NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    metodo_pago TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE detalle_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO clientes (nombre, apellido, email, telefono, ciudad, fecha_registro) VALUES
('Ana', 'García', 'ana@mail.com', '555-0101', 'Ciudad de México', '2024-01-15'),
('Luis', 'Martínez', 'luis@mail.com', '555-0102', 'Guadalajara', '2024-02-20'),
('María', 'López', 'maria@mail.com', '555-0103', 'Monterrey', '2024-03-10'),
('Carlos', 'Hernández', 'carlos@mail.com', '555-0104', 'Puebla', '2024-04-05'),
('Sofia', 'Ramírez', 'sofia@mail.com', '555-0105', 'Querétaro', '2024-05-12');

INSERT INTO productos (nombre, categoria, precio, stock, estado) VALUES
('Laptop Pro 15', 'Electrónica', 15999.99, 25, 'activo'),
('Mouse Inalámbrico', 'Accesorios', 299.99, 150, 'activo'),
('Teclado Mecánico', 'Accesorios', 899.99, 80, 'activo'),
('Monitor 27"', 'Electrónica', 5499.99, 30, 'activo'),
('Silla Ergonómica', 'Muebles', 3299.99, 15, 'activo'),
('Webcam HD', 'Accesorios', 699.99, 60, 'activo'),
('USB 64GB', 'Almacenamiento', 199.99, 200, 'activo'),
('Auriculares BT', 'Audio', 1299.99, 45, 'activo');

INSERT INTO pedidos (cliente_id, fecha, total, estado, metodo_pago) VALUES
(1, '2024-06-01', 17399.97, 'completado', 'tarjeta'),
(2, '2024-06-02', 299.99, 'completado', 'efectivo'),
(3, '2024-06-03', 9299.97, 'enviado', 'tarjeta'),
(1, '2024-06-05', 899.99, 'pendiente', 'transferencia'),
(4, '2024-06-06', 1499.98, 'completado', 'tarjeta'),
(5, '2024-06-07', 3299.99, 'enviado', 'efectivo'),
(2, '2024-06-08', 199.99, 'pendiente', 'tarjeta'),
(3, '2024-06-10', 699.99, 'completado', 'transferencia');

INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 15999.99, 15999.99),
(1, 2, 1, 299.99, 299.99),
(1, 7, 1, 99.99, 99.99),
(2, 2, 1, 299.99, 299.99),
(3, 4, 1, 5499.99, 5499.99),
(3, 3, 1, 899.99, 899.99),
(3, 6, 1, 699.99, 699.99),
(3, 8, 1, 1299.99, 1299.99),
(4, 3, 1, 899.99, 899.99),
(5, 8, 1, 1299.99, 1299.99),
(5, 6, 1, 699.99, 699.99),
(6, 5, 1, 3299.99, 3299.99),
(7, 7, 1, 199.99, 199.99),
(8, 6, 1, 699.99, 699.99);
`;

const DEFAULT_QUERY = `-- Bienvenido a la consola SQLite
-- Base de datos de ejemplo: tienda
-- Tablas: clientes, productos, pedidos, detalle_pedidos

SELECT 
    c.nombre || ' ' || c.apellido AS cliente,
    p.nombre AS producto,
    dp.cantidad,
    dp.subtotal,
    pe.fecha,
    pe.estado
FROM pedidos pe
JOIN clientes c ON pe.cliente_id = c.id
JOIN detalle_pedidos dp ON dp.pedido_id = pe.id
JOIN productos p ON dp.producto_id = p.id
ORDER BY pe.fecha DESC
LIMIT 10;`;

function SqliteConsole({ showHeader = true }) {
  const [sql, setSql] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [dbName, setDbName] = useState("tienda_ejemplo.db");
  const [status, setStatus] = useState("Inicializando...");
  const textareaRef = useRef(null);
  const dbRef = useRef(null);
  const SQLRef = useRef(null);
  const fileInputRef = useRef(null);
  const sqlFileInputRef = useRef(null);

  const initDatabase = useCallback(async () => {
    try {
      setStatus("Cargando motor SQLite...");
      const SQL = await initSqlJs({
        locateFile: (file) => `/sql-wasm.wasm`,
      });
      SQLRef.current = SQL;

      setStatus("Creando base de datos de ejemplo...");
      const db = new SQL.Database();
      db.run(SAMPLE_SCHEMA);
      dbRef.current = db;
      setDbName("tienda_ejemplo.db");

      setLoading(false);
      setStatus("Listo");
      setError(null);
    } catch (err) {
      console.error("Error inicializando SQLite:", err);
      setError("No se pudo cargar el motor SQLite. Verifica tu conexión a internet.");
      setLoading(false);
      setStatus("Error");
    }
  }, []);

  useEffect(() => {
    initDatabase();
  }, [initDatabase]);

  const executeQuery = useCallback(() => {
    if (!dbRef.current || !sql.trim()) return;

    const trimmed = sql.trim();
    if (!trimmed) return;

    setError(null);
    setResults(null);
    setStatus("Ejecutando...");

    try {
      const startTime = performance.now();
      const resultsRaw = dbRef.current.exec(trimmed);
      const elapsed = performance.now() - startTime;

      if (resultsRaw.length === 0) {
        const changes = dbRef.current.getRowsModified();
        setResults({
          type: "dml",
          message: changes > 0
            ? `Consulta ejecutada. ${changes} fila(s) afectada(s).`
            : "Consulta ejecutada. Sin resultados para mostrar.",
          elapsed,
        });
        setHistory((prev) => [
          { query: trimmed, type: "dml", time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 49),
        ]);
      } else {
        const result = resultsRaw[0];
        setResults({
          type: "select",
          columns: result.columns,
          values: result.values,
          rowCount: result.values.length,
          elapsed,
        });
        setHistory((prev) => [
          { query: trimmed, type: "select", time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 49),
        ]);
      }
      setStatus("Listo");
    } catch (err) {
      setError(err.message);
      setStatus("Error");
      setResults(null);
    }
  }, [sql]);

  const loadDbFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file || !SQLRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = new Uint8Array(event.target.result);
        const db = new SQLRef.current.Database(buffer);
        dbRef.current = db;
        setDbName(file.name);
        setResults(null);
        setError(null);
        setStatus(`Cargado: ${file.name}`);
      } catch (err) {
        setError(`Error al cargar el archivo .db: ${err.message}`);
        setStatus("Error");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }, []);

  const downloadDb = useCallback(() => {
    if (!dbRef.current) return;
    const data = dbRef.current.export();
    const blob = new Blob([data], { type: "application/x-sqlite3" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dbName.endsWith(".db") ? dbName : `${dbName}.db`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Descargado");
  }, [dbName]);

  const saveSqlFile = useCallback(() => {
    if (!sql.trim()) return;
    const blob = new Blob([sql], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sqlName = dbName.replace(/\.db$/i, "") || "consulta";
    a.download = `${sqlName}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("SQL guardado");
  }, [sql, dbName]);

  const loadSqlFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSql(event.target.result);
      setStatus(`SQL cargado: ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const clearDatabase = useCallback(() => {
    if (!SQLRef.current) return;
    const db = new SQLRef.current.Database();
    db.run(SAMPLE_SCHEMA);
    dbRef.current = db;
    setResults(null);
    setError(null);
    setStatus("Base de datos reiniciada");
  }, []);

  const runHistoryQuery = useCallback((query) => {
    setSql(query);
    setTimeout(() => executeQuery(), 50);
  }, [executeQuery]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        executeQuery();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const newSql = sql.substring(0, start) + "  " + sql.substring(end);
        setSql(newSql);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 2;
        }, 0);
      }
    },
    [executeQuery, sql]
  );

  if (loading) {
    return (
      <section className="sqlite-container">
        {showHeader && (
          <header className="sqlite-header">
            <span className="sqlite-eyebrow">SEMANA 2 · SQLITE3</span>
            <h2>Consola SQLite Interactiva</h2>
            <p>Cargando motor de base de datos...</p>
          </header>
        )}
        <div className="sqlite-loading">
          <div className="sqlite-spinner" />
          <span>{status}</span>
        </div>
      </section>
    );
  }

  if (error && !dbRef.current) {
    return (
      <section className="sqlite-container">
        {showHeader && (
          <header className="sqlite-header">
            <span className="sqlite-eyebrow">SEMANA 2 · SQLITE3</span>
            <h2>Consola SQLite Interactiva</h2>
          </header>
        )}
        <div className="sqlite-error-banner">
          <span className="sqlite-error-icon">⚠</span>
          <div>
            <strong>Error de inicialización</strong>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sqlite-container">
      {showHeader && (
        <header className="sqlite-header">
          <span className="sqlite-eyebrow">SEMANA 2 · SQLITE3</span>
          <h2>Consola SQLite Interactiva</h2>
          <p>
            Ejecuta consultas SQL sobre archivos <code>.db</code>, guarda tus
            consultas como <code>.sql</code> y descarga la base de datos modificada.
            Usa <kbd>Ctrl</kbd>+<kbd>Enter</kbd> para ejecutar.
          </p>
        </header>
      )}

      <div className="sqlite-body">
        <div className="sqlite-toolbar">
          <div className="sqlite-toolbar-left">
            <span className="sqlite-db-badge">
              <span className="sqlite-db-dot" />
              {dbName}
            </span>
            <span className="sqlite-status">{status}</span>
          </div>
          <div className="sqlite-toolbar-right">
            <button
              className="sqlite-btn sqlite-btn-ghost"
              onClick={() => fileInputRef.current?.click()}
              title="Cargar archivo .db"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Abrir .db
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".db,.sqlite,.sqlite3"
              onChange={loadDbFile}
              style={{ display: "none" }}
            />

            <button
              className="sqlite-btn sqlite-btn-ghost"
              onClick={() => sqlFileInputRef.current?.click()}
              title="Cargar archivo .sql"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Abrir .sql
            </button>
            <input
              ref={sqlFileInputRef}
              type="file"
              accept=".sql,.txt"
              onChange={loadSqlFile}
              style={{ display: "none" }}
            />

            <button
              className="sqlite-btn sqlite-btn-ghost"
              onClick={saveSqlFile}
              title="Guardar consulta como .sql"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Guardar .sql
            </button>

            <button
              className="sqlite-btn sqlite-btn-ghost"
              onClick={clearDatabase}
              title="Reiniciar base de datos"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Reiniciar
            </button>

            <button
              className="sqlite-btn sqlite-btn-primary"
              onClick={downloadDb}
              title="Descargar archivo .db"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar .db
            </button>
          </div>
        </div>

        <div className="sqlite-main">
          <div className="sqlite-editor-panel">
            <div className="sqlite-editor-header">
              <span className="sqlite-editor-label">Editor SQL</span>
              <button
                className="sqlite-run-btn"
                onClick={executeQuery}
                title="Ejecutar consulta (Ctrl+Enter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ejecutar
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="sqlite-editor"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="Escribe tu consulta SQL aquí..."
            />
          </div>

          <div className="sqlite-results-panel">
            {error && (
              <div className="sqlite-error">
                <span className="sqlite-error-title">Error</span>
                <pre>{error}</pre>
              </div>
            )}

            {results && results.type === "dml" && (
              <div className="sqlite-dml-message">
                <span className="sqlite-dml-icon">✓</span>
                {results.message}
                <span className="sqlite-dml-time">{results.elapsed.toFixed(2)} ms</span>
              </div>
            )}

            {results && results.type === "select" && (
              <div className="sqlite-table-wrapper">
                <div className="sqlite-table-meta">
                  <span>{results.rowCount} fila(s)</span>
                  <span>{results.elapsed.toFixed(2)} ms</span>
                </div>
                <div className="sqlite-table-scroll">
                  <table className="sqlite-table">
                    <thead>
                      <tr>
                        {results.columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.values.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx}>{cell ?? "NULL"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!results && !error && (
              <div className="sqlite-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
                <p>Los resultados de la consulta aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="sqlite-history">
            <h4 className="sqlite-history-title">Historial</h4>
            <div className="sqlite-history-list">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  className="sqlite-history-item"
                  onClick={() => runHistoryQuery(item.query)}
                  title={item.query}
                >
                  <span className={`sqlite-history-badge ${item.type}`}>
                    {item.type === "select" ? "SELECT" : "DML"}
                  </span>
                  <span className="sqlite-history-text">
                    {item.query.length > 60
                      ? item.query.slice(0, 60) + "..."
                      : item.query}
                  </span>
                  <span className="sqlite-history-time">{item.time}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SqliteConsole;
