import './style.css'

const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝']

let cards = []
let flippedCards = []
let matchedCount = 0
let moves = 0
let timer = 0
let timerInterval = null
let timerStarted = false
let lockBoard = false

const grid = document.querySelector('#grid')
const movesEl = document.querySelector('#moves')
const timerEl = document.querySelector('#timer')
const shuffleBtn = document.querySelector('#shuffle-btn')
const restartBtn = document.querySelector('#restart-btn')
const playAgainBtn = document.querySelector('#play-again-btn')
const winModal = document.querySelector('#win-modal')
const winTime = document.querySelector('#win-time')
const winMoves = document.querySelector('#win-moves')
const overlay = document.querySelector('#overlay')

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function startTimer() {
  if (timerStarted) return
  timerStarted = true
  timerInterval = setInterval(() => {
    timer++
    timerEl.textContent = timer
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
  timerInterval = null
}

function resetGame() {
  stopTimer()
  timer = 0
  moves = 0
  matchedCount = 0
  flippedCards = []
  lockBoard = false
  timerStarted = false

  movesEl.textContent = '0'
  timerEl.textContent = '0'

  cards = shuffle([...EMOJIS, ...EMOJIS])
  grid.innerHTML = ''

  cards.forEach((emoji, index) => {
    const card = document.createElement('button')
    card.className = 'card'
    card.dataset.index = index
    card.dataset.emoji = emoji
    card.setAttribute('aria-label', 'การ์ดที่ยังไม่เปิด')

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${emoji}</div>
      </div>
    `

    card.addEventListener('click', () => handleCardClick(card))
    grid.appendChild(card)
  })

  winModal.classList.remove('show')
  overlay.classList.remove('show')
}

function handleCardClick(card) {
  if (lockBoard) return
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return

  startTimer()
  card.classList.add('flipped')
  card.setAttribute('aria-label', 'การ์ดที่เปิดแล้ว')
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    moves++
    movesEl.textContent = moves
    checkMatch()
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards
  const isMatch = card1.dataset.emoji === card2.dataset.emoji

  if (isMatch) {
    card1.classList.add('matched')
    card2.classList.add('matched')
    card1.setAttribute('aria-label', 'จับคู่แล้ว')
    card2.setAttribute('aria-label', 'จับคู่แล้ว')
    flippedCards = []
    matchedCount++

    if (matchedCount === EMOJIS.length) {
      stopTimer()
      setTimeout(showWin, 500)
    }
  } else {
    lockBoard = true
    setTimeout(() => {
      card1.classList.remove('flipped')
      card2.classList.remove('flipped')
      card1.setAttribute('aria-label', 'การ์ดที่ยังไม่เปิด')
      card2.setAttribute('aria-label', 'การ์ดที่ยังไม่เปิด')
      flippedCards = []
      lockBoard = false
    }, 1000)
  }
}

function showWin() {
  winTime.textContent = `${timer} วินาที`
  winMoves.textContent = `${moves} ครั้ง`
  winModal.classList.add('show')
  overlay.classList.add('show')
}

shuffleBtn.addEventListener('click', resetGame)
restartBtn.addEventListener('click', resetGame)
playAgainBtn.addEventListener('click', resetGame)

resetGame()
