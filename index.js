const { Telegraf } = require('telegraf');
require('dotenv').config();
const app = require('express')()

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Channel ID: use @username or -100... numeric ID
const channelId = process.env.CHANNEL_ID || '@your_channel_name';

// Function to generate dynamic period
function generateDynamicPeriod() {
  // Get current UTC time
  const nowUTC = new Date();

  // Convert to IST (UTC + 5:30)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(nowUTC.getTime() + istOffsetMs);

  // YYYYMMDD
  const dateStr = `${nowIST.getFullYear()}${String(nowIST.getMonth() + 1).padStart(2, '0')}${String(nowIST.getDate()).padStart(2, '0')}`;

  const fixedCode = '10001';

  // Start of day IST
  const startOfDayIST = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth(),
    nowIST.getDate()
  );

  const minutesSinceStart = Math.floor((nowIST - startOfDayIST) / 60000);

  const baseSequence = 9670;

  const sequenceNumber = baseSequence + minutesSinceStart;

  const period = `${dateStr}${fixedCode}${sequenceNumber}`;

  return period;
}

// Function to generate random size and color
function getRandomSize() {
  return Math.random() < 0.5 ? 'BIG' : 'SMALL';
}

function getRandomColor() {
  return Math.random() < 0.5 ? { text: 'RED', emoji: '🔴' } : { text: 'GREEN', emoji: '🟢' };
}

// Function to send message
function sendWingoMessage() {
  const period = generateDynamicPeriod();
  const size = getRandomSize();
  const colorObj = getRandomColor();

  const message = `Market : Wingo 1 Min\n\n` +
    `Period : ${period}\n` +
    `Size : ${size}\n` +
    `Colour : ${colorObj.emoji}\n\n` +
    `FB999 - Win More than Ever`;

  bot.telegram.sendMessage(channelId, message)
    .then(() => {
      console.log(`✅ Sent: ${period}`);
    })
    .catch((err) => {
      console.error("❌ Error sending message:", err);
    });
}

// Start sending every 1 min
setInterval(sendWingoMessage, 60 * 1000);

// Optionally send one immediately at start
sendWingoMessage();

// No need to launch updates handler if you only want to send messages
// bot.launch();  // Only if you want to receive updates


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});