#!/bin/bash

set -e  # Exit on error

# === Setup ===
LOG_DIR="/home/ryan/Documents/git/coinpusher/logs"
mkdir -p "$LOG_DIR"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 23.6.0

export DISPLAY=:0
# xhost +si:localuser:root  
# xhost +local:

# Track background PIDs
# PIDS=()

# === Start Node.js Server ===
echo "Starting game server..."
sudo -E /home/ryan/.nvm/versions/node/v16.20.2/bin/node /home/ryan/Documents/git/coinpusher/server/index.js \
  >> "$LOG_DIR/server.log" 2>&1 &
# PIDS+=($!)

echo "Starting database server..."
sudo -E /home/ryan/.nvm/versions/node/v16.20.2/bin/node /home/ryan/Documents/git/coinpusher/database/index.js \
  >> "$LOG_DIR/database.log" 2>&1 &
# PIDS+=($!)

# === Start play cards GUI Dev Server ===
echo "Starting Play card GUI dev server..."
/home/ryan/.nvm/versions/node/v16.20.2/bin/npm --prefix /home/ryan/Documents/git/coinpusher/database/gui run dev \
  >> "$LOG_DIR/playCardsgui.log" 2>&1 &
# PIDS+=($!)


# === Start GUI Dev Server ===
echo "Starting GUI dev server..."
/home/ryan/.nvm/versions/node/v16.20.2/bin/npm --prefix /home/ryan/Documents/git/coinpusher/gui run dev \
  >> "$LOG_DIR/gui.log" 2>&1 &
# PIDS+=($!)

# === Open Chromium in Kiosk Mode ===
URL="http://localhost:5173"
echo "Launching Chromium in kiosk mode at $URL..."
chromium-browser "$URL" --kiosk --disable-session-crashed-bubble --disable-infobars --noerrdialogs \
  >> "$LOG_DIR/browser.log" 2>&1 &
# PIDS+=($!)


wait
