const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: null
    },
    accessType: {
        type: String,
        required: true
    },
    active: {
        type: String,
        default: '1'
    },
    rank: {
        type: String,
        default: "Tập sự"
    },
    elo: {
        type: Number,
        default: 1000
    },
    game: {
        type: Object,
        default: {
            win: 0,
            lose: 0,
            draw: 0,
            total: 0
        }
    },
    history: {
        type: Array,
        default: []
    }
});

userSchema.pre('save', async function(next) {
    try {
        const sail = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, sail);
        this.password = passwordHash;
        next();
    } catch(err) {
        next(err);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch(err) {
        throw new Error(err);
    }
}

module.exports = mongoose.model('users', userSchema);