const Game = require('../models/game');

module.exports = {
    newGame: async (req, res) => {
        try {
            const { player1Id, player2Id } = req.body;
            const newGame = new Game({
                player1: player1Id,
                player2: player2Id
            });
            const savedGame = await newGame.save();
            res.status(200).json(savedGame);
        } catch(err) {
            res.status(400).json({ err });
        }
    },
    getOneGame: async () => {

    },
    getListGameByUserId: async () => {

    },
    updateGameChat: async () => {

    },
    updateMove: async () => {

    }
}