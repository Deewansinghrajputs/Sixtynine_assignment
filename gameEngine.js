const GameRound = require('./models/GameRound');
const Player = require('./models/Player');
const { generateCrashPoint } = require('./utils/provablyFair');
const { Server } = require('socket.io');

let io;
let currentRound = null;
let multiplier = 1.0;
let interval;

function startGame(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.emit('roundInfo', { currentRound, multiplier });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  gameLoop();
}

async function gameLoop() {
  let roundNumber = 1;

  setInterval(async () => {
    // Start New Round
    const { crashPoint, hash } = generateCrashPoint('secret_seed', roundNumber);
    currentRound = await GameRound.create({
      roundNumber,
      crashPoint,
      seed: 'secret_seed',
      hash,
      startedAt: new Date()
    });

    multiplier = 1.0;
    io.emit('roundStarted', { roundNumber, hash });

    console.log(`Round ${roundNumber} started. Crash at ${crashPoint}x`);

    // Multiplier Increase Loop
    interval = setInterval(async () => {
      multiplier += 0.01;
      io.emit('multiplierUpdate', { multiplier: multiplier.toFixed(2) });

      if (multiplier >= crashPoint) {
        clearInterval(interval);
        await endRound(roundNumber, crashPoint);
      }
    }, 100); // 100ms = 10x per sec

    roundNumber++;

  }, 15000); // Every 15 sec round
}

async function endRound(roundNumber, crashPoint) {
  await GameRound.updateOne({ roundNumber }, { status: 'ended', endedAt: new Date() });
  io.emit('roundEnded', { crashPoint });

  console.log(`Round ${roundNumber} ended at ${crashPoint}x`);
}

module.exports = { startGame };

