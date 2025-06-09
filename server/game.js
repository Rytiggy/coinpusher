
const path = require('path');
const { default: axios } = require("axios");

module.exports = function (sendMessage) {
  const backgroundSound = path.resolve(__dirname, 'sounds/background.wav');
  const backgroundSoundPlayer = require('./sounds/index.js')(backgroundSound)

  const noPlaysFile = path.resolve(__dirname, 'sounds/out_of_plays.wav');
  const noPlaysPlayer = require('./sounds/index.js')(noPlaysFile)

  const cardScannedFile = path.resolve(__dirname, 'sounds/card_scanned.wav');
  const cardScannedPlayer = require('./sounds/index.js')(cardScannedFile)
  let tokens = 0;
  let plays = 0;
  let tickets = 0;
  let bonusTokens = 0;
  let cardDrop = 0;
  let player = "Player"
  let card = null;
  let messages = []
  let gameId = null
  let currentWheelIndex = 0
  // This is a count of how many times the user has scanned their card without hitting the play button
  let userScannedCount = 0;
  const addMessage = (msg, type = "update") => {
    const data = {
      message: msg,
      created_at: Date.now(),
      type: type
    }
    messages.push(data)
  }

  // Timeouts
  let clearPineappleWheelTimeout = null;
  let pineappleTimeoutTimeStarted = 0

  function setPineappleTimeout(timeout = 15000) {
    clearTimeout(clearPineappleWheelTimeout)
    clearPineappleWheelTimeout = null
    pineappleTimeoutTimeStarted = Date.now() + timeout;
    clearPineappleWheelTimeout = setTimeout(() => {
      pineappleWheel.stop()
      backgroundSoundPlayer.stop()
      tokenDispensor.stop()

    }, timeout)
  }

  const wheelBreakBeamSound = path.resolve(__dirname, 'sounds/coin_wheel.wav');
  const wheelCoinEvent = () => {
    const { game, wheelBonus } = mapIndexToWheelBonus(currentWheelIndex)
    console.log('wheelCoinEvent', currentWheelIndex, game, wheelBonus)
    for (let key in wheelBonus) {
      if (key !== 'index' && wheelBonus[key] > 0) {
        console.log(wheelBonus[key])
        addMessage(`${wheelBonus[key]}  ${key} added`)
      }
    }
    // Trigger other events
    if (game.tokens > 0)
      tokenDispensor.start()
  }
  const pineappleWheel = require('./dispenser.js')(24, 23, 16, 4, wheelBreakBeamSound, wheelCoinEvent, addMessage, true, "Main Wheel");

  const countTicketsBreakBeamSound = path.resolve(__dirname, 'sounds/count_tickets.wav');
  const countTicketEvent = () => {
    axios.get(`http://localhost:3001/play-cards/${card.uid}`).then((res) => {
      if (!card) {
        return
      }
      console.log("cardData", res, card)
      if (res.data) {
        updatePlayCard(card.uid, { tickets: res.data.tickets + 3 })
      }
    })

    tickets = tickets + 3
    const updatedGameData = { type: "coinpusher", playerId: card.id, score: getGame().tickets, ...getGame() }
    console.log("updateGame", updatedGameData, gameId)
    if (gameId)
      auth.updateGame(gameId, updatedGameData)

    setPineappleTimeout()
  }
  require('./breakBeam.js')(5, countTicketsBreakBeamSound, countTicketEvent);
  // Init Count tickets break beam 
  const coinDispenseEvent = () => {
    console.log("Coin dispensed")
    plays = plays - 1;
    coinDispensor.stop()
    addMessage("Coin dispensed")
  }
  const coinDispensor = require('./dispenser.js')(17, 27, 22, 13, path.resolve(__dirname, 'sounds/coin_dispensed.wav'), coinDispenseEvent, addMessage, false, "Coin Dispenser")

  const tokenDispenseEvent = () => {
    console.log("tokens left", tokens)
    tokens--
    setPineappleTimeout()

    if (tokens === 0) {
      tokenDispensor.stop()
    }
  }
  const tokenDispensor = require('./dispenser.js')(20, 19, 26, 18, path.resolve(__dirname, 'sounds/token_count.wav'), tokenDispenseEvent, addMessage, false, "Token Dispenser")

  const playButtonPressed = () => {
    play()
  }

  require('./button.js')(6, playButtonPressed)
  // NOTE: the leds need to be initialized last
  const leds = require('./leds.js')();


  function start() {
    const ledChangedEvent = (index) => {
      currentWheelIndex = index;
    }
    leds.init(ledChangedEvent)
  }


  function play() {
    userScannedCount = 0
    const game = getGame()
    console.log("play", game)
    if (game.plays > 0) {
      // clearTimeout(clearJamCoinDispenserTimeout)
      clearTimeout(clearPineappleWheelTimeout)
      clearPineappleWheelTimeout = null
      // clearJamCoinDispenserTimeout = null
      pineappleWheel.start()
      if (game.tokens > 0) {
        tokenDispensor.start()
      }
      if (backgroundSoundPlayer.getStatus().isStopped || backgroundSoundPlayer.getStatus().isPaused)
        backgroundSoundPlayer.playSound(backgroundSound)
      setPineappleTimeout()

      coinDispensor.start()

      const updatedGameData = { type: "spongebob-coinpusher", playerId: card.id, score: getGame().tickets, ...getGame() }
      console.log("updateGame", updatedGameData, gameId)
      auth.updateGame(gameId, updatedGameData)

    } else {
      addMessage("No plays left", "warning")
      console.log("No plays left :( sry")
      noPlaysPlayer.stop()
      noPlaysPlayer.playOnce()
    }
  }



  const gameInterval = setInterval(() => {
    const game = getGame()

    if (game.tokens === 0) {
      tokenDispensor.stop()
    }

    if (game.bonusTokens > 0) {
      bonusTokens = game.bonusTokens - 1;
      const bonusOptions = [5, 10, 5, 20, 5, 10, 5]
      const bonusIndex = Math.floor(Math.random() * 6);

      tokens = game.tokens + bonusOptions[bonusIndex]
      console.log("Bonus tokens added", bonusOptions[bonusIndex], tokens)
      sendMessage({ game, bonusIndex }, 'bonus-tokens')
    }
    sendMessage({ game }, 'game-update')

  }, 500)


  function getGame() {
    let timeLeft = (pineappleTimeoutTimeStarted - Date.now()) / 1000;
    return {
      player,
      tokens,
      plays,
      tickets,
      bonusTokens,
      cardDrop,
      messages,
      card,
      timeLeft: timeLeft > 0 ? Math.round(timeLeft) : "Inactive"
    }
  }

  function mapIndexToWheelBonus(ledIndex) {
    // 24 leds
    leds.setActiveLed(ledIndex)
    const wheelBonusMap = [
      {
        index: 0,
        plays: 0,
        tokens: 0,
        bonusTokens: 1,
        cardDrop: 0
      },
      {// Starts 1 index back from the top 
        index: 1,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 2,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 3,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 4,
        plays: 2,
        tokens: 0,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 5,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 6,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 7,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 8,
        plays: 0,
        tokens: 0,
        bonusTokens: 1,
        cardDrop: 0
      },
      {
        index: 9,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 10,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 11,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      { // CARD DROP
        index: 12,
        plays: 0,
        tokens: 0,
        bonusTokens: 0,
        cardDrop: 1
      }, // CARD DROP
      {
        index: 13,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 14,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 15,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 16,
        plays: 0,
        tokens: 0,
        bonusTokens: 1,
        cardDrop: 0
      },
      {
        index: 17,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 18,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      }, {
        index: 19,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 20,
        plays: 2,
        tokens: 0,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 21,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 22,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 23,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      // {
      //   index: 24,
      //   plays: 0,
      //   tokens: 0,
      //   bonusTokens: 1,
      //   cardDrop: 0
      // },
    ]
    const wheelBonus = wheelBonusMap.find(bonus =>
      bonus.index == ledIndex
    )
    // addMessage(`Wheel Bonus ${JSON.stringify(wheelBonus)} ${ledIndex}`)
    if (wheelBonus?.plays)
      plays = plays + wheelBonus?.plays
    if (wheelBonus?.tokens)
      tokens = tokens + wheelBonus?.tokens
    if (wheelBonus?.bonusTokens)
      bonusTokens = bonusTokens + wheelBonus?.bonusTokens
    if (wheelBonus?.cardDrop)
      cardDrop = cardDrop + wheelBonus?.cardDrop
    return {
      game: getGame(),
      wheelBonus
    }
  }

  function addPlays(playsToAdd) {
    const game = getGame()
    plays = game.plays + playsToAdd
    addMessage(`${playsToAdd} plays added, have fun!`)
  }


  // If the card scan callback is called, we know that the player had chips and used them to play
  let getPlayMultipler = () => {
    let playsToAdd = 12
    switch (userScannedCount) {
      case 1:
        playsToAdd = 12;
        break;
      case 2:
        playsToAdd = 14;
        break;
      case 3:
        playsToAdd = 16;
        break;
      case 4:
        playsToAdd = 18;
        break;
      case 5:
        playsToAdd = 15;
        break;
      default:
        // Reset the multipler
        userScannedCount = 0;
        playsToAdd = 12;
        break;
    }
    return playsToAdd;
  }

  function scan(c) {
    userScannedCount++
    console.log("Card scanned", c)
    if (c) {
      // Play sound confirming card
      cardScannedPlayer.stop()
      cardScannedPlayer.playOnce()
      addMessage(`Scanned ${c.player}'s card`, "success")
      sendMessage({ card: c }, 'card-scan')
      let playsToAdd = getPlayMultipler()

      if (!card || (card && card.uid !== c.uid)) {
        tickets = 0
        plays = 0
        tokens = 0
        bonusTokens = 0
        cardDrop = 0
        gameId = null
        messages = []
        player = c.player
        sendMessage({ game: getGame() }, 'player-change')

        auth.createGame({ type: "coinpusher", playerId: c.id, score: getGame().tickets, attributes: getGame() }).then((res) => {
          console.log("Game created", res)
          gameId = res.id
        })
      }

      // Update the player name for the game
      player = c.player
      card = c


      addPlays(playsToAdd)
    }
  }

  function errorReadingCard(errorMsg) {
    console.log("Error reading card")
    addMessage(errorMsg)
  }
  const auth = require('./auth.js')(3, scan, errorReadingCard)


  return { start, getGame, addPlays, tokenDispensor, coinDispensor, pineappleWheel }
}


async function updatePlayCard(uid, cardData) {
  try {
    console.log("updatePlayCard data about to send", cardData)
    // Update the card with the new data
    const response = await axios.patch(`http://localhost:3001/play-cards/${uid}`, cardData);
    return response.data
  } catch (e) {
    console.log("updatePlayCard error", e)
  }
}