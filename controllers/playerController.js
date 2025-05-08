const Player = require('../models/Player');
const Transaction = require('../models/Transaction');

exports.registerPlayer = async (req, res) => {
    try {
        const { username } = req.body;
        const player = new Player({ username });
        await player.save();
        res.status(201).json(player);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json({ balance: player.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deposit = async (req, res) => {
    try {
        const { username, amount } = req.body;
        const player = await Player.findOne({ username });
        if (!player) return res.status(404).json({ message: 'Player not found' });

        player.balance += amount;
        await player.save();

        const txn = new Transaction({ player: player._id, type: 'deposit', amount });
        await txn.save();

        res.json({ message: 'Deposit successful', balance: player.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
