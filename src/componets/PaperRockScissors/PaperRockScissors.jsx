import { useState, useCallback, useRef, useEffect } from "react";
import "./PaperRockScissors.css";

// Static values defined outside the component to prevent re-creation on each render
const CHOICES = ["Paper", "Rock", "Scissors"]; // Available game choices
const CHOICE_ICONS = { Paper: "✋", Rock: "✊", Scissors: "✌️" }; // Visual icons for each choice
const ANIMATION_CYCLE = ["✊", "✋", "✌️"]; // Icons cycle during computer "thinking" animation

// Game logic utility function - determines the winner based on classic rock-paper-scissors rules
const determineWinner = (userChoice, computerChoice) => {
  // If both choices are the same, it's a draw
  if (userChoice === computerChoice) return "draw";

  // Define winning conditions: key beats value
  const winConditions = {
    Paper: "Rock", // Paper covers Rock
    Rock: "Scissors", // Rock crushes Scissors
    Scissors: "Paper", // Scissors cuts Paper
  };

  // Check if user's choice beats computer's choice
  return winConditions[userChoice] === computerChoice ? "user" : "computer";
};

const PaperRockScissors = () => {
  // State management for game data
  const [userChoice, setUserChoice] = useState(""); // User's selected choice
  const [computerChoice, setComputerChoice] = useState(""); // Computer's generated choice
  const [result, setResult] = useState(""); // Game result message
  const [isAnimating, setIsAnimating] = useState(false); // Animation state flag
  const [animationChoice, setAnimationChoice] = useState(""); // Current icon during animation
  const [scores, setScores] = useState({
    // Score tracking object
    userWins: 0,
    draws: 0,
    computerWins: 0,
  });

  // Use useRef to store interval ID for proper cleanup and prevent memory leaks
  const animationIntervalRef = useRef(null);

  // Helper function to update scores based on game outcome
  // Using useCallback to prevent unnecessary re-renders
  const updateScores = useCallback((outcome) => {
    // Map outcome strings to score object keys for cleaner code
    const scoreMap = {
      user: "userWins",
      computer: "computerWins",
      draw: "draws",
    };

    // Update the specific score counter based on outcome
    setScores((prev) => ({
      ...prev,
      [scoreMap[outcome]]: prev[scoreMap[outcome]] + 1,
    }));
  }, []);

  // Cleanup interval on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // Main game function - handles user choice and triggers game sequence
  const playGame = useCallback(
    (choice) => {
      // Set user's choice and initialize game state
      setUserChoice(choice);
      setIsAnimating(true); // Start animation
      setResult(""); // Clear previous result
      setComputerChoice(""); // Clear previous computer choice

      // Animation variables
      let cycleCount = 0; // Track animation cycles
      const maxCycles = 6; // Total animation cycles before stopping

      // Start animation interval - cycles through icons to simulate "thinking"
      animationIntervalRef.current = setInterval(() => {
        // Set the current animation icon (cycles through ANIMATION_CYCLE array)
        setAnimationChoice(
          ANIMATION_CYCLE[cycleCount % ANIMATION_CYCLE.length]
        );
        cycleCount++;

        // Stop animation after maximum cycles and determine game outcome
        if (cycleCount >= maxCycles) {
          // Clean up the interval
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;

          // Generate random computer choice
          const randomIndex = Math.floor(Math.random() * CHOICES.length);
          const computer = CHOICES[randomIndex];
          setComputerChoice(computer);
          setIsAnimating(false); // Stop animation

          // Determine game winner using utility function
          const winner = determineWinner(choice, computer);

          // Map winner to user-friendly messages
          const resultMessages = {
            draw: "It's a Draw!",
            user: "You Win!",
            computer: "Computer Wins!",
          };

          // Update UI with result and scores
          setResult(resultMessages[winner]);
          updateScores(winner);
        }
      }, 200); // Animation interval: 200ms between icon changes
    },
    [updateScores] // Dependency array for useCallback
  );

  return (
    <div className="game-container">
      {/* Game title */}
      <h1>Rock, Paper, Scissors</h1>

      {/* Choice selection buttons */}
      <div className="choices">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            className={`choice-button ${userChoice === choice ? "bounce" : ""}`}
            onClick={() => playGame(choice)}
            title={choice}
            aria-label={`Choose ${choice}`}
            disabled={isAnimating} // Prevent multiple clicks during animation
          >
            <div className="choice-icon">{CHOICE_ICONS[choice]}</div>
            <div className="choice-label">{choice}</div>
          </button>
        ))}
      </div>

      {/* Display area for user vs computer choices */}
      <div className="middle-display">
        {/* User's choice display */}
        <div className="player-choice">
          <h3>You</h3>
          <div className={`choice-display ${userChoice ? "selected" : ""}`}>
            {userChoice ? CHOICE_ICONS[userChoice] : "❓"}
          </div>
          <p>{userChoice || "Choose"}</p>
        </div>

        {/* VS separator */}
        <div className="vs">VS</div>

        {/* Computer's choice display with animation support */}
        <div className="player-choice">
          <h3>Computer</h3>
          <div
            className={`choice-display ${
              isAnimating ? "animating" : computerChoice ? "selected" : ""
            }`}
          >
            {/* Show animation icon during thinking, final choice after, or placeholder */}
            {isAnimating
              ? animationChoice
              : computerChoice
                ? CHOICE_ICONS[computerChoice]
                : "❓"}
          </div>
          <p>{isAnimating ? "Thinking..." : computerChoice || "Waiting..."}</p>
        </div>
      </div>

      {/* Game result display with accessibility support */}
      <div className="results" aria-live="polite">
        <div className={`result-box ${result ? "fade-in" : ""}`}>
          <h2>Result</h2>
          <p>{result || "None"}</p>
        </div>
      </div>

      {/* Score tracking display */}
      <div className="win-counters">
        <p>User Wins: {scores.userWins}</p>
        <p>Draws: {scores.draws}</p>
        <p>Computer Wins: {scores.computerWins}</p>
      </div>
    </div>
  );
};

export default PaperRockScissors;
