const winSound = new Audio('/sounds/win.mp3')
const loseSound = new Audio('/sounds/lose.mp3')
const clickSound = new Audio('/sounds/click.mp3')

export const playWinSound = () => {
  winSound.currentTime = 0
  winSound.play()
}

export const playLoseSound = () => {
  loseSound.currentTime = 0
  loseSound.play()
}

export const playClickSound = () => {
  clickSound.currentTime = 0
  clickSound.play()
} 