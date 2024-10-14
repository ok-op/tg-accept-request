const { Telegraf } = require('telegraf');
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

        // Send a message to the user whose request was accepted
        await ctx.telegram.sendMessage(from.id, `Your request to join the channel "${chat.title}" has been accepted!`);

        console.log(`Approved join request for user: ${from.username || from.id} in channel: ${chat.title}`);
    } catch (error) {
        console.error(`Failed to accept join request for ${from.id}:`, error);
    }
});

// Start the express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
