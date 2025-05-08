const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
    crashPoint: Number,
    bets: [{
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        amount: Number,
        cashoutMultiplier: Number
    }],
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('GameRound', gameRoundSchema);
