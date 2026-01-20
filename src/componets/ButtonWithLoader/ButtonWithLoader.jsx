import { useState } from "react";
import "./ButtonWithLoader.css";

// ButtonWithLoader component displays a button that shows a loading state when clicked
const ButtonWithLoader = ({
  onClick, // Function to execute when button is clicked
  children, // Button content (label)
  loadingText = "Loading...", // Text to display while loading
}) => {
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // Handles button click, shows loader while async onClick runs
  const handleClick = async () => {
    setIsLoading(true); // Set loading state
    await onClick(); // Wait for onClick to finish
    setIsLoading(false); // Reset loading state
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading} // Disable button while loading
        className="button-with-loader"
      >
        {isLoading ? loadingText : children}
        {/* Show loading text or children */}
      </button>
    </>
  );
};

export default ButtonWithLoader;
