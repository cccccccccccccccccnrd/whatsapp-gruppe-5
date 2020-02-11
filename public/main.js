drag(document.getElementById('reference'))
drag(document.getElementById('events'))
loadReferences()

async function loadReferences() {
  const response = await fetch('https://whatsappgruppe5.tech/references')
  const references = await response.json()
  const reference = references[Math.floor(Math.random() * references.length)]
  document.getElementById('referencePayload').src = reference
}

function drag (element) {
  element.style.left = `${ Math.floor(Math.random() * Math.floor(window.innerWidth - element.offsetWidth)) }px`
  element.style.top = `${ Math.floor(Math.random() * Math.floor(window.innerHeight - 500)) }px`

  let offsetX = 0
  let offsetY = 0
  let lastOffsetX = 0
  let lastOffsetY = 0

  if (document.getElementById(element.id + 'header')) {
    document.getElementById(element.id + 'header').onmousedown = dragMouseDown
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(event) {
    event.preventDefault()

    lastOffsetX = event.clientX
    lastOffsetY = event.clientY
    document.onmouseup = dragMouseUp
    document.onmousemove = dragDrag
  }

  function dragDrag(event) {
    event.preventDefault()

    offsetX = lastOffsetX - event.clientX
    offsetY = lastOffsetY - event.clientY
    lastOffsetX = event.clientX
    lastOffsetY = event.clientY

    element.style.left = `${ element.offsetLeft - offsetX }px`
    element.style.top = `${ element.offsetTop - offsetY }px`
  }

  function dragMouseUp() {
    document.onmouseup = null
    document.onmousemove = null
  }
}

function dragStart (event) {
  console.log(event)
  offsetX = element.offsetWidth
  const element = event.srcElement.parentElement
  element.style.cursor = 'grab'
  const img = new Image()
  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  event.dataTransfer.setDragImage(img, 10, 10)
}

function dragEnd (event) {
  const element = event.srcElement.parentElement
  element.style.cursor = 'initial'
}

const app = new Vue({
  el: '#chat',
  data: {
    history: [],
    events: ['Treffen 12.2@12:00', 'Ausstellung 12.2@12:00']
  },
  mounted: function () {
    const WS_URL = window.location.hostname === 'localhost' ? 'ws://localhost:2221' : 'wss://whatsappgruppe5.tech/ws'
    this.socket = new WebSocket(WS_URL)

    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)

      switch (msg.type) {
        case 'history':
          this.history = msg.payload.reverse()
          this.$nextTick(function () {
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
          })
          break
        default:
          console.log(msg.payload)
      }
    })
  },
  methods: {
    date: function (milliseconds) {
      const date = new Date(milliseconds * 1000)
      return `${ date.getHours() }:${ ('0' + date.getMinutes()).slice(-2) }`
    }
  }
})