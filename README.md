# coinpusher

To get sound working 
https://unix.stackexchange.com/questions/125546/how-to-run-vlc-player-in-root

sed -i 's/geteuid/getppid/' /usr/bin/vlc


In order to use the the leds you need to do the following 
 npm i rpi-ws281x-native
git clone https://github.com/jgarff/rpi_ws281x.git
rm -rf ./node_modules/rpi-ws281x-native/src/rpi_ws281x
cp -r rpi_ws281x ./coinpusher/server/node_modules/rpi-ws281x-native/src
cd ./node_modules/rpi-ws281x-native
 node-gyp rebuild