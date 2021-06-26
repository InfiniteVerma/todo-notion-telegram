export interface Todo {
    text: string;
    isChecked: boolean;
}

export function todoListToString(list: any): string {
    if (list.length < 1) return "";

    let res = "";

    list.forEach((ele: Todo) => {
        res += ((ele.isChecked ? "✔️" : "◻️") + " " + ele.text + "\n")
    })

    return res;
}