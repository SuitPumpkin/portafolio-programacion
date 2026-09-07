# Portafolio de Programación 3

Portafolio digital de la materia **Programación 3** de la carrera de **Creatividad Digital**. El proyecto reúne las actividades y tareas realizadas durante el cursado, presentadas como una experiencia web interactiva organizada por semanas.

## Contenido

### Semana 01 — Tareas de la primer semana

- **Mi Ikigai**: Diagrama de Venn interactivo construido con D3.js que visualiza las 4 dimensiones del Ikigai (lo que amas, lo que se te da bien, lo que el mundo necesita, y por lo que te pagan). Incluye tooltips animados al pasar el cursor y una sección de proyectos personales inspirados en el concepto.
<img width="800" height="430" alt="ikigai" src="https://github.com/user-attachments/assets/b5c0d597-5c37-4943-97d7-6ee8f4e46c30" />

- **Abstracción: El perro**: Visualización interactiva del concepto de abstracción en programación orientada a objetos, representado mediante un objeto `perro` con propiedades (`nombre`, `edad`, `raza`, `color`) y métodos (`ladrar`, `correr`, `comer`, `dormir`). Al interactuar con los nodos se despliega una previsualización tipo typewriter del código correspondiente.
<img width="800" height="430" alt="Abstracción" src="https://github.com/user-attachments/assets/0c97612b-c123-4171-ba57-e0880af9cdeb" />

- **Base de datos: Tienda online**: visualizacion del libro de excel y las relaciones entre las tablas. (hay un error visual que no logre solucionar con la tabla, pero es funcional xddd)
<img width="1180" height="909" alt="imagen" src="https://github.com/user-attachments/assets/73b3828e-1585-410a-8e24-18ea055cda0f" />

- **Velocidad de internet**: Calculo de la velocidad teorica y real de internet y comparandolo en distintas tareas practicas con tiempos de carga y descarga estimados
<img width="1153" height="855" alt="imagen" src="https://github.com/user-attachments/assets/a9e43be6-833e-4c43-bb5e-efaff5e27b4a" />

- **Visualizador de escalas: Unidades de medida de software**: Visualizador en tree.js que permite visualizar la diferencia entre una unidad y la siguiente, desde el Bit hasta el Zettabyte.
<img width="1097" height="870" alt="imagen" src="https://github.com/user-attachments/assets/5e7bb41a-de25-4377-823e-2e37ba406aa6" />

### Semana 02 — Tareas de la segunda semana

- **Componente Sqlite3 funcional**: Componente funcional de SQLite3 en el navegador. Soporta archivos .db y .sql, historial de consultas y descarga de la base de datos.
<img width="1079" height="802" alt="imagen" src="https://github.com/user-attachments/assets/f174c908-a420-4726-9697-372e93e4030a" />

- **Base de datos a Diagrama ER**: Genera un diagrama Entidad-Relación a partir de un archivo SQLite, detectando tablas, columnas, tipos, claves primarias y foráneas.


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
- Semana 02 y 03 completas (mas o menos) las tareas fueron consultas y ejercicios en Sqlite3 asi que para representarlo mejor implemente un componente capaz de usar sqlite3 aqui como si fuera la consola o un editor de DB.
- Semana 04 en progreso
