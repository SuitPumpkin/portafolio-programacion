import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import "./BaseDeDatos.css";

function parseExcelFile(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheets = {};
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (data.length < 2) continue;
    const headers = data[0].map((h) => String(h).trim());
    const types = data[1].map((t) => String(t).trim());
    const rows = [];
    for (let i = 2; i < data.length; i++) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = data[i][idx] ?? "";
      });
      rows.push(row);
    }
    sheets[name] = { headers, types, rows, count: rows.length };
  }
  return sheets;
}

function TableView({ sheets }) {
  const [activeSheet, setActiveSheet] = useState("cliente");
  const [searchTerm, setSearchTerm] = useState("");
  const sheetNames = Object.keys(sheets);

  const filteredRows = useMemo(() => {
    const sheet = sheets[activeSheet];
    if (!sheet) return [];
    if (!searchTerm.trim()) return sheet.rows;
    const term = searchTerm.toLowerCase();
    return sheet.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [activeSheet, searchTerm, sheets]);

  const active = sheets[activeSheet];
  const pkWidth = 50;
  const dataWidth = 90;
  const colCount = active.headers.length;
  const tableWidth = pkWidth + dataWidth * (colCount - 1);

  const tables = [
    {
      name: "cliente",
      pk: "idCliente",
      fk: null,
      fields: ["idCliente PK", "nombre", "apellido", "email", "telefono", "direccion", "ciudad", "estado"],
      color: "#a855f7",
    },
    {
      name: "pedido",
      pk: "idPedido",
      fk: "idCliente → cliente",
      fields: ["idPedido PK", "idCliente FK", "fechaPedido", "total", "estado", "metodoPago", "direccionEnvio"],
      color: "#ec4899",
    },
    {
      name: "producto",
      pk: "idProducto",
      fk: null,
      fields: ["idProducto PK", "nombre", "descripcion", "precio", "stock", "categoria", "marca", "estado"],
      color: "#3b82f6",
    },
    {
      name: "detallePedido",
      pk: "idDetalle",
      fk: "idPedido → pedido, idProducto → producto",
      fields: ["idDetalle PK", "idPedido FK", "idProducto FK", "cantidad", "precioUnitario", "subtotal"],
      color: "#f59e0b",
    },
  ];

  return (
    <div className="db-layout">
      <div className="db-table-section">
        <div className="excel-toolbar">
          <div className="excel-tabs">
            {sheetNames.map((name) => (
              <button
                key={name}
                className={`excel-tab ${activeSheet === name ? "is-active" : ""}`}
                onClick={() => {
                  setActiveSheet(name);
                  setSearchTerm("");
                }}
              >
                {name}
                <span className="tab-count">{sheets[name].count}</span>
              </button>
            ))}
          </div>
          <div className="excel-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="excel-search-input"
            />
          </div>
        </div>

        <div className="excel-sheet-container">
          <div className="excel-table-wrapper">
            <table className="excel-table" style={{ width: tableWidth }}>
              <colgroup>
                {active.headers.map((_, idx) => (
                  <col key={idx} style={{ width: idx === 0 ? pkWidth : dataWidth }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {active.headers.map((header, idx) => (
                    <th
                      key={header}
                      className={`excel-th ${idx === 0 ? "pk-col" : ""}`}
                    >
                      {idx === 0 && <span className="pk-badge">PK</span>}
                      <span className="th-text">{header}</span>
                      <span className="type-hint">{active.types[idx]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="excel-grid-row">
                    {active.headers.map((header, idx) => (
                      <td
                        key={header}
                        className={`excel-cell excel-td ${idx === 0 ? "pk-col" : ""}`}
                      >
                        {idx === 0 && <span className="row-pk">{row[header]}</span>}
                        {idx > 0 && <span className="td-text">{String(row[header] ?? "")}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="excel-footer">
            <span>{filteredRows.length} registros</span>
            <span>Hoja: {activeSheet}</span>
          </div>
        </div>
      </div>

      <div className="db-relations-section">
        <h3 className="relations-title">Relaciones</h3>
        <div className="relations-grid">
          {tables.map((table) => (
            <div key={table.name} className="relation-card" style={{ borderColor: table.color }}>
              <div className="relation-card-header" style={{ background: table.color }}>
                <h4>{table.name}</h4>
                <div className="relation-card-meta">
                  <span className="relation-pk">PK: {table.pk}</span>
                  {table.fk && <span className="relation-fk">FK: {table.fk}</span>}
                </div>
              </div>
              <ul className="relation-fields">
                {table.fields.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relation-list-container">
          <h4>Cardinalidades</h4>
          <div className="relation-list">
            <div className="relation-item">
              <span className="rel-table" style={{ color: tables[0].color }}>cliente</span>
              <span className="rel-cardinality">1</span>
              <span className="rel-symbol">────────</span>
              <span className="rel-cardinality">N</span>
              <span className="rel-table" style={{ color: tables[1].color }}>pedido</span>
            </div>
            <div className="relation-item">
              <span className="rel-table" style={{ color: tables[1].color }}>pedido</span>
              <span className="rel-cardinality">1</span>
              <span className="rel-symbol">────────</span>
              <span className="rel-cardinality">N</span>
              <span className="rel-table" style={{ color: tables[3].color }}>detallePedido</span>
            </div>
            <div className="relation-item">
              <span className="rel-table" style={{ color: tables[2].color }}>producto</span>
              <span className="rel-cardinality">1</span>
              <span className="rel-symbol">────────</span>
              <span className="rel-cardinality">N</span>
              <span className="rel-table" style={{ color: tables[3].color }}>detallePedido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BaseDeDatos() {
  const [sheets, setSheets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/tienda-online.xlsx")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo Excel");
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const parsed = parseExcelFile(buffer);
        setSheets(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="db-container">
      <div className="db-header">
        <span className="db-eyebrow">BASE DE DATOS</span>
        <h2>Tienda en Linea</h2>
        <p>
          Entidades: cliente, producto, pedido, detallePedido | 200 registros
          {" "}
          <a href="/tienda-online.xlsx" download className="db-download-link">
            (descargar Excel)
          </a>
        </p>
      </div>

      <div className="db-body">
        {loading && (
          <div className="db-loading">Cargando base de datos...</div>
        )}
        {error && (
          <div className="db-error">Error: {error}</div>
        )}
        {!loading && !error && sheets && (
          <div>
            <TableView sheets={sheets} />
          </div>
        )}
      </div>
    </section>
  );
}
