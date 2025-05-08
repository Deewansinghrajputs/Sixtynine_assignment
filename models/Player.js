const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    balance: { type: Number, default: 1000 }, // default balance
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
