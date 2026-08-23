import Ikigai from "../components/Ikigai/Ikigai";
import Abstraccion from "../components/Abstraccion/Abstraccion";
import DogSvg from "../components/Abstraccion/DogSvg";
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
    title: "Fundamentos y Pensamiento Computacional",
    description:
      "Exploración personal, identificación de intereses y primeros acercamientos a la abstracción mediante objetos.",
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
    ],
  },
];
