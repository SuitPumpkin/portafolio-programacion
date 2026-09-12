import { motion } from "motion/react";
import "./HTMLCheatsheet.css";

function CodeBlock({ code }) {
  const parts = code.split(/(<[^>]+>|<!--.*?-->)/);
  return (
    <pre className="html-cheatsheet-code">
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("<!--")) return <span key={i} className="comment">{part}</span>;
        if (part.startsWith("<")) {
          const tagMatch = part.match(/<\/?([a-zA-Z0-9]+)/);
          const tag = tagMatch ? tagMatch[0] : part;
          const rest = tagMatch ? part.slice(tagMatch[0].length) : "";
          return (
            <span key={i}>
              <span className="tag">{tag}</span>
              {rest && <span className="attr">{rest}</span>}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </pre>
  );
}

const SECTIONS = [
  {
    icon: "📄",
    title: "Documento HTML",
    code: `<!DOCTYPE html>
<html>
  <head>
    <!-- Metadata del documento -->
    <title>Mi Página</title>
  </head>
  <body>
    <!-- Elementos visuales -->
  </body>
</html>`,
    example: `<!-- Cabecera -->
<header>
  <nav>Enlaces</nav>
</header>

<!-- Contenido principal -->
<main>
  <section>Sección 1</section>
  <aside>Barra lateral</aside>
</main>

<!-- Pie de página -->
<footer>Rodríguez © 2026</footer>`,
  },
  {
    icon: "📝",
    title: "Encabezados y Texto",
    code: `<h1> Título 1 </h1>
<h2> Título 2 </h2>
<h3> Título 3 </h3>
<h4> Título 4 </h4>
<h5> Título 5 </h5>
<h6> Título 6 </h6>

<p> Párrafo de texto </p>

<pre>
  Texto preformateado
  conserva espacios y saltos
</pre>`,
    example: `<b>Texto en negrita</b>
<i>Texto en itálica</i>
<u>Subrayado</u>
<s> tachado </s>

<em>énfasis</em>
<strong>importante</strong>

<code>console.log("Hola");</code>
<mark>marcado</mark>
<sub>subíndice</sub>
<sup>superíndice</sup>`,
  },
  {
    icon: "📋",
    title: "Listas y Tablas",
    code: `<!-- Lista ordenada -->
<ol>
  <li>Elemento 1</li>
  <li>Elemento 2</li>
</ol>

<!-- Lista no ordenada -->
<ul>
  <li>Elemento A</li>
  <li>Elemento B</li>
</ul>

<!-- Lista de descripciones -->
<dl>
  <dt>Término</dt>
  <dd>Definición del término</dd>
</dl>`,
    example: `<table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Precio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Manzana</td>
      <td>$1.6</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    icon: "⌨️",
    title: "Formularios y Inputs",
    code: `<!-- Tipos de input -->
<input type="text" placeholder="Nombre">
<input type="email" placeholder="Email">
<input type="password">
<input type="number">
<input type="date">
<input type="file">

<!-- Select -->
<select>
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>

<!-- Botones -->
<button>Enviar</button>
<input type="submit" value="Enviar">
<input type="reset">`,
    example: `<form>
  <fieldset>
    <legend>Datos personales</legend>
    <label>Nombre:</label>
    <input type="text" required>

    <label>Género:</label>
    <input type="radio" name="genero" id="m">
    <label for="m">Masculino</label>
    <input type="radio" name="genero" id="f">
    <label for="f">Femenino</label>
  </fieldset>
</form>`,
  },
  {
    icon: "🖼️",
    title: "Multimedia",
    code: `<!-- Imagen -->
<img src="foto.jpg" alt="Descripción">

<!-- Video -->
<video controls>
  <source src="video.mp4" type="video/mp4">
</video>

<!-- Audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mp3">
</audio>

<!-- IFrame -->
<iframe src="https://youtube.com/..."></iframe>`,
    example: `<!-- Imagen responsive -->
<picture>
  <source media="(max-width: 700px)" srcset="pequena.jpg">
  <img src="grande.jpg" alt="Montaña">
</picture>

<!-- Canvas -->
<canvas width="200" height="200"></canvas>`,
  },
  {
    icon: "🔗",
    title: "Enlaces y Metadatos",
    code: `<!-- Enlace -->
<a href="https://ejemplo.com">Texto del enlace</a>

<!-- CSS -->
<link rel="stylesheet" href="estilos.css">

<!-- JavaScript -->
<script src="app.js"></script>

<!-- Meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    example: `<meta name="description" content="Descripción SEO">
<meta property="og:title" content="Mi Página">

<link rel="icon" href="favicon.ico">
<link rel="preload" href="app.js" as="script">`,
  },
];

function HTMLCheatsheet({ showHeader = true, eyebrow, title, description }) {
  return (
    <motion.section
      className="html-cheatsheet"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {showHeader && (
        <div className="html-cheatsheet-header">
          <span className="html-cheatsheet-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      )}

      <div className="html-cheatsheet-grid">
        {SECTIONS.map((sec) => (
          <div className="html-cheatsheet-card" key={sec.title}>
            <div className="html-cheatsheet-card-header">
              <span className="html-cheatsheet-card-icon">{sec.icon}</span>
              <h3>{sec.title}</h3>
            </div>
            <div className="html-cheatsheet-card-body">
              <div className="html-cheatsheet-section">
                <span className="html-cheatsheet-section-title">Código</span>
                <CodeBlock code={sec.code} />
              </div>
              <div className="html-cheatsheet-section">
                <span className="html-cheatsheet-section-title">Ejemplo</span>
                <pre className="html-cheatsheet-example">{sec.example}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="html-cheatsheet-footer">
        <span>Basado en</span>
        <a
          href="https://syntaxsimplified.com/cheatsheet/HTML/hypertext_markup_language.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Syntax Simplified HTML Cheat Sheet
        </a>
      </div>
    </motion.section>
  );
}

export default HTMLCheatsheet;
