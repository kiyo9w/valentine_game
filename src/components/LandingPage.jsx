import { motion } from 'framer-motion'
import '@fontsource/press-start-2p'
import '../styles/LandingPage.css'

const FloatingHearts = () => (
  <div className="floating-hearts">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="heart"
        initial={{ y: Math.random() * window.innerHeight }}
        animate={{ 
          y: [-20, window.innerHeight + 20],
          x: Math.sin(i) * 40
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.3
        }}
      >
        {['❤️', '💝', '💖', '💗'][Math.floor(Math.random() * 4)]}
      </motion.div>
    ))}
  </div>
)

const LandingPage = ({ onStart }) => {
  return (
    <motion.div 
      className="landing-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingHearts />
      
      <motion.div 
        className="game-window"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        <div className="window-header">
          <div className="window-controls">
            <span className="control red"></span>
            <span className="control yellow"></span>
            <span className="control green"></span>
          </div>
          <h1 className="game-title">Tic Tac Toe</h1>
        </div>
        
        <div className="window-content">
          <p className="subtitle">A Valentine's Special</p>
          <motion.button 
            className="start-button"
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bắt Đầu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LandingPage 