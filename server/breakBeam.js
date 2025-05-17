

const pigpio = require('pigpio');
const { spawn } = require('child_process');

module.exports = function (breakbeamGpio, soundFile, callback) {
    const Gpio = pigpio.Gpio;

    console.log("Init Break beam sensor, sound and callback event", breakbeamGpio, soundFile, callback)

    const playSound = function (file) {
        const play = spawn('aplay', ['-D', 'sysdefault:CARD=Headphones', file]);

        play.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        play.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        play.on('close', (code) => {
            console.log(`aplay exited with code ${code}`);
        });
    }

    const initBreakBeamSensor = function (gpio, f, cb = () => { }) {
        const sensor = new Gpio(gpio, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_UP,
            alert: true
        });

        // Level must be stable for 10 ms before an alert event is emitted.
        sensor.glitchFilter(10000);

        sensor.on('alert', (level, tick) => {
            console.log("breakbeam broken", sensor, level)

            if (level === 0) {
                playSound(f)
                cb()
            }
        });
    }

    initBreakBeamSensor(breakbeamGpio, soundFile, callback)

    return {}
}

