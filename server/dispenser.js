
const pigpio = require('pigpio');
pigpio.terminate()

module.exports = function (in1Gpio, in2Gpio, enableGpio, breakbeamGpio, soundFile, callback = () => { }, addMessage, disableJamDetection = false, callerName) {
  const Gpio = pigpio.Gpio;


  const in1 = new Gpio(in1Gpio, { mode: Gpio.OUTPUT })
  const in2 = new Gpio(in2Gpio, { mode: Gpio.OUTPUT })
  const en = new Gpio(enableGpio, { mode: Gpio.OUTPUT })



  function start() {
    in1.digitalWrite(0);
    in2.digitalWrite(1);
    en.pwmWrite(255);
  }

  function reverse() {
    in1.digitalWrite(1);
    in2.digitalWrite(0);
    en.pwmWrite(255);
  }

  function stop() {
    in1.digitalWrite(0);
    in2.digitalWrite(0);
  }

  const jamDetection = require('./motorJamDection.js')(start, reverse, stop, addMessage, callerName)
  function clearJamTimeoutAndfireCallback() {
    if (!disableJamDetection)
      jamDetection.clearJamTimeout(true)
    callback()
  }
  require('./breakBeam.js')(breakbeamGpio, soundFile, clearJamTimeoutAndfireCallback);


  // ---- trap the SIGINT and reset before exit
  process.on('SIGINT', function () {
    console.log('SIGINT received, resetting motors and exiting...');
    stop()
  });


  return {
    start: () => {
      if (disableJamDetection)
        start()
      else
        jamDetection.startMotor()

    },
    stop,
    reverse
  }
}