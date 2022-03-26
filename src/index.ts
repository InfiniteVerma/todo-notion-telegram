import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import { addTodoItem, clearTodoList, listTodoItems } from "./todo/todo.service";
dotenv.config();

const token = process.env.TOKEN;

// replace the value below with the Telegram token you receive from @BotFather
if (!token) {
  console.log("Add bot token in .env file");
  process.exit(1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot: TelegramBot = new TelegramBot(token, { polling: true });

bot.onText(/\/add (.+)/, async (msg, match) => {
  const resp = match![1];

  const res = await addTodoItem(resp);

  bot.sendMessage(msg.chat.id, res);
});

bot.onText(/\/list/, async (msg, match) => {
  const res = await listTodoItems();

  bot.sendMessage(
    msg.chat.id,
    res?.length === 0 ? "No todo items present!" : res!
  );
});

bot.onText(/\/clear/, async (msg, match) => {
  const res = await clearTodoList();

  bot.sendMessage(msg.chat.id, res);
});

// bot.onText(/\/done (.+)/, async (msg, match) => {
//   const resp = parseInt(match![1]);

//   if (isNaN(resp)) {
//     bot.sendMessage(msg.chat.id, "Not a valid number");
//   } else {
//     bot.sendMessage(msg.chat.id, "asdf");
//   }
// });

bot.onText(/\/help/, async (msg, match) => {
  bot.sendMessage(
    msg.chat.id,
    "Commands List: \n1. /add <item>\n2. /list\n3. /clear"
  );
});
