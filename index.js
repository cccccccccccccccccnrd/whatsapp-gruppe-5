require('dotenv').config()
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)

const state = {
  history: []
}

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.listen(4440)
console.log('http://localhost:4440')

const wss = new WebSocket.Server({ port: 4441 })

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
  const msg = {
    username: ctx.update.message.from.username,
    name: ctx.update.message.from.first_name,
    text: ctx.update.message.text,
    date: ctx.update.message.date
  }
  state.history.push(msg)
  history()
})

bot.launch()