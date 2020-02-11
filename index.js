require('dotenv').config()
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)

const state = {
  history: [],
  references: ['https://archiv.berliner-zeitung.de/image/10240402/2x1/940/470/ddec03170a0206db53389ce8dce4b092/WA/32ef0249-jpg.jpg', 'https://www.bmw.de/content/dam/bmw/common/all-models/5-series/sedan/2019/navigation/bmw-modelfinder-g30-posi-stage2-890x501.png/_jcr_content/renditions/cq5dam.resized.img.585.low.time1564500271068.png', 'https://www.fitness-superstore.co.uk/media/catalog/product/cache/1/image/900x/9df78eab33525d08d6e5fb8d27136e95/1/3/13828_0_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/The_Pentagon_January_2008.jpg/1920px-The_Pentagon_January_2008.jpg', 'https://www.travelgrapher.de/wp-content/uploads/2017/04/gizeh-1.jpg', 'https://media.ottobock.com/_web-site/prosthetics/upper-limb/bebionic-hand/images-2019/bebionic_prothesenhand_1_1_teaser_onecolumn_border_retina.jpg', 'https://www.hannover.de/var/storage/images/media/werbepartner-madsack/bilder/5-sterne-hotel-standard/12384408-1-ger-DE/5-Sterne-Hotel-Standard.jpg', 'https://www.zamnesia.com/2315-5333-large2x/san-pedro-echinopsis-pachanoi.jpg', 'https://initiative-fuer-nachhaltigkeit.de/wp-content/uploads/2019/07/5-nach-12-776x310.jpg', 'https://www.claravital.de/media/image/product/5347/md/segufix-komplett-mit-schrittgurt.jpg', 'https://www.koeln.de/files/koeln/symbol_fotos/bombe_imago61702591_becker-und-bredel_565.jpg', 'https://www.myperfectcolor.com/repositories/images/colors/MPC00381053-2.jpg', 'https://www.daskartendruckhaus.de/r40/vc_ops2/bilder/firma264/einladungskarte_hoelzerne_hochzeit_30355_klein.jpg', 'https://192uxl2uo5l51gsk2o1cirqm-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/5-Elements-connected-e1562684948886.jpg', 'https://cdn.runrepeat.com/i/k-swiss/30142/k-swiss-court-smash-zapatillas-hombre-blanco-azul-marino-44-5-blanco-azul-marino-d629-600.jpg', 'https://www.herbst.de/wp-content/uploads/2016/02/Loadbalancing-und-Lastverteilung.jpg', 'https://blog.foerde-sparkasse.de/wp-content/uploads/2017/04/Foto-5-Prozent-Hürde-3.jpg']
}

const app = express()

app.get('/references', (req, res) => {
  res.json(state.references)
})

app.use(express.static(path.join(__dirname, 'public')))
app.listen(2220)
console.log('http://localhost:2220')

const wss = new WebSocket.Server({ port: 2221 })

function history(ws) {
  const msg = {
    type: 'history',
    payload: state.history
  }

  if (ws) {
    ws.send(JSON.stringify(msg))
  } else {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg))
      }
    })
  }
}

wss.on('connection', (ws) => {
  history(ws)

  ws.on('message', (data) => {
    console.log(data)
  })
})

bot.on('text', (ctx) => {
  if (ctx.update.message.chat.id !== -369679763) return
  
  if (ctx.update.message.text.startsWith('/reference ')) {
    const reference = ctx.update.message.text.replace('/reference ', '')

    if (reference.startsWith('http')) {
      state.references.push(reference)
    }

    return
  }

  const msg = {
    username: ctx.update.message.from.username,
    name: ctx.update.message.from.first_name,
    text: ctx.update.message.text,
    date: ctx.update.message.date
  }
  state.history = [msg, ...state.history.slice(0, 30)]
  history()
})

bot.launch()