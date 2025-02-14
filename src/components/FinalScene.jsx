import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import bigBouquet1 from '../assets/big_bouquet1.png'
import bigBouquet2 from '../assets/big_bouquet2.png'
import bigBouquet3 from '../assets/big_bouquet3.png'
import bigBouquet4 from '../assets/big_bouquet4.png'
import bigBouquet5 from '../assets/big_bouquet5.png'
import cat1 from '../assets/cat1.png'
import cat2 from '../assets/cat2.png'
import piano from '../assets/piano.png'
import teddyBear from '../assets/teddy_bear.png'
import '../styles/FinalScene.css'

// Import all petals
const petalImages = Array.from({ length: 6 }, (_, i) => 
  `/src/assets/petals/petals_${i + 1}.png`
)

const FloatingPetal = ({ image, delay }) => {
  const direction = Math.random() > 0.5 ? 1 : -1
  const angle = Math.random() * 180 - 90
  const distance = Math.random() * 300 + 200

  return (
    <motion.img
      src={image}
      className="floating-petal"
      initial={{ 
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0,
        rotate: 0
      }}
      animate={{ 
        opacity: [0, 1, 1, 0.8, 0],
        scale: [0.3, 1.2, 1, 0.8, 0.6],
        x: [0, direction * distance * Math.cos(angle * Math.PI/180)],
        y: [0, -100, distance * Math.sin(angle * Math.PI/180)], // First go up, then follow angle
        rotate: [0, direction * (Math.random() * 720 + 360)]
      }}
      transition={{
        duration: 3,
        delay,
        times: [0, 0.2, 0.4, 0.8, 1],
        ease: "easeOut"
      }}
    />
  )
}

const SurpriseObject = ({ type, delay = 0 }) => {
  const getInitialPosition = () => ({
    x: 0,
    y: 0,
    scale: type === 'piano' ? 0.5 : 0.8,
    rotate: 0
  })

  const getFinalPosition = () => {
    const direction = Math.random() > 0.5 ? 1 : -1
    return {
      x: direction * (Math.random() * 800 + 400),
      y: -window.innerHeight,
      scale: type === 'piano' ? 1.5 : 1,
      rotate: direction * (Math.random() * 1080 + 720)
    }
  }

  return (
    <motion.img
      src={type === 'piano' ? piano : type === 'cat1' ? cat1 : cat2}
      className={`surprise-object ${type}`}
      initial={getInitialPosition()}
      animate={{
        ...getFinalPosition(),
        opacity: [0, 1, 1, 0.8, 0]
      }}
      transition={{
        duration: 4.5,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
        opacity: { duration: 4.5, times: [0, 0.2, 0.8, 0.9, 1] }
      }}
    />
  )
}

const SparkleEffect = () => (
  <div className="sparkle-container">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className="sparkle"
        style={{
          animationDelay: `${Math.random() * 2}s`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
)

const InitialBouquetSelector = ({ onSelect }) => {
  const bouquets = [bigBouquet1, bigBouquet2, bigBouquet3, bigBouquet4, bigBouquet5]

  return (
    <motion.div 
      className="initial-bouquet-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="selection-title">Chọn một bó hoa phù hợp với cậu 🌸</h2>
      <div className="initial-bouquet-grid">
        {bouquets.map((bouquet, index) => (
          <motion.div
            key={index}
            className="initial-bouquet-option"
            onClick={() => onSelect(bouquet)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={bouquet} alt={`Bouquet ${index + 1}`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const BouquetDropdownSelector = ({ onSelect, selectedBouquet }) => {
  const [isOpen, setIsOpen] = useState(false)
  const bouquets = [bigBouquet1, bigBouquet2, bigBouquet3, bigBouquet4, bigBouquet5]
  const selectorRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bouquet-dropdown" ref={selectorRef}>
      <motion.button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={selectedBouquet} alt="Current bouquet" />
        <span>Đổi bó hoa 🌸</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown-content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bouquet-list">
              {bouquets.map((bouquet, index) => (
                <motion.div
                  key={index}
                  className={`dropdown-option ${selectedBouquet === bouquet ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(bouquet)
                    setIsOpen(false)
                  }}
                  whileHover={{ x: 5 }}
                >
                  <img src={bouquet} alt={`Bouquet ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FeedbackForm = ({ onClose, onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedbackText);
  };

  return (
    <motion.div 
      className="feedback-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2>Feedbacks cho chủ website 💭</h2>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Quắn quéo quá k quen... / Chủ website đẹp trai quá... / Muốn đấm chủ website quá (chủ website xloi)
        
PS: do chủ website k chạy kịp dl nên tính năng này chưa sử dụng đc, xin hãy gửi tâm thư của người dùng qua đây. Xin cảm ơn (Bấm gửi để hiện pop up copy link)"
      />
      <div className="form-buttons">
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Gửi phản hồi 💌
        </motion.button>
        <motion.button
          className="secondary"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Đóng
        </motion.button>
      </div>
    </motion.div>
  );
}

const AllBouquetsDisplay = ({ bouquets, onBack }) => (
  <motion.div 
    className="all-bouquets-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.button
      className="back-button"
      onClick={onBack}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      ← Back
    </motion.button>

    <h2>Chắc hẳn cậu rất thích hoa 🌸</h2>
    <div className="bouquet-showcase">
      {Array.from(new Set(bouquets)).map((bouquet, index) => (
        <motion.div
          key={index}
          className="showcase-item"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            delay: index * 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          <img src={bouquet} alt={`Bouquet ${index + 1}`} />
        </motion.div>
      ))}
    </div>
  </motion.div>
)

const FinalScene = ({ onGameOver }) => {
  const [selectedBouquet, setSelectedBouquet] = useState(null)
  const [bouquetHistory, setBouquetHistory] = useState([])
  const [showAllBouquets, setShowAllBouquets] = useState(false)
  const [hasInitialSelection, setHasInitialSelection] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [unravelCount, setUnravelCount] = useState(0)
  const [showHugModal, setShowHugModal] = useState(false)
  const [hugSent, setHugSent] = useState(false)
  const [petals, setPetals] = useState([])
  const [surpriseObject, setSurpriseObject] = useState(null)
  const [feedbackUnravelCount, setFeedbackUnravelCount] = useState(0)
  const [showFeedbackButton, setShowFeedbackButton] = useState(false)

  const spawnPetals = () => {
    const numPetals = Math.floor(Math.random() * 3) + 4 // 4-6 petals
    const newPetals = Array.from({ length: numPetals }, (_, i) => ({
      id: Date.now() + i,
      image: petalImages[Math.floor(Math.random() * petalImages.length)],
      delay: i * 0.15
    }))
    setPetals(prev => [...prev, ...newPetals])
  }

  const handleSurpriseEffect = (count) => {
    const surpriseObjects = ['cat1', 'cat2', 'piano']
    switch(count) {
      case 3:
        setSurpriseObject([{
          type: surpriseObjects[0],
          id: Date.now(),
          delay: 0
        }])
        break
      case 4:
        setSurpriseObject([{
          type: surpriseObjects[1],
          id: Date.now(),
          delay: 0
        }])
        break
      case 5:
        setSurpriseObject([{
          type: surpriseObjects[2],
          id: Date.now(),
          delay: 0
        }])
        break
      default:
        break
    }
  }

  const handleBouquetSelect = (bouquet) => {
    setSelectedBouquet(bouquet)
    if (!bouquetHistory.includes(bouquet)) {
      setBouquetHistory(prev => [...prev, bouquet])
    }
    setHasInitialSelection(true)
    
    // Check for easter egg - must have selected all 5 different bouquets
    const uniqueBouquets = new Set([...bouquetHistory, bouquet])
    if (uniqueBouquets.size === 5) {
      setShowAllBouquets(true)
    }
  }

  const handleBouquetClick = () => {
    if (unravelCount < 5) {
      spawnPetals()
      handleSurpriseEffect(unravelCount + 1)
      setUnravelCount(prev => prev + 1)
      
      if (unravelCount === 4) {
        setTimeout(() => setShowHugModal(true), 2000)
      }
    }
  }

  useEffect(() => {
    if (petals.length > 0) {
      const timer = setTimeout(() => {
        setPetals(prev => prev.slice(1))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [petals])

  const handleHugSent = () => {
    setShowHugModal(false)
    setHugSent(true)
    spawnPetals()
  }

  const handleFeedbackClose = (submitted) => {
    setShowFeedback(false)
    if (submitted) {
      // Show thank you message
      setTimeout(() => {
        setShowThankYou(true)
      }, 500)
    }
  }

  const handleBackFromShowcase = () => {
    setShowAllBouquets(false)
  }

  const handleFeedbackUnravel = () => {
    if (feedbackUnravelCount < 5) {
      spawnPetals()
      setFeedbackUnravelCount(prev => prev + 1)
      
      // Show feedback button after 5 clicks
      if (feedbackUnravelCount === 3) { // Changed from 4 to show button earlier
        setShowFeedbackButton(true)
      }
    }
  }

  const handleFeedbackSubmit = (feedbackText) => {
    const form = document.querySelector('form[name="feedbackForm"]');
    if (form) {
      // Update all form fields
      const bouquetInput = form.querySelector('input[name="bouquet"]');
      const hugInput = form.querySelector('input[name="hugSent"]');
      const feedbackInput = form.querySelector('textarea[name="feedback"]');
      const timestampInput = form.querySelector('input[name="timestamp"]');
      const unravelCountInput = form.querySelector('input[name="unravelCount"]');
      
      if (bouquetInput) bouquetInput.value = selectedBouquet;
      if (hugInput) hugInput.value = hugSent ? 'Yes' : 'No';
      if (feedbackInput) feedbackInput.value = feedbackText;
      if (timestampInput) timestampInput.value = new Date().toISOString();
      if (unravelCountInput) unravelCountInput.value = unravelCount.toString();

      // Submit the form
      form.submit();
      setShowFeedback(false);
      
      // Show success message
      alert('Cảm ơn đã phản hồi! 💝 https://docs.google.com/document/d/1LGSVlin_GDynbdjrxxG0J_irPJqKdbI3R0dyJGtP0Vg/edit?usp=sharing');
    }
  };

  return (
    <motion.div className="final-scene">
      {!showAllBouquets ? (
        <motion.div className="bouquet-container">
          {!hasInitialSelection ? (
            <InitialBouquetSelector onSelect={handleBouquetSelect} />
          ) : (
            <>
              <BouquetDropdownSelector 
                onSelect={handleBouquetSelect}
                selectedBouquet={selectedBouquet}
              />
              <img 
                src={selectedBouquet} 
                alt="Flower Bouquet" 
                className="bouquet-image"
                onClick={handleBouquetClick}
              />
              
              {unravelCount < 5 && (
                <>
                  <motion.div 
                    className="unravel-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    ↑
                  </motion.div>
                </>
              )}

              {unravelCount < 5 && <SparkleEffect />}

              <AnimatePresence>
                {petals.map(petal => (
                  <FloatingPetal 
                    key={petal.id}
                    image={petal.image}
                    delay={petal.delay}
                  />
                ))}
                {surpriseObject && surpriseObject.map(obj => (
                  <SurpriseObject 
                    key={obj.id}
                    type={obj.type}
                    delay={obj.delay}
                  />
                ))}
              </AnimatePresence>

              {unravelCount >= 5 && (
                <motion.div 
                  className="center-emoji"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  🤗
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      ) : (
        <AllBouquetsDisplay 
          bouquets={Array.from(new Set(bouquetHistory))}
          onBack={handleBackFromShowcase}
        />
      )}

      <AnimatePresence>
        {showHugModal && (
          <motion.div 
            className="hug-modal"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
          >
            <p>Send a virtual hug?</p>
            <div className="modal-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHugSent}
              >
                Có, gửi ôm! 🤗
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGameOver}
                className="secondary"
              >
                Chưa phải lúc
              </motion.button>
            </div>
          </motion.div>
        )}

        {hugSent && (
          <motion.div
            className="hug-sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={handleFeedbackUnravel}
          >
            <motion.img
              src={teddyBear}
              className="teddy-bear"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <h2>Ôm đã được gửi! 🤗</h2>
            <p>Cảm ơn cậu đã chơi!</p>
            
            {/* Add arrow indicator when feedback unravel is available */}
            {feedbackUnravelCount < 5 && (
              <>
                <motion.div 
                  className="hug-unravel-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ↑
                </motion.div>
              </>
            )}
            
            {feedbackUnravelCount < 5 && <SparkleEffect />}
            {showFeedbackButton && (
              <motion.button
                className="feedback-button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeedback(true)}
              >
                Gửi phản hồi 💌
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Netlify Form - Updated with more fields */}
      <form 
        name="feedbackForm" 
        method="POST" 
        data-netlify="true" 
        netlify-honeypot="bot-field" 
        hidden
      >
        <input type="hidden" name="form-name" value="feedbackForm" />
        <input type="hidden" name="bot-field" />
        <input type="text" name="bouquet" />
        <input type="text" name="hugSent" />
        <input type="text" name="timestamp" />
        <input type="text" name="unravelCount" />
        <textarea name="feedback"></textarea>
      </form>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackForm onClose={handleFeedbackClose} onSubmit={handleFeedbackSubmit} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FinalScene 