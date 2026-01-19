import { useState, useRef } from "react";
import "./Timer.css";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleStart = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };
  const handleStop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };
  const handleReset = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setSeconds(0);
  };
  return (
    <div className="timer-container">
      <div className="timer-circle"></div>
      <div className="timer-screen">{formatTime(seconds)}</div>
      <button onClick={handleStart} disabled={running}>
        Start
      </button>
      <button onClick={handleStop} disabled={!running}>
        Stop
      </button>
      <button onClick={handleReset}>Reset</button>{" "}
    </div>
  );
};

export default Timer;
