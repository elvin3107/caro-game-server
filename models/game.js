const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const gameSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    player1: {
        type: Object,
        required: true
    },
    player2: {
        type: Object,
        required: true
    },
    winner: {
        type: Number,
        required: true,
    },
    move: {
        type: Array,
        default: []
    },
    chat: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('games', gameSchema);