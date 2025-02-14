import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/MusicPlayer.css'

// Import your songs
import song1 from '../assets/songs/song1.mp3'
import song2 from '../assets/songs/song2.mp3'
import song3 from '../assets/songs/song3.mp3'
import song4 from '../assets/songs/song4.mp3'

const songData = {
  landing: {
    url: song1,
    title: "Chuyện Đôi Ta",
    artist: "Emcee L (Da LAB) ft Muộii",
  },
  message: {
    url: song2,
    title: "Nếu Lúc Đó",
    artist: "tlinh ft 2pillz",
  },
  final: {
    url: song3,
    title: "Có Em",
    artist: "Madihu ft LowG",
  },
  gameover: {
    url: song4,
    title: "Yêu Đừng Sợ Đau",
    artist: "Ngô Lan Hương",
  }
}

const MusicPlayer = ({ 
  currentSong, 
  isPlaying, 
  volume, 
  setVolume,
  onPlayPause 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  return (
    <div className="music-player-container">
      <motion.div 
        className="cd-disc"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cd-inner" />
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="player-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="song-info">
              <h3>{currentSong.title}</h3>
              <p>{currentSong.artist}</p>
            </div>

            <div className="controls">
              <button 
                className="play-button"
                onClick={onPlayPause}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <div className="volume-control">
                <span>🔈</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MusicPlayer 