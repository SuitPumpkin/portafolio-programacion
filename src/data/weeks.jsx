import Ikigai from "../components/Ikigai/Ikigai";
import Abstraccion from "../components/Abstraccion/Abstraccion";
import DogSvg from "../components/Abstraccion/DogSvg";
import BaseDeDatos from "../components/BaseDeDatos/BaseDeDatos";
import InternetSpeed from "../components/InternetSpeed/InternetSpeed";
import DataUnitsVisualizer from "../components/DataUnitsVisualizer/DataUnitsVisualizer";
import SqliteConsole from "../components/SqliteConsole/SqliteConsole";
import {
  ikigaiData,
  projects,
  perroProperties,
  perroMethods,
  internetSpeedData,
  dataUnitsData,
} from "./week01";
import { sqliteConsoleData } from "./week02";

export const weeks = [
  {
    id: "semana-1",
    number: "01",
    title: "Tareas de la primer semana",
    description:
      "Ikigai con lista de proyectos para desarrolar, Abstracción, ... , Bases de datos con tablas primarias y tablas medias, Representación visual de la diferencia entre diferentes medidas digitales, Visualización de unidades de datos de bit a zettabyte.",
    tasks: [
      {
        id: "ikigai",
        number: "01",
        title: "Mi Ikigai",
        description:
          "Diagrama interactivo que visualiza la intersección entre lo que amo, lo que soy bueno, lo que el mundo necesita y aquello por lo que puedo aportar valor.",
        component: Ikigai,
        props: {
          ...ikigaiData,
          projects,
          showHeader: false,
        },
      },
      {
        id: "abstraccion",
        number: "02",
        title: "Abstracción: El perro",
        description:
          "Representación visual de las propiedades y métodos que forman parte de un objeto, con ejemplificación de código en vivo.",
        component: Abstraccion,
        props: {
          titulo: "Abstracción: El perro",
          descripcion:
            "Representación visual de las propiedades y métodos que forman parte de un objeto.",
          svg: <DogSvg />,
          propiedades: perroProperties,
          metodos: perroMethods,
          showHeader: false,
        },
      },
      {
        id: "tienda",
        number: "03",
        title: "Base de datos: Tienda en línea",
        description:
          "Modelo de base de datos para una tienda en línea con entidades cliente, producto, pedido y detallePedido. Incluye 200+ registros, 2 vistas (Excel y tablas relacionadas) y relaciones 1:N.",
        component: BaseDeDatos,
        props: {
          showHeader: false,
        },
      },
      {
        id: "internet-speed",
        number: "04",
        title: "Velocidad de Internet",
        description:
          "Comparativa entre la velocidad teórica del proveedor y la velocidad real medida con speedtest.net. Muestra ambas en Mbps y MB/s, y calcula el tiempo de descarga de 200 canciones y la subida de un videojuego de 78 GB.",
        component: InternetSpeed,
        props: {
          ...internetSpeedData,
          showHeader: false,
        },
      },
      {
        id: "data-units",
        number: "05",
        title: "De un Bit a un Zettabyte",
        description:
          "Visualización interactiva con Three.js que muestra la diferencia exponencial de escala entre las unidades de medida digitales, desde un bit representado como un cubo hasta un zettabyte.",
        component: DataUnitsVisualizer,
        props: {
          ...dataUnitsData,
          showHeader: false,
        },
      },
    ],
  },
  {
    id: "semana-2",
    number: "02",
    title: "Tareas de la segunda semana",
    description:
      "Consola SQLite3 interactiva que permite ejecutar consultas SQL sobre archivos .db, guardar consultas como .sql y descargar la base de datos modificada.",
    tasks: [
      {
        id: "sqlite-console",
        number: "01",
        title: "Consola SQLite3",
        description:
          "Componente funcional de SQLite3 en el navegador. Soporta archivos .db y .sql, historial de consultas y descarga de la base de datos.",
        component: SqliteConsole,
        props: {
          ...sqliteConsoleData,
          showHeader: false,
        },
      },
    ],
  },
];
