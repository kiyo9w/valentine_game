import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/GameOverScene.css'
import goodbye1 from '../assets/goodbye1.gif'
import goodbye2 from '../assets/goodbye2.gif'
import goodbye3 from '../assets/goodbye3.gif'
import goodbye4 from '../assets/goodbye4.gif'
import goodbye5 from '../assets/goodbye5.gif'

const goodbyeImages = [
  goodbye1,
  goodbye2,
  goodbye3,
  goodbye4,
  goodbye5
]

const FloatingHearts = () => (
  <div className="floating-broken-hearts">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="broken-heart"
        initial={{ y: Math.random() * window.innerHeight }}
        animate={{ 
          y: [-20, window.innerHeight + 20],
          x: Math.sin(i) * 40,
          rotate: Math.random() * 360
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.3
        }}
      >
        💔
      </motion.div>
    ))}
  </div>
)

const GameOverScene = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [usedIndices, setUsedIndices] = useState([])
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Initialize with a random image
    const firstIndex = Math.floor(Math.random() * goodbyeImages.length)
    setCurrentImageIndex(firstIndex)
    setUsedIndices([firstIndex])
  }, [])

  const handleImageClick = () => {
    if (isChanging) return
    setIsChanging(true)

    let nextIndex
    if (usedIndices.length >= goodbyeImages.length) {
      nextIndex = Math.floor(Math.random() * goodbyeImages.length)
      setUsedIndices([nextIndex])
    } else {
      // Find an unused index
      do {
        nextIndex = Math.floor(Math.random() * goodbyeImages.length)
      } while (usedIndices.includes(nextIndex))
      setUsedIndices(prev => [...prev, nextIndex])
    }
    
    setCurrentImageIndex(nextIndex)
    setTimeout(() => setIsChanging(false), 500)
  }

  return (
    <motion.div 
      className="game-over-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingHearts />
      
      <motion.div 
        className="sad-message"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1>Tạm biệt... 😢</h1>
        <p>Maybe next time...</p>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            className="goodbye-gif"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleImageClick}
          >
            <motion.img
              src={goodbyeImages[currentImageIndex]}
              alt="Waving goodbye"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.div 
              className="image-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default GameOverScene 