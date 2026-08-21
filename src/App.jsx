import Ikigai from "./components/Ikigai/Ikigai";
import Abstraccion from "./components/Abstraccion/Abstraccion";
import DogSvg from "./components/Abstraccion/DogSvg";
import "./App.css";

import {
  ikigaiData,
  projects,
  perroProperties,
  perroMethods,
} from "./data/week01";

function App() {
  return (
    <main>
      <Ikigai
        {...ikigaiData}
        projects={projects}
      />

      <Abstraccion
        titulo="Abstracción: El perro"
        descripcion="Representación visual de las propiedades y métodos que forman parte de un objeto."
        svg={<DogSvg />}
        propiedades={perroProperties}
        metodos={perroMethods}
      />
    </main>
  );
}

export default App;