drag(document.getElementById('reference'))
loadReference(document.getElementById('referencePayload'))

function loadReference(element) {
  const references = ['https://archiv.berliner-zeitung.de/image/10240402/2x1/940/470/ddec03170a0206db53389ce8dce4b092/WA/32ef0249-jpg.jpg', 'https://www.bmw.de/content/dam/bmw/common/all-models/5-series/sedan/2019/navigation/bmw-modelfinder-g30-posi-stage2-890x501.png/_jcr_content/renditions/cq5dam.resized.img.585.low.time1564500271068.png', 'https://www.fitness-superstore.co.uk/media/catalog/product/cache/1/image/900x/9df78eab33525d08d6e5fb8d27136e95/1/3/13828_0_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Pentagon_January_2008.jpg/1920px-The_Pentagon_January_2008.jpg', 'https://www.travelgrapher.de/wp-content/uploads/2017/04/gizeh-1.jpg', 'https://media.ottobock.com/_web-site/prosthetics/upper-limb/bebionic-hand/images-2019/bebionic_prothesenhand_1_1_teaser_onecolumn_border_retina.jpg', 'https://www.hannover.de/var/storage/images/media/werbepartner-madsack/bilder/5-sterne-hotel-standard/12384408-1-ger-DE/5-Sterne-Hotel-Standard.jpg', 'https://www.zamnesia.com/2315-5333-large2x/san-pedro-echinopsis-pachanoi.jpg', 'https://initiative-fuer-nachhaltigkeit.de/wp-content/uploads/2019/07/5-nach-12-776x310.jpg', 'https://www.claravital.de/media/image/product/5347/md/segufix-komplett-mit-schrittgurt.jpg', 'https://www.koeln.de/files/koeln/symbol_fotos/bombe_imago61702591_becker-und-bredel_565.jpg', 'https://www.myperfectcolor.com/repositories/images/colors/MPC00381053-2.jpg', 'https://www.daskartendruckhaus.de/r40/vc_ops2/bilder/firma264/einladungskarte_hoelzerne_hochzeit_30355_klein.jpg', 'https://192uxl2uo5l51gsk2o1cirqm-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/5-Elements-connected-e1562684948886.jpg', 'https://cdn.runrepeat.com/i/k-swiss/30142/k-swiss-court-smash-zapatillas-hombre-blanco-azul-marino-44-5-blanco-azul-marino-d629-600.jpg', 'https://www.herbst.de/wp-content/uploads/2016/02/Loadbalancing-und-Lastverteilung.jpg', 'https://blog.foerde-sparkasse.de/wp-content/uploads/2017/04/Foto-5-Prozent-Hürde-3.jpg']
  const reference = references[Math.floor(Math.random() * references.length)]
  element.src = reference
}

function drag (element) {
  element.style.left = `${ Math.floor(Math.random() * Math.floor(element.offsetWidth)) }px`
  element.style.top = `${ Math.floor(Math.random() * Math.floor(element.offsetHeight)) }px`

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