const pigpio = require('pigpio');

module.exports = function (gpio, callback) {
    const button = new pigpio.Gpio(gpio, {
        mode: pigpio.Gpio.INPUT,
        pullUpDown: pigpio.Gpio.PUD_UP,
        alert: true
    });
    button.glitchFilter(10000);

    button.on('alert', (level, tick) => {
        console.log("alert button", level)
        if (level === 0) {
            console.log("button pressed")
            callback()
        }
    });

    return { button }
}