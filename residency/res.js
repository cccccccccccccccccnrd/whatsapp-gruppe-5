const WS_URL = window.location.hostname === 'localhost' ? 'ws://localhost:2221' : 'wss://gruppe5.org/ws'
const socket = new WebSocket(WS_URL)
const image = document.querySelector('#image')

socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)

  switch (msg.type) {
    case 'residency':
      console.log(msg.payload)
      image.src = `data:image/png;charset=utf-8;base64,${msg.payload}`
      break
    default:
      console.log(msg.payload)
  }
})