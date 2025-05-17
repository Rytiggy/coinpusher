
const path = require('path');

module.exports = function (sendMessage) {
  const backgroundSound = path.resolve(__dirname, 'sounds/background.wav');
  const backgroundSoundPlayer = require('./sounds/index.js')(backgroundSound)

  let tokens = 0;
  let plays = 100;
  let tickets = 0;
  let bonusTokens = 0;
  let cardDrop = 0;
  let messages = []
  let currentWheelIndex = 0
  const addMessage = (msg) => {
    messages.push(msg)
  }

  // Timeouts
  let clearJamCoinDispenserTimeout = null;
  let clearPineappleWheelTimeout = null;
  let pineappleTimeoutTimeStarted = null
  function setPineappleTimeout(timeout = 8000) {
    clearTimeout(clearPineappleWheelTimeout)
    pineappleTimeoutTimeStarted = null
    // pineappleTimeoutTimeStarted = new date().now()
    clearPineappleWheelTimeout = setTimeout(() => {
      pineappleWheel.stop()
      backgroundSoundPlayer.stop()
    }, timeout)
  }

  const wheelBreakBeamSound = path.resolve(__dirname, 'sounds/coin_wheel.wav');
  const wheelCoinEvent = () => {
    console.log('wheelCoinEvent', currentWheelIndex)
    mapIndexToWheelBonus(currentWheelIndex)
  }
  const pineappleWheel = require('./dispenser.js')(24, 23, 25, 4, wheelBreakBeamSound, wheelCoinEvent);

  const countTicketsBreakBeamSound = path.resolve(__dirname, 'sounds/count_tickets.wav');
  const countTicketEvent = () => {
    const game = getGame()
    tickets = game.tickets + 1;
    console.log('countTicketEvent', tickets)
    // setPineappleTimeout(10000)
  }
  require('./breakBeam.js')(5, countTicketsBreakBeamSound, countTicketEvent);
  // Init Count tickets break beam 

  const coinDispenseEvent = () => {
    console.log("Coin dispensed")
    clearTimeout(clearJamCoinDispenserTimeout)
    clearJamCoinDispenserTimeout = null
    plays = plays - 1;
    coinDispensor.stop()
  }
  const coinDispensor = require('./dispenser.js')(17, 27, 22, 13, path.resolve(__dirname, 'sounds/coin_dispensed.wav'), coinDispenseEvent)

  const tokenDispenseEvent = () => {
    console.log("tokens left", tokens)
    tokens--
    // setPineappleTimeout(10000)

    if (tokens === 0) {
      tokenDispensor.stop()
    }
  }
  const tokenDispensor = require('./dispenser.js')(20, 19, 26, 18, path.resolve(__dirname, 'sounds/token_count.wav'), tokenDispenseEvent)

  const playButtonPressed = () => {
    play()
  }

  require('./button.js')(6, playButtonPressed)
  // NOTE: the leds need to be initialized last
  const leds = require('./leds.js');


  function start() {
    backgroundSoundPlayer.playSound()
    const ledChangedEvent = (index) => {
      currentWheelIndex = index;
    }
    leds.init(ledChangedEvent)
    pineappleWheel.start()
    clearPineappleWheelTimeout = setTimeout(() => {
      pineappleWheel.stop()
      backgroundSoundPlayer.stop()
    }, 25000)
  }


  function play() {

    const game = getGame()
    console.log("play", game)
    if (game.plays > 0) {
      pineappleWheel.start()
      console.log("clearPineappleWheelTimeout", clearPineappleWheelTimeout, backgroundSoundPlayer.getStatus().isStopped)
      if (!clearPineappleWheelTimeout && backgroundSoundPlayer.getStatus().isStopped)
        backgroundSoundPlayer.playSound(backgroundSound)
      clearPineappleWheelTimeout = setTimeout(() => {
        pineappleWheel.stop()
        backgroundSoundPlayer.stop()
      }, 25000)
      coinDispensor.start()
      clearTimeout(clearJamCoinDispenserTimeout)
      clearTimeout(clearPineappleWheelTimeout)
      clearPineappleWheelTimeout = null
      clearJamCoinDispenserTimeout = null
      // if a coin doesn't come out in 3 seconds then lets reverse the dispenser stop stuff
      clearJamCoinDispenserTimeout = setTimeout(() => {
        addMessage("Jam detected D: im going to reverse <---")
        coinDispensor.reverse()
        setTimeout(() => {
          addMessage("Please push play button again")
          coinDispensor.stop()
        }, 1000)
      }, 3000)
    } else {
      addMessage("No plays left")
      console.log("No plays left")
    }
  }



  const gameInterval = setInterval(() => {
    const game = getGame()

    if (game.tokens > 0) {
      tokenDispensor.start()
    }

    if (game.bonusTokens > 0) {
      const game = getGame()
      bonusTokens = game.bonusTokens - 1;
      const bonusOptions = [5, 10, 5, 20, 5, 10, 5]
      const bonusIndex = Math.floor(Math.random() * 6);

      tokens = game.tokens + bonusOptions[bonusIndex]
      console.log("Bonus tokens added", bonusOptions[bonusIndex], tokens)
      sendMessage({ game, bonusIndex }, 'bonus-tokens')
    }

    sendMessage({ game }, 'game-update')


    // console.log("game", game)
  }, 500)


  function getGame() {
    return {
      tokens,
      plays,
      tickets,
      bonusTokens,
      cardDrop,
      messages,
      // endsAt: getTimeLeft(clearPineappleWheelTimeout) // TODO: add how long the game will stay active for
    }
  }

  function mapIndexToWheelBonus(ledIndex) {
    // 24 leds
    const wheelBonusMap = [
      {
        index: -1,
        plays: 0,
        tokens: 0,
        bonusTokens: 0,
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
        tokens: 0,
        bonusTokens: 1,
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
        plays: 0,
        tokens: 3,
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
        plays: 2,
        tokens: 0,
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
        tokens: 3,
        bonusTokens: 0,
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
        tokens: 0,
        bonusTokens: 1,
        cardDrop: 0
      },
      {
        index: 11,
        plays: 0,
        tokens: 2,
        bonusTokens: 0,
        cardDrop: 0
      },
      {
        index: 12,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
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
        tokens: 0,
        bonusTokens: 0,
        cardDrop: 1
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
        tokens: 3,
        bonusTokens: 0,
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
        tokens: 0,
        bonusTokens: 1,
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
        plays: 0,
        tokens: 3,
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
        plays: 2,
        tokens: 0,
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
      {
        index: 24,
        plays: 0,
        tokens: 3,
        bonusTokens: 0,
        cardDrop: 0
      },
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
    return getGame()
  }

  return { start, getGame }
}

function getTimeLeft(timeout) {
  if (timeout)
    return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
}
