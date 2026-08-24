# Portafolio de Programación 3

Portafolio digital de la materia **Programación 3** de la carrera de **Creatividad Digital**. El proyecto reúne las actividades y tareas realizadas durante el cursado, presentadas como una experiencia web interactiva organizada por semanas.

## Contenido

### Semana 01 — Tareas de la primer semana

- **Mi Ikigai**: Diagrama de Venn interactivo construido con D3.js que visualiza las 4 dimensiones del Ikigai (lo que amas, lo que se te da bien, lo que el mundo necesita, y por lo que te pagan). Incluye tooltips animados al pasar el cursor y una sección de proyectos personales inspirados en el concepto.
- **Abstracción: El perro**: Visualización interactiva del concepto de abstracción en programación orientada a objetos, representado mediante un objeto `perro` con propiedades (`nombre`, `edad`, `raza`, `color`) y métodos (`ladrar`, `correr`, `comer`, `dormir`). Al interactuar con los nodos se despliega una previsualización tipo typewriter del código correspondiente.

## Tech Stack

- **React 19** — Librería UI
- **Vite** — Bundler y dev server
- **Motion** — Animaciones y transiciones
- **D3.js** — Visualización de datos (diagrama Ikigai)
- **Boneyard-js** — Skeleton loading states
- **ESLint** — Linting

No utiliza librerías de routing ni frameworks CSS; todo el estilado se maneja con CSS modules y la navegación es de una sola página con scroll suave entre semanas.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Lint
npm run lint
```

## Estado actual

- Semana 01 completa con tareas hechas en forma de componente, de tal forma que sean reusables en futuras tareas de ser el caso.
- Semana 02 pendiente de implementación.
