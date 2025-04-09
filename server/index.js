const express = require('express');
const WebSocket = require('ws');
// const sensors = require('./sensors.js')
// const moters = require("./moters.js")
var cors = require('cors');
const moters = require('./moters.js');
const game = require('./game.js')

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;


const wss = new WebSocket.Server({ port: 80 });


function sendMessage(data, type) {
    const stringData = JSON.stringify({ type, data })
    wss.clients.forEach((client) => {
        client.send(stringData);
    });
}





const { setWheelState } = game.init(sendMessage)

wss.on('connection', (ws) => {
    console.log("New connection");

    ws.on('message', (message) => {
        // console.log('New message:', message);
        const { data, type } = JSON.parse(message)

        if (type === 'wheel-active-led') {
            setWheelState(JSON.parse(data))
        }

    });
});


moters.init()



app.post('/start-game', (req, res) => {
    game.start(sendMessage)
    moters.startPineappleWheel()
    res.send({ message: "Game started" })
})

app.post('/reset-game', (req, res) => {
    console.log("reset Game", req.body)
    // game.reset(sendMessage)
    moters.stoptPineappleWheel()
    moters.stopPushingCoins()
    res.send({ message: "Game reset" })
})


// app.get('/high-score', async (req, res) => {
//     const allTimeHighscore = await database.getTopScoreAllTime()
//     const highscoreToday = await database.getTopScoreToday()

//     res.send({ ever: allTimeHighscore?.score ? allTimeHighscore.score : 0, today: highscoreToday?.score ? highscoreToday.score : 0 })
// })

// app.get('/last-5-games', async (req, res) => {
//     const lastFiveGames = await database.getLast5Games()
//     res.send({ lastFiveGames })
// })

app.listen(port, () => {
    console.log(`Skeeball started on port ${port}`)
})