const app = new Vue({
  el: '#chat',
  data: {
    history: []
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