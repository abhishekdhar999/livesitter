import React, { useState, useRef } from 'react';

function LivestreamPlayer() {
  const [isPlaying, setIsPlaying] = useState(true); // State to manage play/pause
  const [volume, setVolume] = useState(1); // State to manage volume (for potential future use)
  const videoRef = useRef(null); // Ref to control the video stream element

  // Function to play the stream
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Function to pause the stream
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Function to adjust volume (currently not used because MJPEG stream doesn't support native volume control)
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume; // Doesn't work directly on MJPEG stream but left for future enhancement
    }
  };

  return (
    <div>
      <h1>RTSP Stream with Controls</h1>

      {/* Conditionally render the image stream based on the playing state */}
      {isPlaying ? (
        <img
          ref={videoRef}
          src="http://127.0.0.1:5001/video_feed"
          alt="RTSP Stream"
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        <div style={{ width: '100%', height: 'auto', background: '#000' }}>
          <p style={{ color: '#fff' }}>Stream Paused</p>
        </div>
      )}

      {/* Control buttons for Play, Pause */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePlay} disabled={isPlaying} style={{ marginRight: '10px' }}>
          Play
        </button>
        <button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </button>
      </div>

      {/* Volume control (not directly applicable but included for future use) */}
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="volumeControl">Volume: </label>
        <input
          id="volumeControl"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </div>
  );
}

export default LivestreamPlayer;
