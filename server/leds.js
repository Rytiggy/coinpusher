const ws281x = require('rpi-ws281x-native');



const NUM_LEDS = 24
const STRIP_TYPE = ws281x.stripType.WS2812
const channel = ws281x(NUM_LEDS, { stripType: STRIP_TYPE, gpio: 21 });

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  console.log('SIGINT received, resetting LEDs and exiting...');
  ws281x.reset();
  // ws281x.finalize();

  process.nextTick(function () {
    process.exit(0);
  });
});


function colorwheel(pos) {
  pos = 255 - pos;

  if (pos < 85) {
    return rgb2Int(255 - pos * 3, 0, pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    return rgb2Int(0, pos * 3, 255 - pos * 3);
  } else {
    pos -= 170;
    return rgb2Int(pos * 3, 255 - pos * 3, 0);
  }
}
// grb
function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}



module.exports = {
  init(callback = () => { }) {

    // // clearInterval = setInterval(function () {
    // for (let i = 0; i < 3 * NUM_LEDS; i++) {
    //   // channel.array[i] = rgb2Int(0, 0, 200) // blue 
    //   // channel.array[i] = rgb2Int(0, 200, 0) // red
    //   // channel.array[i] = rgb2Int(200, 0, 0) // green
    // }

    let offset = 1
    setInterval(function () {

      for (let i = 0; i < NUM_LEDS; i++) {
        if (i == offset)
          channel.array[offset] = rgb2Int(0, 200, 0)
        else
          channel.array[i] = rgb2Int(100, 0, 150)

      }
      if (offset < NUM_LEDS)
        offset = offset + 1
      else
        offset = 0

      callback(offset)
      ws281x.render();

    }, 300);
    ws281x.render();

  }
}