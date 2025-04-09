#!/bin/bash

# Create logs directory if missing
mkdir -p /home/ryan/Documents/git/coinpusher/logs

# Load NVM and use the correct Node.js version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 23.6.0

# Set DISPLAY for GUI and allow access
export DISPLAY=:0
xhost +si:localuser:root  
xhost +local:

# Start up the game server
# sudo -E env "PATH=$PATH" /home/ryan/.nvm/versions/node/v23.6.0/bin/node /home/ryan/Documents/git/coinpusher/server/index.js &> /home/ryan/Documents/git/coinpusher/logs/server.log &
sudo /home/ryan/.nvm/versions/node/v23.6.0/bin/node /home/ryan/Documents/git/coinpusher/server/index.js &
# Debug message for LED script
# echo "Starting LEDs..." >> /home/ryan/Documents/git/coinpusher/logs/leds.log

# Start LEDs with correct virtual environment
# sudo -E /home/ryan/Documents/git/coinpusher/leds/venv/bin/python3 /home/ryan/Documents/git/coinpusher/leds/run.py &> /home/ryan/Documents/git/coinpusher/logs/leds.log &

LED_PID=$!  # Capture the Python process ID

# Start up the scoreboard GUI
# sudo -E env "PATH=$PATH" /home/ryan/.nvm/versions/node/v23.6.0/bin/npm --prefix /home/ryan/Documents/git/coinpusher/gui run dev &> /home/ryan/Documents/git/coinpusher/logs/gui.log &
/home/ryan/.nvm/versions/node/v23.6.0/bin/npm --prefix /home/ryan/Documents/git/coinpusher/gui run dev &  
# URL to open
URL="http://coinpusher.local:5173"

# Open Chromium browser in kiosk mode
chromium-browser "$URL" --kiosk --disable-session-crashed-bubble --disable-infobars --noerrdialogs &> /home/ryan/Documents/git/coinpusher/logs/browser.log &  

# Kill background processes when script exits
cleanup() {
    echo "Stopping all processes..."
    kill $LED_PID
    wait
}
trap cleanup EXIT

wait
