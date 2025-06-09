const express = require('express');
var cors = require('cors');

const WebSocket = require('ws');
const app = express();
const port = 3001
app.use(express.json());
app.use(cors());
const database = require('./src/models/database.js')()
const managePlayCard = require("./src/routes/managePlayCard.js")(database)
const manageGame = require("./src/routes/manageGame.js")(database)
// Use routes
app.use("/play-cards", managePlayCard.router)
app.use("/games", manageGame.router)


app.listen(port, () => {
    console.log(`Arcade started on port ${port}`)
})