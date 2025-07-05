require('dotenv').config();
const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const app = require('express')()

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Sorry Dear but this bot is Private and using my another user if you want to create your own telegram bot then contact on - @Professional_telegram_bot_create');
});

// Channel ID: use @username or -100... numeric ID
const channelId = process.env.CHANNEL_ID || '@your_channel_name';

// Function to generate dynamic period (with IST timezone)
function generateDynamicPeriod() {
  const nowUTC = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(nowUTC.getTime() + istOffsetMs);

  const dateStr = `${nowIST.getFullYear()}${String(nowIST.getMonth() + 1).padStart(2, '0')}${String(nowIST.getDate()).padStart(2, '0')}`;
  const fixedCode = '10000';

  // Get minutes since IST 00:00
  const istHours = nowIST.getUTCHours();
  const istMinutes = nowIST.getUTCMinutes();
  const totalMinutes = (istHours * 60) + istMinutes;

  const baseSequence = 9671;
  const sequenceNumber = baseSequence + totalMinutes;

  return `${dateStr}${fixedCode}${sequenceNumber}`;
}

// Random size and color
function getRandomSize() {
  return Math.random() < 0.5 ? 'BIG' : 'SMALL';
}

function getRandomColor() {
  return Math.random() < 0.5 ? { text: 'RED', emoji: '🔴' } : { text: 'GREEN', emoji: '🟢' };
}

// Send message
function sendWingoMessage() {
  const period = generateDynamicPeriod();
  const size = getRandomSize();
  const colorObj = getRandomColor();

  const message = `Market : Wingo 1 Min\n\n` +
    `Period : ${period}\n` +
    `Size : 👉 ${size}\n` +
    `Colour : ${colorObj.emoji}\n\n` +
    `𝑯𝑮𝑵𝑰𝑪𝑬 - Vs DK,win More than Ever`;

  bot.telegram.sendMessage(channelId, message)
    .then(() => {
      console.log(`✅ Sent at IST minute start: ${period}`);
    })
    .catch((err) => {
      console.error("❌ Error sending message:", err);
    });
}

// Cron job: every 1 min at 00 sec in IST
cron.schedule('* * * * *', () => {
  sendWingoMessage();
}, {
  timezone: 'Asia/Kolkata'
});

console.log("✅ Cron started, sending message every 1 min at IST 00 sec.");

bot.launch();

// Express app to keep server alive
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
