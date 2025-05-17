
const pigpio = require('pigpio');



module.exports = function (in1Gpio, in2Gpio, enableGpio, breakbeamGpio, soundFile, callback = () => { }) {
  const Gpio = pigpio.Gpio;


  const in1 = new Gpio(in1Gpio, { mode: Gpio.OUTPUT })
  const in2 = new Gpio(in2Gpio, { mode: Gpio.OUTPUT })
  const en = new Gpio(enableGpio, { mode: Gpio.OUTPUT })


  require('./breakBeam.js')(breakbeamGpio, soundFile, callback);

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

  // ---- trap the SIGINT and reset before exit
  process.on('SIGINT', function () {
    console.log('SIGINT received, resetting motors and exiting...');
    stop()
  });


  return { start, stop, reverse }
}