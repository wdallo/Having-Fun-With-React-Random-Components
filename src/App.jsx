import { useState } from "react";
import "./App.css";
import Calculator from "./componets/Calculator/Calculator";
import Card from "./componets/Card/Card";
import Clock from "./componets/Clock/Clock";
import CurrencyConverter from "./componets/CurrencyConverter/CurrencyConverter";
import PaperRockScissors from "./componets/PaperRockScissors/PaperRockScissors";
import WeatherWidget from "./componets/WeatherWidget/WeatherWidget";
import ImageGalleryTest from "./componets/ImageGallery/ImageGalleryTest";
import Timer from "./componets/Timer/Timer";
import ConnectionStatus from "./componets/ConnectionStatus/ConnectionStatus";
import ButtonWithLoader from "./componets/ButtonWithLoader/ButtonWithLoader";
import VideoPlayer from "./componets/VideoPlayer/VideoPlayer";

function App() {
  return (
    <>
      <ConnectionStatus />
      {/* <Calculator /> */}
      {/* <Clock /> */}
      {/* <PaperRockScissors /> */}
      {/* <WeatherWidget /> */}
      {/* <CurrencyConverter /> */}
      {/* <div className="card-list">
        {[...Array(6)].map((_, i) => (
          <Card key={i} />
        ))}
      </div> */}
      {/* <ImageGalleryTest /> */}
      {/* <Timer /> */}
      {/* <ButtonWithLoader
        onClick={async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Async operation completed!");
        }}
        loadingText="Please wait..."
      >
        Click Me
      </ButtonWithLoader> */}
      <VideoPlayer />
    </>
  );
}

export default App;
