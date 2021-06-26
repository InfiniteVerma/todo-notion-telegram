import { Client } from "@notionhq/client";
import { ToDoBlock } from "@notionhq/client/build/src/api-types";
import * as dotenv from 'dotenv';
import { todoListToString } from "./todo.interface";
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const blockID = process.env.NOTION_BLOCK_ID;

async function listTodoItems() {
    try {
        const response = await notion.blocks.children.list({
            block_id: blockID!,
        });

        const texts = response.results.map((ele) => ele as ToDoBlock).map((item) => ({
            'text': item.to_do.text[0].plain_text, 'isChecked': item.to_do.checked
        }))

        return todoListToString(texts);
    } catch (error) {
        console.error(error.body)
    }
}

async function addTodoItem(item: string) {
    try {
        const response = await notion.blocks.children.append({
            block_id: blockID!,
            children: [
                {
                    id: "asdf",
                    created_time: Date.now().toString(),
                    last_edited_time: Date.now().toString(),
                    object: 'block',
                    type: 'to_do',
                    has_children: false,
                    to_do: {
                        text: [{
                            type: "text",
                            text: {
                                content: item,
                            },
                            plain_text: item,
                            annotations: {
                                bold: false,
                                italic: false,
                                strikethrough: false,
                                underline: false,
                                code: false,
                                color: "default"
                            }
                        }],
                        checked: false,

                    }
                }
            ]
        })

        console.log(response);

        return response;
    } catch (error) {
        console.error(error.body)
    }
}

export { listTodoItems, addTodoItem };