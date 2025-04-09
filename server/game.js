const moters = require('./moters.js');
const sensors = require('./sensors.js')
const path = require('path');
const { exec } = require("child_process");



let pusherClearTimeout = null;

module.exports = {
  plays: 999,
  tokens: 0,
  tickets: 0, // 1 coin === 1 ticket TODO: i need to impliment logic and harware to count coins
  bonusTokens: false,
  cardDrop: false,
  wheelLedsState: [],
  init(sendMessage) {
    const beamBroken = (level, sensor) => {
      // console.log("beam broken callback", level, sensor)
      // Wheel coin break beam sensor
      if (sensor.gpio === 4) {
        if (level === 0) {
          const activeLed = this.wheelLedsState?.findIndex((leds, index) => {
            if (leds[0] === 255) {
              return index
            }
          })
          sendMessage(this.mapIndexToWheelBonus(activeLed), 'beam-broke-wheel')
        }
      }
      // Coin dispenser break beam sensor
      else if (sensor.gpio === 13) {
        if (pusherClearTimeout)
          clearTimeout(pusherClearTimeout)

        if (!moters.isPineappleWheelActive)
          moters.startPineappleWheel()

        // If no activity happens then lets turn stuff off
        pusherClearTimeout = setTimeout(() => {
          moters.stoptPineappleWheel()
          moters.stopPushingCoins()
        }, 15000) // 15 seconds 

        setTimeout(() => {
          moters.stopPushingCoins()
        }, 600);

        this.plays = (this.plays - 1)
        sendMessage(this.getGame(), 'beam-broke-coin-dispenser')

        const file = path.resolve(__dirname, 'coin_dispensed.mp3');

        exec(`cvlc --play-and-exit -A alsa --alsa-audio-device sysdefault:CARD=Headphones ${file}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error playing sound: ${error.message}`);
            return;
          }
          if (stderr) console.error(`stderr: ${stderr}`);
          if (stdout) console.log(`stdout: ${stdout}`);
        });

      }

    }
    const sensorMap = [
      {
        gpio: 4
      },
      {
        gpio: 13
      },

    ]
    sensors.setupBreakBeamSensors(sensorMap, beamBroken)



    const dispenseCoin = () => {
      console.log("dispenseCoin Plays left", this.plays, this.getGame())
      if (this.plays > 0) {
        moters.startPushingCoins();
      }
      else {
        console.log("No plays - insert credits")
      }

    }

    const buttonEvent = (level) => {
      console.log("buttonEvent", level)
      if (level === 0) {
        dispenseCoin()
      }

    }
    sensors.setupButton(6, buttonEvent)


    const setWheelState = (wheelSate) => {
      this.wheelLedsState = wheelSate

    }
    return { setWheelState }
  },
  isActive() {
    return this.plays > 0
  },
  getGame() {
    return {
      isActive: this.isActive(),
      plays: this.plays,
      tokens: this.tokens,
      tickets: this.tickets,
      bonusTokens: this.bonusTokens,
      cardDrop: this.cardDrop,
    }
  },

  start() {
    if (this.isActive()) {
      return
    }
    this.plays += 10
    moters.startPineappleWheel()
  },
  stop() {
    moters.stoptPineappleWheel()
  },
  mapIndexToWheelBonus(ledIndex) {
    // 24
    const wheelBonusMap = [
      {
        index: -1,
        plays: 0,
        tokens: 0,
        bonusTokens: false,
        cardDrop: false
      },
      {// Starts 1 index back from the top 
        index: 1,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 2,
        plays: 0,
        tokens: 0,
        bonusTokens: true,
        cardDrop: false
      },
      {
        index: 3,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 4,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 5,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 6,
        plays: 2,
        tokens: 0,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 7,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 8,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 9,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 10,
        plays: 0,
        tokens: 0,
        bonusTokens: true,
        cardDrop: false
      },
      {
        index: 11,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 12,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 13,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 14,
        plays: 0,
        tokens: 0,
        bonusTokens: false,
        cardDrop: true
      },
      {
        index: 15,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 16,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 17,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 18,
        plays: 0,
        tokens: 0,
        bonusTokens: true,
        cardDrop: false
      }, {
        index: 19,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 20,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 21,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 22,
        plays: 2,
        tokens: 0,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 23,
        plays: 0,
        tokens: 2,
        bonusTokens: false,
        cardDrop: false
      },
      {
        index: 24,
        plays: 0,
        tokens: 3,
        bonusTokens: false,
        cardDrop: false
      },
    ]
    const wheelBonus = wheelBonusMap.find(bonus =>
      bonus.index == ledIndex
    )
    console.log("mapIndexToWheelBonus: wheelBonus", wheelBonus)

    this.plays += wheelBonus?.plays
    this.tokens += wheelBonus?.tokens
    this.bonusTokens = wheelBonus?.bonusTokens
    this.cardDrop = wheelBonus?.cardDrop
    return this.getGame()
  }

}

