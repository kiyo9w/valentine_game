import { motion, AnimatePresence } from 'framer-motion'
import '../styles/TikTokModal.css'

const TikTokModal = ({ isOpen, onClose, videoId }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="tiktok-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="tiktok-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="tiktok-container">
            <blockquote 
              className="tiktok-embed" 
              cite={`https://www.tiktok.com/@username/video/${videoId}`}
              data-video-id={videoId}
            >
              <iframe
                src={`https://www.tiktok.com/embed/${videoId}`}
                style={{ width: '100%', height: '500px' }}
                allowFullScreen
              />
            </blockquote>
          </div>
          
          <motion.button
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Tiếp Tục Chơi
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TikTokModal 