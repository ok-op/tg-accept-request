const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Endpoint for webhook
app.use(bot.webhookCallback('/webhook'));

// Define the webhook path and URL
const WEBHOOK_PATH = '/webhook';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://your-domain.com';  // Replace with your actual URL

bot.telegram.setWebhook(`${URL}${WEBHOOK_PATH}`);

bot.on('chat_join_request', async (ctx) => {
    const { from, chat } = ctx.update.chat_join_request;

    try {
        // Approve the join request
        await ctx.telegram.approveChatJoinRequest(chat.id, from.id);

        // Create a message with an image, a button, and tag for the user
        const messageText = `🎉 Congratulations [${from.first_name}](tg://user?id=${from.id}), your request to join the channel "${chat.title}" has been accepted!`;

        // Send an image with a message and button
        await ctx.telegram.sendPhoto(from.id, {
            source: 'angelLogo/angel.jpg'  // Replace with the correct image path or URL
        }, {
            caption: messageText,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Join our Update Channel', url: 'https://t.me/Opleech_WD' }]
                ]
            }
        });

        console.log(`Approved join request for user: ${from.username || from.id} in channel: ${chat.title}`);
    } catch (error) {
        console.error(`Failed to accept join request for ${from.id}:`, error);
    }
});

// Start the express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
