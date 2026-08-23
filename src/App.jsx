import WeekNav from "./components/WeekNav";
import WeekSection from "./components/WeekSection";
import "./App.css";
import { weeks } from "./data/weeks";

function App() {
  return (
    <main className="app">
      <WeekNav weeks={weeks} />
      {weeks.map((week) => (
        <WeekSection key={week.id} week={week} />
      ))}
    </main>
  );
}

export default App;
