import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import { todoListToString } from "./todo.interface";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_KEY });
const blockID = process.env.NOTION_BLOCK_ID;

const listTodoItems = async () => {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockID!,
    });

    const texts = response.results.map((item: any) => ({
      text: item.to_do.rich_text[0].plain_text,
      isChecked: item.to_do.checked,
    }));

    return todoListToString(texts);
  } catch (e: any) {
    console.error(e.body);
  }
};

const addTodoItem = async (item: string) => {
  try {
    const response = await notion.blocks.children.append({
      block_id: blockID!,
      children: [
        {
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: item,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
              },
            ],
            checked: false,
          },
        },
      ],
    });

    return "Added to list.";
  } catch (e: any) {
    console.error(e.body);
    return "Something went wrong";
  }
};

// get block ids and call delete on each
const clearTodoList = async () => {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockID!,
    });

    const ids = response.results.map((blocks) => blocks.id);

    // const x = await Promise.all(
    //   ids.map(async (id) => {
    //     await notion.blocks.delete({
    //       block_id: id,
    //     });
    //   })
    // );

    for (let id of ids) {
      await notion.blocks.delete({
        block_id: id,
      });
    }

    return "Cleared";
  } catch (e: any) {
    console.log(e.body);
    return "Something went wrong";
  }
};

export { listTodoItems, addTodoItem, clearTodoList };
