import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/TicTacToe.css'

const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF69B4">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const BowIcon = () => (
  <div style={{ 
    fontSize: '32px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    😺
  </div>
)

const GameOverDialog = ({ onRetry, onGameOver, result }) => (
  <motion.div 
    className="game-over-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="game-over-dialog"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="dialog-content">
        <motion.div 
          className="dialog-emoji"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {result === 'lose' ? '😿' : '🤝'}
        </motion.div>
        <h2>{result === 'lose' ? 'Con Mèo đã thắng cậu!' : 'Hòa!'}</h2>
        <p className="dialog-subtitle">
          {result === 'lose' ? 'Đừng bỏ cuộc vội!' : 'Gần được rồi! Thử lại không?'}
        </p>
      </div>
      <div className="dialog-buttons">
        <motion.button
          className="dialog-button continue-button"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Thử Lại
        </motion.button>
        <motion.button
          className="dialog-button exit-button"
          onClick={onGameOver}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Từ Bỏ
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
)

const TicTacToe = ({ onWin, onGameOver }) => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine(line)
        return squares[a]
      }
    }

    if (squares.every(square => square !== null)) {
      return 'tie'
    }
    return null
  }

  const getAIMove = (currentBoard) => {
    // First, check if AI can win
    const winMove = findWinningMove(currentBoard, 'bow')
    if (winMove !== -1) {
      // 25% chance to miss the winning move (to let player win more often)
      if (Math.random() > 0.25) return winMove
    }

    // Check if player can win and block
    const blockMove = findWinningMove(currentBoard, 'heart')
    if (blockMove !== -1) {
      // 25% chance to miss the blocking move
      if (Math.random() > 0.25) return blockMove
    }

    // Try to take center
    if (currentBoard[4] === null) return 4

    // Take random available corner
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => currentBoard[i] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Take any available space
    const availableSpaces = currentBoard
      .map((square, i) => square === null ? i : null)
      .filter(i => i !== null)
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
  }

  const findWinningMove = (currentBoard, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let line of lines) {
      const [a, b, c] = line
      const squares = [...currentBoard]
      if (squares[a] === player && squares[b] === player && squares[c] === null) return c
      if (squares[a] === player && squares[c] === player && squares[b] === null) return b
      if (squares[b] === player && squares[c] === player && squares[a] === null) return a
    }
    return -1
  }

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board)
        const newBoard = [...board]
        newBoard[aiMove] = 'bow'
        setBoard(newBoard)
        
        const gameWinner = checkWinner(newBoard)
        if (gameWinner) {
          setWinner(gameWinner)
          if (gameWinner === 'bow') {
            setGameResult('lose')
            setShowDialog(true)
          }
        } else {
          setIsPlayerTurn(true)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, board, winner])

  // Reset game when component mounts
  useEffect(() => {
    handleRetry()
  }, [])

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = 'heart'
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameWinner === 'heart') {
        onWin()
      } else if (gameWinner === 'tie') {
        setGameResult('tie')
        setShowDialog(true)
      }
    } else {
      setIsPlayerTurn(false)
    }
  }

  const handleRetry = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setWinningLine(null)
    setShowDialog(false)
    setIsPlayerTurn(true)
    setGameResult(null)
  }

  return (
    <motion.div 
      className="game-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="game-header">
        <div className="player-turn">
          {!winner && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              key={isPlayerTurn ? 'heart' : 'bow'}
            >
              {isPlayerTurn ? "Lượt Của Cậu" : "Con Mèo đang suy nghĩ..."}
            </motion.div>
          )}
        </div>
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            className={`cell ${winningLine?.includes(index) ? 'winning' : ''}`}
            whileHover={!cell && isPlayerTurn && !winner ? { scale: 1.05 } : {}}
            whileTap={!cell && isPlayerTurn && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(index)}
          >
            {cell && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {cell === 'heart' ? <HeartIcon /> : <BowIcon />}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showDialog && (
          <GameOverDialog 
            result={gameResult}
            onRetry={handleRetry}
            onGameOver={onGameOver}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TicTacToe 