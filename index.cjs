const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options.cjs')

const token = '6559002080:AAHxvM3NoMpDyjciFqNio-54esMQNkG8-GA'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Загадываю число от 0 до 9 - угадай-ка его`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Инфо о пользователе' },
    { command: '/game', description: 'Игра "Отгадай число"' },
  ])
  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/1.webp'
      )
      return bot.sendMessage(chatId, `Добро пожаловаться в чатик`)
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      )
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Dont understand')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }
    if (parseInt(data) === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляем, ты отгадал цифру ${data}`,
        againOptions
      )
    } else {
      return bot.sendMessage(
        chatId,
        `Не отгадал цифру ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
