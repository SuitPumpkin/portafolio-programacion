import { useState, useEffect, useRef, useCallback } from "react";
import initSqlJs from "sql.js";
import mermaid from "mermaid";
import "./ERDiagram.css";

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

function extractSchema(db) {
  const tables = [];
  const tableResult = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );

  const tableNames = tableResult[0]?.values || [];

  for (const row of tableNames) {
    const tableName = row[0];

    const columnsResult = db.exec(`PRAGMA table_info("${tableName}")`);
    const columns = (columnsResult[0]?.values || []).map((col) => ({
      cid: col[0],
      name: col[1],
      type: col[2],
      notnull: col[3],
      dflt_value: col[4],
      pk: col[5],
    }));

    const fksResult = db.exec(`PRAGMA foreign_key_list("${tableName}")`);
    const foreignKeys = (fksResult[0]?.values || []).map((fk) => ({
      id: fk[0],
      seq: fk[1],
      table: fk[2],
      from: fk[3],
      to: fk[4],
      on_update: fk[5],
      on_delete: fk[6],
      match: fk[7],
    }));

    tables.push({ name: tableName, columns, foreignKeys });
  }

  return tables;
}

function generateMermaidER(tables) {
  const lines = ["classDiagram"];
  const addedRelations = new Set();

  for (const table of tables) {
    lines.push(`    class ${table.name} {`);
    for (const col of table.columns) {
      const visibility = col.pk > 0 ? "+" : "+";
      const label = col.pk > 0 ? `${col.type} ${col.name} PK` : `${col.type} ${col.name}`;
      lines.push(`        ${visibility}${label}`);
    }
    lines.push("    }");
  }

  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      const key = `${table.name}|${fk.from}|${fk.table}|${fk.to}`;
      if (addedRelations.has(key)) continue;
      addedRelations.add(key);

      const fromPk = table.columns.find((c) => c.pk > 0);
      const isFromPk = fromPk && fromPk.name === fk.from;

      if (isFromPk) {
        lines.push(
          `    ${table.name} "1" --> "*" ${fk.table} : "${fk.from} → ${fk.to}"`
        );
      } else {
        lines.push(
          `    ${table.name} "*" --> "1" ${fk.table} : "${fk.from} → ${fk.to}"`
        );
      }
    }
  }

  return lines.join("\n");
}

export default function ERDiagram({ showHeader = true }) {
  const [dbName, setDbName] = useState("tienda_ejemplo.db");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Inicializando...");
  const diagramRef = useRef(null);
  const dbRef = useRef(null);
  const SQLRef = useRef(null);
  const fileInputRef = useRef(null);

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

      const tables = extractSchema(db);
      setMermaidCode(generateMermaidER(tables));
      setDbName("tienda_ejemplo.db");
      setLoading(false);
      setStatus("Listo");
      setError(null);
    } catch (err) {
      console.error("Error inicializando ERDiagram:", err);
      setError("No se pudo cargar el motor SQLite.");
      setLoading(false);
      setStatus("Error");
    }
  }, []);

  useEffect(() => {
    initDatabase();
  }, [initDatabase]);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "dark" });
  }, []);

  useEffect(() => {
    if (!mermaidCode || !diagramRef.current) return;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render("er-diagram", mermaidCode);
        diagramRef.current.innerHTML = svg;
      } catch (err) {
        console.error("Error renderizando diagrama:", err);
        diagramRef.current.innerHTML = `<pre style="color:#f87171;padding:1rem;">${err.message}</pre>`;
      }
    };

    renderDiagram();
  }, [mermaidCode]);

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

        const tables = extractSchema(db);
        setMermaidCode(generateMermaidER(tables));
        setError(null);
        setStatus(`Diagrama generado: ${file.name}`);
      } catch (err) {
        setError(`Error al cargar el archivo .db: ${err.message}`);
        setStatus("Error");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }, []);

  const resetDatabase = useCallback(() => {
    if (!SQLRef.current) return;
    const db = new SQLRef.current.Database();
    db.run(SAMPLE_SCHEMA);
    dbRef.current = db;

    const tables = extractSchema(db);
    setMermaidCode(generateMermaidER(tables));
    setDbName("tienda_ejemplo.db");
    setError(null);
    setStatus("Base de datos reiniciada");
  }, []);

  if (loading) {
    return (
      <section className="er-container">
        {showHeader && (
          <header className="er-header">
            <span className="er-eyebrow">SEMANA 2 · DIAGRAMA ER</span>
            <h2>Diagrama Entidad-Relación desde .db</h2>
            <p>Cargando motor de base de datos...</p>
          </header>
        )}
        <div className="er-loading">
          <div className="er-spinner" />
          <span>{status}</span>
        </div>
      </section>
    );
  }

  if (error && !mermaidCode) {
    return (
      <section className="er-container">
        {showHeader && (
          <header className="er-header">
            <span className="er-eyebrow">SEMANA 2 · DIAGRAMA ER</span>
            <h2>Diagrama Entidad-Relación desde .db</h2>
          </header>
        )}
        <div className="er-error-banner">
          <span className="er-error-icon">⚠</span>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="er-container">
      {showHeader && (
        <header className="er-header">
          <span className="er-eyebrow">SEMANA 2 · DIAGRAMA ER</span>
          <h2>Diagrama Entidad-Relación desde .db</h2>
          <p>
            Genera automáticamente un diagrama ER leyendo el schema de un archivo
            SQLite. Las tablas, columnas, tipos y relaciones se detectan
            directamente desde la base de datos.
          </p>
        </header>
      )}

      <div className="er-body">
        <div className="er-toolbar">
          <div className="er-toolbar-left">
            <span className="er-db-badge">
              <span className="er-db-dot" />
              {dbName}
            </span>
            <span className="er-status">{status}</span>
          </div>
          <div className="er-toolbar-right">
            <button
              className="er-btn er-btn-ghost"
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
              className="er-btn er-btn-ghost"
              onClick={resetDatabase}
              title="Reiniciar base de datos de ejemplo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Reiniciar
            </button>
          </div>
        </div>

        <div className="er-diagram-wrapper">
          {error && (
            <div className="er-banner er-banner-error">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          )}

          <div className="er-diagram-container">
            <div
              ref={diagramRef}
              className="er-diagram"
              id="er-diagram-root"
            />
          </div>

          <div className="er-mermaid-code">
            <div className="er-mermaid-header">
              <span>Código Mermaid</span>
              <button
                className="er-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(mermaidCode);
                  setStatus("Código copiado");
                }}
              >
                Copiar
              </button>
            </div>
            <pre><code>{mermaidCode}</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
}
