import TelegramBot from "node-telegram-bot-api";
import * as dotenv from 'dotenv';
import { addTodoItem, listTodoItems } from "./todo/todo.service";
dotenv.config()

const token = process.env.TOKEN;

// replace the value below with the Telegram token you receive from @BotFather
if (!token) {
    console.log("Add bot token in .env file")
    process.exit(1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot: TelegramBot = new TelegramBot(token, { polling: true });

bot.onText(/\/add (.+)/, (msg, match) => {

    const resp = match![1];

    addTodoItem(resp);

    bot.sendMessage(msg.chat.id, "Added to list.");
});

bot.onText(/\/list/, async (msg, match) => {

    const res = await listTodoItems()

    bot.sendMessage(msg.chat.id, res!);
})