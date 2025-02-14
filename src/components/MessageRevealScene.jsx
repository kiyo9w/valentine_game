import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import paperBg from '../assets/paper.png'
import paperBall from '../assets/paper_ball.png'
import '../styles/MessageRevealScene.css'

const messages = [
  "Hey, t đã suy nghĩ rất nhiều trước khi viết ra điều này...",
  "T muốn bắt đầu bằng 1 lời xin lỗi. T đọc qua những post cũ của cậu và t thật sự hối hận. T xin lỗi vì t đã từng là 1 thg tồi ntn.",
  "T tôn trọng và ngưỡng mộ hành trình của cậu. Và t biết cậu đã nỗ lực ntn để đạt được điều đó. Những posts mà cậu dã share, dù direct hoặc indirect, làm t thay đổi khá nhiều trong nhận thức, cảm ơn vì điều đó.",
  "Hi vọng t k làm cậu phiền, hoặc cản chân cậu, hoặc cho cậu những cảm giác không đáng có. Những tương tác gần đây ít nhiều cho t cảm giác an tâm hơn chút. Nhma nếu 1 ngày cậu thấy k phù hợp thì cứ bảo t, mọi chuyện sẽ trở lại như chưa từng xảy ra.",
  "Dù t biết cậu chưa sẵn sàng để đặt niềm tin vào t ngay bây giờ, nhưng t sẽ chờ đợi ngày mà cảm xúc của t được đáp lại, ngày t sẽ k cho cậu nghi ngờ :)",
  "Thế nhé, nói nhiều quá mất ngầu. Just tryin to lay my thoughts out here :)❤️",
]

const FloatingHearts = () => (
  <div className="floating-hearts">
    {[...Array(15)].map((_, i) => (
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
        {['❤️', '💝', '💖', '💗', '✨'][Math.floor(Math.random() * 5)]}
      </motion.div>
    ))}
  </div>
)

const Message = ({ text, index }) => (
  <motion.p 
    className="message-text"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.5 }}
    style={{ fontFamily: 'OoohBaby, cursive' }}
  >
    {text}
  </motion.p>
)

const MessageRevealScene = ({ onComplete }) => {
  const [showInitialPrompt, setShowInitialPrompt] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isCrumpled, setIsCrumpled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [throwForce, setThrowForce] = useState({ x: 0, y: 0 })

  const handleInitialResponse = (accepted) => {
    if (accepted) {
      setShowInitialPrompt(false)
    } else {
      onComplete()
    }
  }

  const handlePaperClick = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setIsCrumpled(true)
    
    // Random throw direction and force
    const direction = Math.random() > 0.5 ? 1 : -1
    const force = 0.5 + Math.random() * 0.5 // 0.5 to 1.0
    setThrowForce({
      x: direction * (window.innerWidth * force),
      y: -window.innerHeight * 0.3 * force
    })

    // Faster crumple and throw animation
    setTimeout(() => {
      setIsCrumpled(false)
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1)
      } else {
        onComplete()
      }
      setIsTransitioning(false)
    }, 800) // Reduced from 1500ms to 800ms
  }

  return (
    <motion.div 
      className="message-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {showInitialPrompt ? (
          <motion.div 
            className="initial-prompt"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2>T có vài điều muốn nói 💝</h2>
            <div className="button-container">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInitialResponse(true)}
              >
                Nghe! 💖
              </motion.button>
              <motion.button
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInitialResponse(false)}
              >
                Không, cảm ơn
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={currentMessageIndex}
            className={`message-container ${isCrumpled ? 'crumpled' : ''}`}
            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotate: isCrumpled ? [0, Math.random() * 360 - 180] : 0,
              x: isCrumpled ? [0, throwForce.x] : 0,
              y: isCrumpled ? [0, throwForce.y] : 0
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: isCrumpled ? 0.5 : 0.3, // Faster animation
              ease: "backOut"
            }}
            onClick={handlePaperClick}
            style={{
              backgroundImage: isCrumpled ? `url(${paperBall})` : `url(${paperBg})`
            }}
          >
            {!isCrumpled && (
              <motion.div 
                className="message-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Message text={messages[currentMessageIndex]} index={currentMessageIndex} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!showInitialPrompt && (
        <div className="progress-dots">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`dot ${index === currentMessageIndex ? 'active' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default MessageRevealScene 