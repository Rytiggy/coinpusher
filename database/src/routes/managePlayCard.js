module.exports = function (database) {
    const express = require("express");
    const router = express.Router();
    let newUser = {
        tickets: 0,
        player: "",
        chips: 0,
        uid: ""
    };
    // Get all play cards
    router.get("/", async (request, res) => {
        try {
            const User = database.models.User
            const allCards = await database.read(User)
            console.log("getAll Cards", allCards)
            return res.json({ data: allCards });
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });


    // Create a new play card
    router.post("/", async (request, res) => {
        const User = database.models.User

        try {
            let { player, uid } = request.body;
            // Validate data
            console.log(request.body)
            if (!player) {
                res.status(400).json({ error: "Bad Request", message: "Missing player fields" });
                return;
            }
            const isUidAlreadyOwned = await database.getByKey(User, 'uid', uid)

            if (isUidAlreadyOwned) {
                res.status(400).json({ error: "Bad Request", message: "This uid is already owned" });
                return;
            }
            const isPlayerNameAlreadyOwned = await database.getByKey(User, 'player', player)

            if (isPlayerNameAlreadyOwned) {
                res.status(400).json({ error: "Bad Request", message: "This player name is already owned, try another" });
                return;
            }

            if (!uid && newUser.uid) {
                uid = newUser.uid
                newUser.uid = "";
            } else {
                res.status(400).json({ error: "Bad Request", message: "Missing uid field" });
            }

            const foundUser = await database.write(User, { player, uid, tickets: 0, chips: 100 })
            res.status(200);
            res.json(foundUser.dataValues);
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });

    router.get("/new-uid", async (request, res) => {
        try {
            return res.json({ uid: newUser.uid });
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });

    router.post("/new", async (request, res) => {
        const body = request.body;
        try {
            const { uid } = request.body;
            newUser = {
                tickets: 0,
                player: "",
                chips: 0,
                uid: uid
            }
            console.log(request.body)
            res.json({ success: true, msg: "Scaned card saved successfully", user: newUser });
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });

    // get play card by uid
    router.get("/:uid", async (request, res) => {
        try {
            const uid = request.params.uid;
            const User = database.models.User
            const foundUser = await database.getByKey(User, 'uid', uid)
            console.log("foundUser", foundUser)
            if (!foundUser) {
                res.status(404).json({ error: "Not Found", message: "User not found" });
                return;
            }
            res.json(foundUser.dataValues);
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });

    // Update play card by uid
    router.patch("/:uid", async (request, res) => {
        try {
            const uid = request.params.uid;
            const body = request.body;
            const User = database.models.User
            const updatedUser = await database.update(User, 'uid', uid, body)
            console.log("updatedUser", updatedUser)
            if (!updatedUser) {
                res.status(404).json({ error: "Not Found", message: "User not found" });
                return;
            }
            res.json(updatedUser.dataValues);
        } catch (error) {
            console.log("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });


    // delete play card by id
    router.delete("/:id", async (request, res) => {
        try {
            const id = request.params.id;
            const User = database.models.User
            const foundUser = await database.getByKey(User, 'id', id)
            console.log("foundUser", foundUser)
            if (!foundUser) {
                res.status(404).json({ error: "Not Found", message: "User not found" });
                return;
            }
            const deletedUser = await database.deleteByKey(User, 'id', id)
            res.json(foundUser.dataValues);
        } catch (error) {
            console.error("error", error)
            res.status(500).json({ error: "Internal Server Error", data: error });
        }
    });

    return { router }
}
