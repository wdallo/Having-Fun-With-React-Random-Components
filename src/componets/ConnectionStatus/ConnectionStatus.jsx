import { useState, useEffect, useRef, useCallback } from "react";
import "./ConnectionStatus.css";

const HIDE_DELAY = 2000; // Time to hide the online message after reconnecting (ms)
const MESSAGES = {
  OFFLINE: "Internet connection lost!",
  ONLINE: "Internet Connection - Back online!",
};

function ConnectionStatus() {
  // State to track if the user is online
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  // State to control visibility of the status message
  const [showStatus, setShowStatus] = useState(false);
  // State to store the current message to display
  const [message, setMessage] = useState("");
  // Ref to store the timeout ID for hiding the message
  const timeoutRef = useRef(null);
  // Ref to track if the user was previously offline
  const wasOfflineRef = useRef(false);

  // Utility function to clear any existing hide timeout
  const clearHideTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Function to update the connection status and message
  const updateStatus = useCallback(
    (online) => {
      setIsOnline(online);
      clearHideTimeout();

      if (!online) {
        // User went offline
        setMessage(MESSAGES.OFFLINE);
        setShowStatus(true);
        wasOfflineRef.current = true;
      } else if (wasOfflineRef.current) {
        // User came back online after being offline
        setMessage(MESSAGES.ONLINE);
        setShowStatus(true);
        // Hide the message after a delay
        timeoutRef.current = setTimeout(() => {
          setShowStatus(false);
          wasOfflineRef.current = false;
        }, HIDE_DELAY);
      } else {
        // User is online and was not previously offline
        setShowStatus(false);
      }
    },
    [clearHideTimeout],
  );

  // Effect to set up event listeners for online/offline events
  useEffect(() => {
    const handleOnline = () => updateStatus(true);
    const handleOffline = () => updateStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check on mount
    updateStatus(navigator.onLine);

    // Cleanup event listeners and timeout on unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearHideTimeout();
    };
  }, [updateStatus, clearHideTimeout]);

  // Don't render anything if the status message shouldn't be shown
  if (!showStatus) return null;

  return (
    <div
      className={`connection-status ${isOnline ? "online" : "offline"}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default ConnectionStatus;
