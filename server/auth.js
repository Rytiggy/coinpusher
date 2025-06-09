
"use strict";
const { default: axios } = require("axios");
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");


function write() {

  //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
  console.log("scanning...");
  console.log("Please put chip or keycard in the antenna inductive zone!");
  console.log("Press Ctrl-C to stop.");

  const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
  });

  // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
  // I believe that channing pattern is better for configuring pins which are optional methods to use.
  const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

  setInterval(function () {
    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      console.log("No Card");
      return;
    }
    console.log("Card detected, CardType: " + response.bitSize);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log("UID Scan Error");
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    console.log(
      "Card read UID: %s %s %s %s",
      uid[0].toString(16),
      uid[1].toString(16),
      uid[2].toString(16),
      uid[3].toString(16)
    );

    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);
    console.log("Card Memory Capacity: " + memoryCapacity);

    //# This is the default key for authentication
    const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

    //# Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
      console.log("Authentication Error");
      return;
    }

    //# Variable for the data to write
    let data = [
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff
    ];

    console.log("Block 8 looked like this:");
    console.log(mfrc522.getDataForBlock(8));

    console.log("Block 8 will be filled with 0xFF:");
    mfrc522.writeDataToBlock(8, data);

    console.log("Now Block 8 looks like this:");
    console.log(mfrc522.getDataForBlock(8));

    data = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00
    ];

    console.log("Now we fill it with 16 x 0");
    mfrc522.writeDataToBlock(8, data);

    console.log("It is now empty:");
    console.log(mfrc522.getDataForBlock(8));

    mfrc522.stopCrypto();

    console.log("finished successfully!");
  }, 500);

}

function dump() {
  //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
  console.log("scanning...");
  console.log("Please put chip or keycard in the antenna inductive zone!");
  console.log("Press Ctrl-C to stop.");

  const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
  });

  // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
  // I believe that channing pattern is better for configuring pins which are optional methods to use.
  const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

  setInterval(function () {
    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      return;
    }
    console.log("Card detected, CardType: " + response.bitSize);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log("UID Scan Error");
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    console.log(
      "Card read UID: %s %s %s %s",
      uid[0].toString(16),
      uid[1].toString(16),
      uid[2].toString(16),
      uid[3].toString(16)
    );

    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);
    console.log("Card Memory Capacity: " + memoryCapacity);

    //# This is the default key for authentication
    const keyA = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
    const keyB = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    //# dump 64 bit fifo buffer
    for (let i = 0; i < 64; i++) {
      if (mfrc522.authenticate(i, keyA, uid)) {
        console.log("Block: " + i + " Data: " + mfrc522.getDataForBlock(i), mfrc522.getUid());
      } else {
        console.log("Authentication Error");
        break;
      }
    }

    //# Stop
    mfrc522.stopCrypto();
  }, 500);

}

function read() {
  //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
  console.log("scanning...");
  console.log("Please put chip or keycard in the antenna inductive zone!");
  console.log("Press Ctrl-C to stop.");

  const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
  });

  // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
  // I believe that channing pattern is better for configuring pins which are optional methods to use.
  const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

  setInterval(function () {
    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      console.log("No Card");
      return;
    }
    console.log("Card detected, CardType: " + response.bitSize);

    mfrc522.readRegister()
    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log("UID Scan Error");
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    console.log(response, "ffvdsf", mfrc522.readRegister(8)
    )
    console.log(
      "Card read UID: %s %s %s %s",
      uid[0].toString(16),
      uid[1].toString(16),
      uid[2].toString(16),
      uid[3].toString(16)
    );

    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);
    console.log("Card Memory Capacity: " + memoryCapacity);

    //# This is the default key for authentication
    const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

    //# Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
      console.log("Authentication Error");
      return;
    }

    //# Dump Block 8
    console.log("Block: 8 Data: " + mfrc522.getDataForBlock(8));

    //# Stop
    mfrc522.stopCrypto();
  }, 500);

}




module.exports = function (numberOfChipsToPlay = 3, callback = () => { }, errorCallback = () => { }) {

  const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
  });

  // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
  // I believe that channing pattern is better for configuring pins which are optional methods to use.
  const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

  setInterval(async function () {
    //# reset card
    mfrc522.reset();
    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      return;
    }

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      console.log("UID Scan Error");
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);
    // console.log("Card Memory Capacity: " + memoryCapacity);

    //# This is the default key for authentication
    const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

    //# Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
      console.log("Authentication Error");
    }

    const formattedUid = uid.map((item) => item.toString(16).padStart(2, '0')).join('-');
    const cardInfo = await getPlayCard(formattedUid);
    console.log("Card scanned uid:", formattedUid)
    if (!cardInfo) {
      errorCallback(`No user assigned to this card ${formattedUid}`);
      const newPlayCard = await createNewPlayCard(formattedUid)
      console.error(`No user assigned to this card ${formattedUid} - ${newPlayCard}`);


      return;
    }

    const chips = cardInfo.chips;
    if (chips < numberOfChipsToPlay) {
      console.error("Not enough chips");
      errorCallback("Not enough chips")
      return;
    }

    const updatedCardInfo = await updatePlayCard(formattedUid, { chips: chips - numberOfChipsToPlay })
    console.log("Card Info:", updatedCardInfo)
    callback(updatedCardInfo)
    //# Stop crypto
    mfrc522.stopCrypto();
  }, 500);


  async function updatePlayCard(uid, card) {
    try {
      const response = await axios.patch(`http://localhost:3001/play-cards/${uid}`, card);
      return response.data
    } catch (e) {
      console.log("updatePlayCard error", e)
    }
  }

  async function getPlayCard(uid) {
    try {
      const response = await axios.get(
        `http://localhost:3001/play-cards/${uid}`,
      );
      return response.data
    } catch (e) {
      console.log("getPlayCard error", e)
    }
  }

  async function createNewPlayCard(cardInfo) {
    try {
      const response = await axios.post(`http://localhost:3001/play-cards/new`, { uid: cardInfo });
      return response.data
    } catch (e) {
      console.log("updatePlayCard error", e)
    }
  }
  async function createGame(game) {
    console.log("createGame", game)
    try {
      const response = await axios.post(`http://192.168.3.21:3001/games`, game);
      return response.data
    } catch (e) {
      console.log("saveGame error", e)
    }
  }
  async function updateGame(id, game) {
    try {
      const response = await axios.patch(`http://192.168.3.21:3001/games/${id}`, game);
      return response.data
    } catch (e) {
      console.log("updateGame error", e)
    }
  }


  return {
    updatePlayCard,
    getPlayCard,
    createGame,
    updateGame
  }
}

