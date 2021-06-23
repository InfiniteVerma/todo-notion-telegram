import TelegramBot from "node-telegram-bot-api";
import * as dotenv from 'dotenv';
import { Client } from "@notionhq/client";
dotenv.config()

// replace the value below with the Telegram token you receive from @BotFather
if (!process.env.TOKEN) {
    console.log("Add bot token in .env file")
    process.exit(1);
}

const token = process.env.TOKEN;
const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

async function addItem(text: string) {
    try {
        await notion.request({
            path: "pages",
            method: "post",
            body: {
                parent: { database_id: databaseId },
                properties: {
                    title: {
                        title: [
                            {
                                "text": {
                                    "content": text
                                }
                            }
                        ]
                    }
                }
            }
        })
        console.log("Success! Entry added.")
    } catch (error) {
        console.error(error.body)
    }
}

// Create a bot that uses 'polling' to fetch new updates
const bot: TelegramBot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;

    const resp = match == null ? '' : match[1]; // the captured "whatever"
    // send back the matched "whatever" to the chat
    addItem(resp);
    bot.sendMessage(chatId, resp);

});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});