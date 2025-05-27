const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    console.log("Exiting...");
    pigpio.terminate();
});



module.exports = {
    sensors: [],
    // Creates the gpio pin and setups the logic to event when the sensor is triggered
    setupBreakBeamSensors(sensorMap = [], callback = (level, s) => { }) {
        pigpio.configureClock(1, pigpio.CLOCK_PWM);
        this.sensors = []
        sensorMap.forEach(s => {
            const sensor = new Gpio(s.gpio, {
                mode: Gpio.INPUT,
                pullUpDown: Gpio.PUD_UP,
                alert: true
            });
            // Level must be stable for 10 ms before an alert event is emitted.
            sensor.glitchFilter(10000);

            sensor.on('alert', (level, tick) => {
                console.log("breakbeam broken", sensor, level)
                if (level === 0) {
                    // Callback function to emmet from whenver the pin state is broken
                    callback(level, s)
                }
            });
            this.sensors.push(sensor)
        })
    },


    setupButton(gpio, callback = (s) => { }) {
        const button = new Gpio(gpio, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_UP,
            alert: true
        });



        // Level must be stable for 10 ms before an alert event is emitted.
        button.glitchFilter(10000);

        button.on('alert', (level, tick) => {
            callback(level)
            console.log("button pressed", level)
        });

    }
}