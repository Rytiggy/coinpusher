const pigpio = require('pigpio');

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


    app.post('/add-plays', async (req, res) => {
        try {
            activeGame.addPlays(req.body.plays)
            res.send({ game: activeGame.getGame() })
        } catch (e) {
            console.error(e)
        }
    })



    app.post('/manage-motor', async (req, res) => {
        try {
            console.log("manage motor", req.body)
            let stopAfter = 3000
            if (req.body.stopAfter) {
                stopAfter = req.body.stopAfter
            }

            if (req.body.coinDispensor === -1) {
                activeGame.coinDispensor.reverse()
            } else if (req.body.coinDispensor === 1) {
                activeGame.coinDispensor.start()
            }

            if (req.body.tokenDispensor === -1) {
                activeGame.tokenDispensor.reverse()
            } else if (req.body.tokenDispensor === 1) {
                activeGame.coinDispensor.start()
            }

            if (req.body.pineappleWheel === -1) {
                activeGame.pineappleWheel.reverse()
            } else if (req.body.pineappleWheel === 1) {
                activeGame.coinDispensor.start()
            }
            setTimeout(() => {
                activeGame.coinDispensor.stop()
                activeGame.tokenDispensor.stop()
                activeGame.pineappleWheel.stop()
            }, stopAfter);
            res.send({})
        } catch (e) {
            console.error(e)
        }
    })

    app.listen(port, () => {
        console.log(`coinpusher started on port ${port}`)
    })
}
catch (e) {
    console.error("[Error bondry]", e)
    pigpio.terminate()
}



