const crypto = require('crypto');

function generateCrashPoint(seed, roundNumber) {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const intVal = parseInt(hash.substring(0, 8), 16);
  let crashPoint = 1 + (intVal % 10000) / 1000; // Between 1x to 11x
  
  return { crashPoint: parseFloat(crashPoint.toFixed(2)), hash };
}

module.exports = { generateCrashPoint };

