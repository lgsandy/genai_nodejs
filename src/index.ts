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
        messages: context,
        tools: [
            {
                type: "function",
                function: {
                    name: "getTimeInUsa",
                    description: "Get current time in NewYork"
                }
            },
            {
                type: "function",
                function: {
                    name: "getInfoAboutAdart",
                    description: "Tell me about Apollodart in hyderabad"
                }
            },
        ],
        tool_choice: "auto" //enable to call function
    });
    context.push(response.choices[0].message)
    console.log(response.choices[0].message.content);
    //decide which ttl to call
    const willInvodeTool = response.choices[0].finish_reason === "tool_calls";
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (willInvodeTool) {
        console.log("Calling tool")
        //get tool name
        const toolName = toolCall?.function.name;
        console.log("Tool name::", toolName)
        if (toolName === "getTimeInUsa") {
            const time = getTimeInUsa();
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: time,
                tool_call_id: toolCall?.id ?? ""
            })
        }
        if (toolName === "getInfoAboutAdart") {
            const info = getInfoAboutAdart();
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: info,
                tool_call_id: toolCall?.id ?? ""
            })
        }
        const response2 = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: context,
        });
        console.log(response2.choices[0].message.content);
    }



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

function getTimeInUsa() {
    return new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
}
function getInfoAboutAdart() {
    return `Apollodart KI Solution is Located in Hyderabad Hitech city. There ate nearly 20 employees names are Vipin,Aslam,Vinay,Sampath,Salman and others..`
}
init();