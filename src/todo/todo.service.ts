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
  } catch (error: any) {
    console.error(error);
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

    console.log(response);

    return response;
  } catch (error: any) {
    console.error(error.body);
  }
};

const clearTodoList = async () => {
  try {
    // const response = await notion.blocks.delete({
    //   block_id: blockID!,
    // });

    // console.log(response);
  } catch (e) {}
};

export { listTodoItems, addTodoItem, clearTodoList };
