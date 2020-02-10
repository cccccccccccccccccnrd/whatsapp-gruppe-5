const app = new Vue({
  el: '#chat',
  data: {
    history: []
  },
  mounted: function () {
    const WS_URL = window.location.hostname === 'localhost' ? 'ws://localhost:4441' : 'wss://cnrd.computer/turing-test-ws/'
    this.socket = new WebSocket(WS_URL)

    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)

      switch (msg.type) {
        case 'history':
          this.history = msg.payload
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