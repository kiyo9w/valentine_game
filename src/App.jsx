import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './components/LandingPage'
import TicTacToe from './components/TicTacToe'
import MessageRevealScene from './components/MessageRevealScene'
import FinalScene from './components/FinalScene'
import GameOverScene from './components/GameOverScene'
import TikTokModal from './components/TikTokModal'
import MusicPlayer from './components/MusicPlayer'
import '@fontsource/quicksand'
import './App.css'
import { playWinSound, playLoseSound, playClickSound } from './utils/sounds'

// Import songs
import song1 from './assets/songs/song1.mp3'
import song2 from './assets/songs/song2.mp3'
import song3 from './assets/songs/song3.mp3'
import song4 from './assets/songs/song4.mp3'

const songData = {
  landing: {
    url: song1,
    title: "Phonecert (폰서트)",
    artist: "10CM (십센치) x Hoàng Dũng",
  },
  game: {
    url: song1, // Same as landing
    title: "Phonecert (폰서트)",
    artist: "10CM (십센치) x Hoàng Dũng",
  },
  message: {
    url: song2,
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
  },
  final: {
    url: song3,
    title: "Chăm hoa",
    artist: "Mono",
  },
  goodbye: {
    url: song4,
    title: "Vẫn Đợi",
    artist: "Wxrdie",
  }
}

function App() {
  const [currentScene, setCurrentScene] = useState('landing')
  const [winCount, setWinCount] = useState(0)
  const [showTikTok, setShowTikTok] = useState(false)
  const [currentTikTok, setCurrentTikTok] = useState('')
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)
  const previousTimeRef = useRef(0)

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio(songData[currentScene].url)
    audioRef.current.volume = volume
    audioRef.current.loop = true
    
    if (isPlaying) {
      audioRef.current.play()
    }

    return () => {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  // Handle scene changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    audioRef.current = new Audio(songData[currentScene].url)
    audioRef.current.volume = volume
    audioRef.current.loop = true
    
    if (isPlaying && !showTikTok) {
      audioRef.current.play()
    }
  }, [currentScene])

  // Handle TikTok modal
  useEffect(() => {
    if (!audioRef.current) return

    if (showTikTok) {
      previousTimeRef.current = audioRef.current.currentTime
      audioRef.current.pause()
    } else if (isPlaying) {
      audioRef.current.currentTime = previousTimeRef.current
      audioRef.current.play()
    }
  }, [showTikTok])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const tikTokVideos = [
    '7445110650432490760',
    '7441382780476378386',
    '7443330195928468743'
  ]

  const handleStartGame = () => {
    playClickSound()
    setCurrentScene('game')
  }

  const handleWin = () => {
    const newWinCount = winCount + 1
    setWinCount(newWinCount)
    playWinSound()
    
    // Show TikTok video based on win count (0-based index)
    setCurrentTikTok(tikTokVideos[newWinCount - 1])
    setShowTikTok(true)
  }

  const handleTikTokClose = () => {
    setShowTikTok(false)
    
    // If this was the third win, proceed to message scene
    if (winCount >= 3) {
      setTimeout(() => {
        setCurrentScene('message')
      }, 500)
    } else {
      // Otherwise, reset the game board for next round
      setCurrentScene('landing')
      setTimeout(() => {
        setCurrentScene('game')
      }, 0)
    }
  }

  const handleMessageComplete = () => {
    setCurrentScene('final')
  }

  const handleGameOver = () => {
    playLoseSound()
    setCurrentScene('goodbye')
    // Reset win count when game is over
    setWinCount(0)
  }

  const handleRetryFromGameOver = () => {
    playClickSound()
    setCurrentScene('game')
  }

  return (
    <div className="app">
      <MusicPlayer 
        currentSong={songData[currentScene]}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
        onPlayPause={() => {
          if (isPlaying) {
            audioRef.current?.pause()
          } else {
            audioRef.current?.play()
          }
          setIsPlaying(!isPlaying)
        }}
      />
      
      <main className="app-container">
        <AnimatePresence mode="wait">
          {currentScene === 'landing' && (
            <LandingPage onStart={handleStartGame} />
          )}
          {currentScene === 'game' && (
            <div className="game-scene">
              <div className="win-counter">Thắng: {winCount}/3</div>
              <TicTacToe 
                key={winCount} // Force remount on win count change
                onWin={handleWin} 
                onGameOver={handleGameOver} 
              />
            </div>
          )}
          {currentScene === 'message' && (
            <MessageRevealScene onComplete={handleMessageComplete} />
          )}
          {currentScene === 'final' && (
            <FinalScene onGameOver={handleGameOver} />
          )}
          {currentScene === 'goodbye' && (
            <GameOverScene onRetry={handleRetryFromGameOver} />
          )}
        </AnimatePresence>

        <TikTokModal 
          isOpen={showTikTok}
          onClose={handleTikTokClose}
          videoId={currentTikTok}
        />
      </main>
    </div>
  )
}

export default App 