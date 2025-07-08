import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.GEMMANI_AI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const context: any[] = [];


async function intractWithLLM() {
    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: context
    });
    context.push(response.choices[0].message)
    console.log(response.choices[0].message.content);
}
async function init() {
    const input = require('prompt-sync')({ sigint: false });
    while (true) {
        const userInput = input("Need Help Ask With me:");
        if (userInput.toLowerCase() === "exit") {
            console.log("Bye...");
            break;
        }
        context.push({
            role: "user",
            content: userInput,
        });
        await intractWithLLM();
    }

}
init();