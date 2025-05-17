const path = require('path');


// const pineappleWheel = require('./dispenser.js')(24, 23, 25, 4, path.resolve(__dirname, 'sounds/coin_wheel.wav'));
// const coinDispensor = require('./dispenser.js')(17, 27, 22, 13, path.resolve(__dirname, 'sounds/coin_wheel.wav'))
// const tokenDispensor = require('./dispenser.js')(20, 19, 26, 18, path.resolve(__dirname, 'sounds/coin_wheel.wav'))
// // NOTE: the leds need to be initialized last
// const leds = require('./leds.js');



// // const playSound = function (soundFile) {
// //     const play = spawn('aplay', ['-D', 'sysdefault:CARD=Headphones', soundFile]);

// //     play.stdout.on('data', (data) => {
// //         console.log(`stdout: ${data}`);
// //     });

// //     play.stderr.on('data', (data) => {
// //         console.error(`stderr: ${data}`);
// //     });

// //     play.on('close', (code) => {
// //         console.log(`aplay exited with code ${code}`);
// //     });
// // }
// // const coinDispense = path.resolve(__dirname, 'sounds/coin_dispensed.wav');
// // playSound(coinDispense)
// // const coinThroughWheel = path.resolve(__dirname, 'sounds/coin_wheel.wav');
// // playSound(coinThroughWheel)
// // const tokenCounted = path.resolve(__dirname, 'sounds/token_count.wav');
// // playSound(tokenCounted)
// // const tokenToTicket = path.resolve(__dirname, 'sounds/count_tickets.wav');
// // playSound(tokenToTicket)

// function start() {
//     pineappleWheel.start()
//     coinDispensor.start()
//     tokenDispensor.start()

//     setTimeout(() => {
//         pineappleWheel.stop()
//         coinDispensor.stop()
//         tokenDispensor.stop()
//     }, 5000)
// }

// function unjam() {
//     // pineappleWheel.reverse()
//     tokenDispensor.reverse()
//     // tokenDispensor.reverse()

//     setTimeout(() => {
//         //     pineappleWheel.stop()
//         tokenDispensor.stop()
//         //     // tokenDispensor.stop()
//     }, 1000)
// }


// // leds.init()

// unjam()
// // start()


const coinDispensor = require('./dispenser.js')(17, 27, 22, 13, path.resolve(__dirname, 'sounds/coin_dispensed.wav'), () => { })
coinDispensor.start()
setTimeout(() => {
    coinDispensor.stop()
}, 2000);