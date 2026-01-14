// React hooks for state management, side effects, and performance optimization
import { useState, useEffect, useMemo, useCallback } from "react";
// Import component-specific styles
import "./Clock.css";

// Configuration constants for better maintainability and easy customization
// All magic numbers are centralized here for easy modification
const CLOCK_CONFIG = {
  UPDATE_INTERVAL: 1000, // Update every 1000ms (1 second)
  DEGREES_PER_SECOND: 6, // 360 degrees / 60 seconds = 6 degrees per second
  DEGREES_PER_MINUTE: 6, // 360 degrees / 60 minutes = 6 degrees per minute
  DEGREES_PER_HOUR: 30, // 360 degrees / 12 hours = 30 degrees per hour
  MINUTE_SMOOTH_FACTOR: 0.1, // Smooth minute hand movement (6 degrees / 60 seconds)
  HOUR_SMOOTH_FACTOR: 0.5, // Smooth hour hand movement (30 degrees / 60 minutes)
  HOUR_NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Numbers displayed on clock face
  TICK_COUNT: 60, // Total number of minute/second tick marks
  NUMBER_RADIUS: 74, // Distance of numbers from center (in pixels)
  TICK_RADIUS: 92, // Distance of tick marks from center (in pixels)
};

/**
 * Analog Clock Component
 *
 * @returns {JSX.Element} Rendered analog clock component
 */
const Clock = () => {
  // State to hold current time - updates every second
  const [time, setTime] = useState(new Date());

  // Memoized time update function to prevent unnecessary re-creations
  // useCallback ensures the function reference remains stable across re-renders
  const updateTime = useCallback(() => {
    setTime(new Date());
  }, []); // Empty dependency array - function never changes

  // Effect hook to set up interval for time updates
  // Runs once on component mount, cleans up on unmount
  useEffect(() => {
    const timer = setInterval(updateTime, CLOCK_CONFIG.UPDATE_INTERVAL);
    // Cleanup function to prevent memory leaks
    return () => clearInterval(timer);
  }, [updateTime]); // Depends on updateTime callback

  // Memoized angle calculations for performance optimization
  // Only recalculates when time changes, preventing unnecessary computations
  const angles = useMemo(() => {
    const seconds = time.getSeconds(); // 0-59
    const minutes = time.getMinutes(); // 0-59
    const hours = time.getHours(); // 0-23

    return {
      // Second hand: moves 6 degrees per second (360° / 60 seconds)
      second: seconds * CLOCK_CONFIG.DEGREES_PER_SECOND,

      // Minute hand: base position + smooth movement based on seconds
      // Moves 6 degrees per minute + fractional movement for smooth animation
      minute:
        minutes * CLOCK_CONFIG.DEGREES_PER_MINUTE +
        seconds * CLOCK_CONFIG.MINUTE_SMOOTH_FACTOR,

      // Hour hand: base position (12-hour format) + smooth movement based on minutes
      // Moves 30 degrees per hour + fractional movement for smooth animation
      hour:
        (hours % 12) * CLOCK_CONFIG.DEGREES_PER_HOUR +
        minutes * CLOCK_CONFIG.HOUR_SMOOTH_FACTOR,
    };
  }, [time]); // Recalculate only when time changes

  // Memoized hour numbers generation to prevent unnecessary re-renders
  // Empty dependency array means this only calculates once on component mount
  const hourNumbers = useMemo(
    () =>
      CLOCK_CONFIG.HOUR_NUMBERS.map((num, idx) => {
        // Calculate angle for each number position (1-12 around the circle)
        const angle = ((idx + 1) / 12) * 360;
        return (
          <div
            key={num}
            className="clock-number"
            style={{
              // Complex transform for positioning numbers around clock face:
              // 1. Move to center with translate(-50%, -50%)
              // 2. Rotate to the correct angle
              // 3. Move outward to the number radius
              // 4. Counter-rotate to keep text upright
              transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${CLOCK_CONFIG.NUMBER_RADIUS}px) rotate(-${angle}deg)`,
            }}
            aria-label={`${num} o'clock position`} // Accessibility label
          >
            {num}
          </div>
        );
      }),
    [] // Empty dependency - static content that never changes
  );

  // Memoized tick marks generation for minute/second indicators
  // Creates 60 tick marks around the clock face (one for each minute/second)
  const tickMarks = useMemo(
    () =>
      Array.from({ length: CLOCK_CONFIG.TICK_COUNT }, (_, idx) => {
        // Calculate angle for each tick mark (6 degrees apart)
        const angle = idx * CLOCK_CONFIG.DEGREES_PER_SECOND;
        // Every 5th tick mark is an hour mark (at 12, 1, 2, etc.)
        const isHourMark = idx % 5 === 0;
        return (
          <div
            key={`tick-${idx}`}
            className={`clock-tick${isHourMark ? " hour-mark" : ""}`} // Different styling for hour marks
            style={{
              // Position tick marks around the clock face at the specified radius
              transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${CLOCK_CONFIG.TICK_RADIUS}px)`,
            }}
            aria-hidden="true" // Hide from screen readers (decorative only)
          />
        );
      }),
    [] // Empty dependency - static content that never changes
  );

  // Format current time for accessibility (screen readers)
  const accessibleTime = time.toLocaleTimeString();

  return (
    <div
      className="clock-container"
      role="img" // Semantic role for screen readers
      aria-label={`Analog clock showing ${accessibleTime}`} // Descriptive label
    >
      <div className="clock-circle">
        {/* Hour numbers (1-12) positioned around clock face */}
        {hourNumbers}

        {/* Minute/second tick marks with hour marks differentiated */}
        {tickMarks}

        {/* Clock hands - positioned using CSS transforms and rotation */}
        {/* Center dot - visual anchor point for all hands */}
        <div className="clock-middle" aria-hidden="true" />

        {/* Hour hand - shortest, thickest hand */}
        <div
          className="clock-hand clock-hour-hand"
          style={{ transform: `translateX(-50%) rotate(${angles.hour}deg)` }}
          aria-label="Hour hand"
        />

        {/* Minute hand - medium length hand */}
        <div
          className="clock-hand clock-minute-hand"
          style={{ transform: `translateX(-50%) rotate(${angles.minute}deg)` }}
          aria-label="Minute hand"
        />

        {/* Second hand - longest, thinnest hand with distinct color */}
        <div
          className="clock-hand clock-second-hand"
          style={{ transform: `translateX(-50%) rotate(${angles.second}deg)` }}
          aria-label="Second hand"
        />
      </div>

      {/* Hidden time display for screen readers - updates live */}
      <div className="sr-only" aria-live="polite">
        Current time: {accessibleTime}
      </div>
    </div>
  );
};

export default Clock;
