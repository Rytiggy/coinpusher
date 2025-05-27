const express = require('express');
const WebSocket = require('ws');
var cors = require('cors');
const app = express();
const port = 3001
app.use(express.json());
app.use(cors());
const database = require('./src/models/database.js')()
const managePlayCard = require("./src/routes/managePlayCard.js")(database)
// Use routes
app.use("/play-cards", managePlayCard.router)


app.listen(port, () => {
    console.log(`Arcade started on port ${port}`)
})