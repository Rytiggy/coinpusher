const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    pigpio.terminate();
});


// pigpio.initialize();


module.exports = {
    sensors: [],
    // Creates the gpio pin and setups the logic to event when the sensor is triggered
    init(sensorMap = [], callback = (s) => { }) {
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
                if (level === 0) {
                    // Callback function to emmet from whenver the pin state is broken
                    callback(s)
                }
            });
            this.sensors.push(sensor)
        })
    },

}