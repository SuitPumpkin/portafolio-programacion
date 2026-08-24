import Ikigai from "../components/Ikigai/Ikigai";
import Abstraccion from "../components/Abstraccion/Abstraccion";
import DogSvg from "../components/Abstraccion/DogSvg";
import BaseDeDatos from "../components/BaseDeDatos/BaseDeDatos";
import {
  ikigaiData,
  projects,
  perroProperties,
  perroMethods,
} from "./week01";

export const weeks = [
  {
    id: "semana-1",
    number: "01",
    title: "Tareas de la primer semana",
    description:
      "Ikigai con lista de proyectos para desarrolar, Abstracción, ... , Bases de datos con tablas primarias y tablas medias, Representación visual de la diferencia entre diferentes medidas digitales.",
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
    ],
  },
];
