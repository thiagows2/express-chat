function randomColor() {
  const colors = [
    '#34B7F1',
    '#FF5733',
    '#9C27B0',
    '#00C851',
    '#FF1A75',
    '#FF1A1A',
    '#E040FB',
    '#4CAF50',
    '#FF6D00',
    '#FF4081',
    '#3F729B',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = randomColor
