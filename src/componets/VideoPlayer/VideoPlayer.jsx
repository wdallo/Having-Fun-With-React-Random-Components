import { useState, useRef } from "react";
import "./VideoPlayer.css";

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPlayer = () => {
  const videoSrc =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4";
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const percent =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    const time = videoRef.current.currentTime;
    setProgress(percent || 0);
    setCurrentTime(time);
  };

  const handleSeek = (event) => {
    if (!videoRef.current) return;
    const rect = event.target.getBoundingClientRect();
    const seekTime =
      ((event.clientX - rect.left) / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };
  const handleFullScreen = () => {
    if (!containerRef.current) return;
    const isElementFullScreen =
      document.fullscreenElement === containerRef.current ||
      document.webkitFullscreenElement === containerRef.current ||
      document.msFullscreenElement === containerRef.current;

    if (isElementFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } else {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    }
  };

  const handleVolume = (event) => {
    const value = Number(event.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent default context menu
    setModalPosition({ x: event.clientX - 140, y: event.clientY - 140 }); // Add offsets
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="video-player" ref={containerRef}>
      {isLoading && (
        <div className="video-player-loading">
          Video Player is loading
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      )}
      <video
        ref={videoRef}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        style={{ display: isLoading ? "none" : "block" }}
        src={videoSrc}
        onContextMenu={handleRightClick}
        onDoubleClick={handlePlayPause}
      />
      {isPlaying === false && !isLoading && (
        <button
          className="video-player-paused-button"
          onClick={handlePlayPause}
        >
          <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
      )}
      {!isLoading && (
        <div className="video-player-controls">
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="2" />
                <rect x="14" y="4" width="4" height="16" rx="2" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
          <span style={{ color: "#fff", minWidth: 70 }}>
            {formatTime(currentTime)} /{" "}
            {formatTime(videoRef.current?.duration || 0)}
          </span>
          <div className="video-player-progress-bar" onClick={handleSeek}>
            <div
              style={{
                background: "#2196f3",
                width: `${progress}%`,
                height: "100%",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            style={{
              width: 100,
              background: `linear-gradient(to right, #2196f3 ${volume * 100}%, #444 ${volume * 100}%)`,
              borderRadius: "5px",
              height: "6px",
              appearance: "none",
            }}
          />
          <button onClick={handleFullScreen}>
            <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
              <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2zm-10 6H4v-6h2v4h4v2z" />
            </svg>
          </button>
        </div>
      )}
      {isModalVisible && (
        <div
          className="modal"
          style={{
            position: "absolute",
            top: modalPosition.y,
            left: modalPosition.x,
            background: "#333",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            zIndex: 100,
          }}
          onClick={closeModal}
        >
          Simple HTML5 Player{" "}
          <button style={{ marginLeft: 2 }} onClick={closeModal}>
            x
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
