import "./App.css";
import Calculator from "./componets/Calculator/Calculator";
import Card from "./componets/Card/Card";
import Clock from "./componets/Clock/Clock";
import CurrencyConverter from "./componets/CurrencyConverter/CurrencyConverter";
import PaperRockScissors from "./componets/PaperRockScissors/PaperRockScissors";
import WeatherWidget from "./componets/WeatherWidget/WeatherWidget";
function App() {
  return (
    <>
      {/* <Calculator /> */}
      {/* <Clock /> */}
      {/* <PaperRockScissors /> */}
      {/* <WeatherWidget /> */}
      {/* <CurrencyConverter /> */}

      <div className="card-list">
        {[...Array(6)].map((_, i) => (
          <Card key={i} />
        ))}
      </div>
    </>
  );
}

export default App;
