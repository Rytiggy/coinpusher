try {
    const express = require('express');
    const WebSocket = require('ws');
    var cors = require('cors');
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

    const activeGame = game(sendMessage)
    activeGame.start()

    app.get('/get-game', async (req, res) => {
        try {
            res.send({ game: activeGame.getGame() })
        } catch (e) {
            console.error(e)
        }
    })

    app.listen(port, () => {
        console.log(`Skeeball started on port ${port}`)
    })
}
catch (e) {
    console.error("[Error bondry]", e)
}





// Old stuff 



// const express = require('express');
// const WebSocket = require('ws');
// // const sensors = require('./sensors.js')
// // const moters = require("./moters.js")
// var cors = require('cors');
// // const moters = require('./moters.js');
// // const game = require('./game.js')

// const app = express();
// app.use(express.json());
// app.use(cors());
// const port = 3000;

// const wss = new WebSocket.Server({ port: 80 });




// function sendMessage(data, type) {
//     const stringData = JSON.stringify({ type, data })
//     wss.clients.forEach((client) => {
//         client.send(stringData);
//     });
// }





// const { setWheelState } = game.init(sendMessage)

// wss.on('connection', (ws) => {
//     console.log("New connection");

//     ws.on('message', (message) => {
//         // console.log('New message:', message);
//         const { data, type } = JSON.parse(message)

//         if (type === 'wheel-active-led') {
//             setWheelState(JSON.parse(data))
//         }

//     });
// });


// moters.init()



// app.post('/start-game', (req, res) => {
//     game.start(sendMessage)
//     moters.startPineappleWheel()
//     res.send({ message: "Game started" })
// })

// app.post('/reset-game', (req, res) => {
//     console.log("reset Game", req.body)
//     // game.reset(sendMessage)
//     moters.stoptPineappleWheel()
//     moters.stopPushingCoins()
//     res.send({ message: "Game reset" })
// })

// app.post('/push-tokens', (req, res) => {
//     moters.startTokenPushing()
// })

// app.post('/stop-tokens', (req, res) => {
//     moters.stopPushinTokens()
// })


// app.post('/fix-jam', (req, res) => {
//     console.log("fix jam", req.body)
//     moters.stoptPineappleWheel()
//     moters.stopPushingCoins()
//     moters.reversePushingCoins()
//     moters.reversePineappleWheel()
//     setTimeout(() => {
//         moters.stopPushingCoins()
//         moters.stoptPineappleWheel()
//     }, 800);

//     res.send({ message: "lets try somthing..." })
// })
// app.get('/high-score', async (req, res) => {
//     const allTimeHighscore = await database.getTopScoreAllTime()
//     const highscoreToday = await database.getTopScoreToday()

//     res.send({ ever: allTimeHighscore?.score ? allTimeHighscore.score : 0, today: highscoreToday?.score ? highscoreToday.score : 0 })
// })

// app.get('/last-5-games', async (req, res) => {
//     const lastFiveGames = await database.getLast5Games()
//     res.send({ lastFiveGames })
// })
