const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    type: { type: String, enum: ['deposit', 'cashout'], required: true },
    amount: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
