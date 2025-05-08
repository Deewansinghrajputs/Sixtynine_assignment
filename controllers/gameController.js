const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');

// Start new round
exports.startRound = async (req, res) => {
    try {
        const crashPoint = (Math.random() * (5 - 1) + 1).toFixed(2); // 1x to 5x
        const round = new GameRound({ crashPoint });
        await round.save();
        res.json(round);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Place bet
exports.placeBet = async (req, res) => {
    try {
        const { roundId, username, amount } = req.body;
        const round = await GameRound.findById(roundId);
        const player = await Player.findOne({ username });

        if (!round || !player) return res.status(404).json({ message: 'Round or Player not found' });
        if (player.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

        // Deduct balance
        player.balance -= amount;
        await player.save();

        // Add bet
        round.bets.push({ player: player._id, amount });
        await round.save();

        res.json({ message: 'Bet placed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cashout
exports.cashOut = async (req, res) => {
    try {
        const { roundId, username, cashoutMultiplier } = req.body;
        const round = await GameRound.findById(roundId).populate('bets.player');
        const player = await Player.findOne({ username });

        if (!round || !player) return res.status(404).json({ message: 'Round or Player not found' });

        const bet = round.bets.find(b => b.player.username === username);
        if (!bet) return res.status(400).json({ message: 'No bet found for player' });

        if (bet.cashoutMultiplier) {
            return res.status(400).json({ message: 'Already cashed out' });
        }

        // Update cashout
        bet.cashoutMultiplier = cashoutMultiplier;
        await round.save();

        // Credit balance
        const winAmount = bet.amount * cashoutMultiplier;
        player.balance += winAmount;
        await player.save();

        // Save transaction
        const txn = new Transaction({ player: player._id, type: 'cashout', amount: winAmount });
        await txn.save();

        res.json({ message: 'Cashed out successfully', winAmount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
