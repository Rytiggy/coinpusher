const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

// const in1 = new Gpio(24, { mode: Gpio.OUTPUT });
// const in2 = new Gpio(23, { mode: Gpio.OUTPUT });
// const en = new Gpio(25, { mode: Gpio.OUTPUT });

// let temp1 = 1;


// function handleInput(x) {
//     x = x.trim();

//     switch (x) {
//         case 'r':
//             console.log("run");
//             if (temp1 === 1) {
//                 in1.digitalWrite(1);
//                 in2.digitalWrite(0);
//                 console.log("forward");
//             } else {
//                 in1.digitalWrite(0);
//                 in2.digitalWrite(1);
//                 console.log("backward");
//             }
//             break;

//         case 's':
//             console.log("stop");
//             in1.digitalWrite(0);
//             in2.digitalWrite(0);
//             break;

//         case 'f':
//             console.log("forward");
//             in1.digitalWrite(1);
//             in2.digitalWrite(0);
//             temp1 = 1;
//             break;

//         case 'b':
//             console.log("backward");
//             in1.digitalWrite(0);
//             in2.digitalWrite(1);
//             temp1 = 0;
//             break;

//         case 'l':
//             console.log("low");
//             en.pwmWrite(64); // 25% duty cycle
//             break;

//         case 'm':
//             console.log("medium");
//             en.pwmWrite(128); // 50% duty cycle
//             break;

//         case 'h':
//             console.log("high");
//             en.pwmWrite(192); // 75% duty cycle
//             break;

//         case 'e':
//             console.log("Exiting...");
//             rl.close();
//             process.exit(0);
//             break;

//         default:
//             console.log("<<< wrong data >>>");
//             console.log("please enter the defined data to continue.....");
//     }
// }




module.exports = {
    in1: null,
    in2: null,
    en: null,
    in3: null,
    in4: null,
    en2: null,
    tokenIn1: null,
    tokenIn2: null,
    tokenEn: null,
    isPineappleWheelActive: false,
    init() {
        this.in1 = new Gpio(24, { mode: Gpio.OUTPUT })
        this.in2 = new Gpio(23, { mode: Gpio.OUTPUT })
        this.en = new Gpio(25, { mode: Gpio.OUTPUT })

        this.in3 = new Gpio(27, { mode: Gpio.OUTPUT }) // blue
        this.in4 = new Gpio(17, { mode: Gpio.OUTPUT }) // purple 
        this.en2 = new Gpio(22, { mode: Gpio.OUTPUT }) // grey 

        // token init
        this.tokenIn1 = new Gpio(19, { mode: Gpio.OUTPUT }) // blue
        this.tokenIn2 = new Gpio(20, { mode: Gpio.OUTPUT }) //purple
        this.tokenEn = new Gpio(26, { mode: Gpio.OUTPUT }) //grey
    },
    startPineappleWheel() {
        this.isPineappleWheelActive = true;
        this.in1.digitalWrite(0);
        this.in2.digitalWrite(1);
        this.en.pwmWrite(255); // 25% duty cycle
    },
    reversePineappleWheel() {
        this.isPineappleWheelActive = true;
        this.in1.digitalWrite(1);
        this.in2.digitalWrite(0);
        this.en.pwmWrite(255); // 25% duty cycle
    },
    stoptPineappleWheel() {
        this.isPineappleWheelActive = false;
        this.in1.digitalWrite(0);
        this.in2.digitalWrite(0);
    },
    startPushingCoins() {
        this.in3.digitalWrite(1);
        this.in4.digitalWrite(0);
        this.en2.pwmWrite(255); // 25% duty cycle
    },
    reversePushingCoins() {
        this.in3.digitalWrite(0);
        this.in4.digitalWrite(1);
        this.en2.pwmWrite(255); // 25% duty cycle
    },
    stopPushingCoins() {
        this.in3.digitalWrite(0);
        this.in4.digitalWrite(0);
    },

    startTokenPushing() {
        this.tokenIn1.digitalWrite(1);
        this.tokenIn2.digitalWrite(0);
        this.tokenEn.pwmWrite(255); // 25% duty cycle
    },
    reversePushingToken() {
        this.tokenIn1.digitalWrite(0);
        this.tokenIn2.digitalWrite(1);
        this.tokenEn.pwmWrite(255); // 25% duty cycle
    },
    stopPushinTokens() {
        this.tokenIn1.digitalWrite(0);
        this.tokenIn2.digitalWrite(0);
    },

}