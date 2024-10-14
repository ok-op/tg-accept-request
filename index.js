const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.launch().then(() => {
    console.log('Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
