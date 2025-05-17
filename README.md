# coinpusher

To get sound working 
https://unix.stackexchange.com/questions/125546/how-to-run-vlc-player-in-root

sed -i 's/geteuid/getppid/' /usr/bin/vlc


In order to use the the leds you need to do the following 
 npm i rpi-ws281x-native
git clone https://github.com/jgarff/rpi_ws281x.git
rm -rf /var/app/node_modules/rpi-ws281x-native/src/rpi_ws281x
cp -r rpi_ws281x /var/app/node_modules/rpi-ws281x-native/src
cd /var/app/node_modules/rpi-ws281x-native
sudo node-gyp rebuild