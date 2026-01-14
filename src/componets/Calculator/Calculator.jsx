// React hooks for state management, performance optimization, and side effects
import { useCallback, useState, useEffect, useMemo } from "react";
// Calculator-specific styles
import "./Calculator.css";

const Calculator = () => {
  // State for the current value displayed on the calculator screen
  const [screenNumbers, setScreenNumbers] = useState("0"); // Showing on Screen Numbers State
  // State for the mathematical expression being built by user input
  const [expression, setExpression] = useState(""); // Expression State
  // State to track if the screen is currently showing a calculation result
  const [previousResult, setPreviousResult] = useState(null); // Track if showing result

  // Memoized array of calculator button values in grid layout order
  // Layout: 4 rows of operation buttons, then 4 rows of numbers and operators
  // Uses symbols: % (percent), CE (clear entry), C (clear all), ⌫ (backspace),
  // ⅟x (reciprocal), x² (square), ²√x (square root), ÷×-+ (basic operations)
  const buttonValues = useMemo(
    () => [
      "%",
      "CE",
      "C",
      "⌫",
      "⅟x",
      "x²",
      "²√x",
      "÷",
      "7",
      "8",
      "9",
      "×",
      "4",
      "5",
      "6",
      "-",
      "1",
      "2",
      "3",
      "+",
      "+/-",
      "0",
      ",",
      "=",
    ],
    []
  );

  // Helper function to format numbers for display
  // Limits decimal places to 8 and handles infinite/NaN values
  const formatNumber = useCallback((num) => {
    if (!isFinite(num)) return "Error";
    return Number(num.toFixed(8)).toString();
  }, []);

  // Safe evaluation function that converts calculator symbols to JavaScript operators
  // Replaces ÷ with /, × with *, and , with . for proper math evaluation
  // Validates input to prevent code injection and only allows mathematical expressions
  const safeEval = useCallback((expression) => {
    try {
      // Convert calculator symbols to JavaScript mathematical operators
      const sanitized = expression
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/,/g, ".");

      // Security check: only allow numbers, operators, parentheses, and spaces
      if (!/^[\d+\-*/.() ]+$/.test(sanitized)) {
        throw new Error("Invalid expression");
      }

      // Use Function constructor in strict mode for safe evaluation
      return Function(`"use strict"; return (${sanitized})`)();
    } catch {
      return NaN;
    }
  }, []);

  // Main button click handler - processes all calculator button interactions
  const handleButtonClick = useCallback(
    (val) => {
      // Clear All: Reset calculator to initial state
      if (val === "C") {
        setExpression("");
        setScreenNumbers("0");
        setPreviousResult(null);
        return;
      }

      // Equals: Evaluate the current expression and display result
      if (val === "=") {
        if (!expression.trim()) return;

        const result = safeEval(expression);
        // Handle calculation errors (division by zero, invalid operations, etc.)
        if (isNaN(result) || !isFinite(result)) {
          setScreenNumbers("Error");
          setExpression("");
          setPreviousResult(null);
        } else {
          const formattedResult = formatNumber(result);
          setExpression(formattedResult);
          setScreenNumbers(formattedResult);
          setPreviousResult(result);
        }
        return;
      }

      // Backspace: Remove last character or clear if showing result
      if (val === "⌫") {
        // If showing a calculation result, clear everything
        if (previousResult !== null) {
          setExpression("");
          setScreenNumbers("0");
          setPreviousResult(null);
        } else if (expression.length <= 1) {
          // If only one character left, clear to zero
          setExpression("");
          setScreenNumbers("0");
        } else {
          // Remove the last character from expression
          const newExp = expression.slice(0, -1);
          setExpression(newExp);
          setScreenNumbers(newExp || "0");
        }
        return;
      }

      // Clear Entry: Clear current entry (same as Clear All in this implementation)
      if (val === "CE") {
        setExpression("");
        setScreenNumbers("0");
        setPreviousResult(null);
        return;
      }

      // Decimal point handling (using comma as decimal separator)
      if (val === ",") {
        // If showing a result, start new decimal number
        if (previousResult !== null) {
          setExpression("0,");
          setScreenNumbers("0,");
          setPreviousResult(null);
          return;
        }

        // Prevent multiple decimal points in the same number
        const parts = expression.split(/[+\-×÷]/);
        const currentNumber = parts[parts.length - 1];
        if (currentNumber.includes(",")) return;

        // If expression is empty or ends with operator, start with "0,"
        if (!expression || /[+\-×÷]$/.test(expression)) {
          const newExp = expression + "0,";
          setExpression(newExp);
          setScreenNumbers(newExp);
          return;
        }

        // Add decimal point to existing number
        const newExp = expression + ",";
        setExpression(newExp);
        setScreenNumbers(newExp);
        return;
      }

      // Advanced mathematical operations that work on the current screen number
      const mathOps = {
        // Percentage: Convert number to percentage (divide by 100)
        "%": () => {
          const num = parseFloat(screenNumbers);
          return isFinite(num) ? formatNumber(num / 100) : null;
        },
        // Plus/Minus: Toggle sign of current number
        "+/-": () => {
          const num = parseFloat(screenNumbers);
          return isFinite(num) ? formatNumber(-num) : null;
        },
        // Reciprocal: Calculate 1/x (handles division by zero)
        "⅟x": () => {
          const num = parseFloat(screenNumbers);
          if (!isFinite(num) || num === 0) return null;
          return formatNumber(1 / num);
        },
        // Square: Calculate x²
        "x²": () => {
          const num = parseFloat(screenNumbers);
          return isFinite(num) ? formatNumber(num * num) : null;
        },
        // Square root: Calculate √x (handles negative numbers)
        "²√x": () => {
          const num = parseFloat(screenNumbers);
          if (!isFinite(num) || num < 0) return null;
          return formatNumber(Math.sqrt(num));
        },
      };

      // Execute mathematical operation if button matches one
      if (mathOps[val]) {
        const result = mathOps[val]();
        if (result !== null) {
          // Operation successful: update screen and set as new result
          setExpression(result);
          setScreenNumbers(result);
          setPreviousResult(parseFloat(result));
        } else {
          // Operation failed (e.g., division by zero, square root of negative): show error
          setScreenNumbers("Error");
          setExpression("");
          setPreviousResult(null);
        }
        return;
      }

      // Handle number input when showing a calculation result
      if (previousResult !== null && /[0-9]/.test(val)) {
        // Start fresh calculation with the new number
        setExpression(val);
        setScreenNumbers(val);
        setPreviousResult(null);
        return;
      }

      // Handle basic arithmetic operators (+, -, ×, ÷)
      if (["+", "-", "×", "÷"].includes(val)) {
        if (previousResult !== null) {
          // Continue calculation using the previous result
          const newExp = screenNumbers + val;
          setExpression(newExp);
          setScreenNumbers(newExp);
          setPreviousResult(null);
          return;
        }

        // Replace last operator if user presses a different operator consecutively
        const lastChar = expression.slice(-1);
        if (["+", "-", "×", "÷"].includes(lastChar)) {
          const newExp = expression.slice(0, -1) + val;
          setExpression(newExp);
          setScreenNumbers(newExp);
          return;
        }
      }

      // Handle general number and operator input (fallback case)
      // If starting fresh with a number, use just the number; otherwise append to expression
      const newExp =
        expression === "" && /[0-9]/.test(val) ? val : expression + val;
      setExpression(newExp);
      setScreenNumbers(newExp || "0");
      setPreviousResult(null);
    },
    [expression, screenNumbers, previousResult, formatNumber, safeEval]
  );

  // Keyboard event handler for calculator input
  useEffect(() => {
    // Map keyboard keys to calculator button values
    const keyMap = {
      "%": "%", // Percentage
      Escape: "C", // Clear (Escape key)
      Backspace: "⌫", // Backspace
      Enter: "=", // Equals (Enter key)
      "=": "=", // Equals
      "+": "+", // Addition
      "-": "-", // Subtraction
      "*": "×", // Multiplication (asterisk)
      x: "×", // Multiplication (x key)
      X: "×", // Multiplication (X key)
      "/": "÷", // Division
      ",": ",", // Decimal (comma)
      ".": ",", // Decimal (period mapped to comma)
    };

    // Handle keyboard input events
    const handleKeyDown = (event) => {
      const key = event.key;

      // Accept number keys (0-9) or mapped special keys
      if ((key >= "0" && key <= "9") || keyMap[key]) {
        event.preventDefault(); // Prevent default browser behavior
        handleButtonClick(keyMap[key] || key);
      }
    };

    // Add keyboard event listener
    document.addEventListener("keydown", handleKeyDown);
    // Cleanup: remove event listener when component unmounts or dependencies change
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleButtonClick]);

  // Render calculator UI
  return (
    <div className="calculator-container">
      {/* Display screen showing current number or expression */}
      <div className="calculator-screen">{screenNumbers}</div>
      {/* Button grid containing all calculator buttons */}
      <div className="calculator-number">
        {buttonValues.map((val) => (
          <button
            key={val}
            onClick={() => handleButtonClick(val)}
            aria-label={val} // Accessibility label for screen readers
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
