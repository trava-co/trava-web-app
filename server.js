import OpenAI from "openai";
import express from 'express';
import cors from 'cors';
import XLSX from 'xlsx';
import fs from 'fs';

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const doData = XLSX.readFile("./src/activity-excel.xlsx");
const eatData = XLSX.readFile("./src/restaurant-excel.xlsx");

const activityData = XLSX.utils.sheet_to_json(doData.Sheets['chicago things to do'], {header: 1});
const restaurantData = XLSX.utils.sheet_to_json(eatData.Sheets['chicago places to eat'], {header: 1})

const combinedData = activityData.concat(restaurantData);

var assistantID;
var threadID;
var runID;

async function sendUserMsg(tripConcept) {
    console.log("We're operating on thread: " + threadID);
    try {
        // [USERMSG] is sent and added to the thread.
        await openai.beta.threads.messages.create(threadID, {
            role: "user", 
            content: tripConcept
        });

        // Run our assistant so it can generate a response and add to thread.
        var run = await openai.beta.threads.runs.create(threadID, {
            assistant_id: assistantID,
            // max_prompt_tokens: 6000
            // max_completion_tokens: 500
        })
        runID = run.id;
        console.log("We just created a run at " + runID);

        while (run.status !== "completed") {
            console.log(run.status);
            if (run.status === "requires_action") {
                console.log(run.status);
                console.log(run.required_action.submit_tool_outputs.tool_calls[0].function.arguments)
                return run.required_action.submit_tool_outputs.tool_calls[0].function.arguments;
            }
            run = await openai.beta.threads.runs.retrieve(threadID, runID)
        }
        
        var messages = await openai.beta.threads.messages.list(threadID);
        return messages.data[0].content[0].text.value;
        // return run;

    } catch (error) {
        console.error("An error occurred:", error);
        return JSON.stringify("Internal Server Error");
    }
}

async function sendSysInstructions(numDays, destination) {
    var noOfItems = numDays * 3;

    try {
        // New assistant is created with custom number of days based on how many days the user picks.
        // var assistant = await openai.beta.assistants.create({
        //     model: 'gpt-4-turbo',
        //     instructions: `You are an expert travel guide. Based on the given trip concept, respond with the top ${noOfItems} most relevant activities (pull strictly from the file). Don't reuse activities. The only output should be triplets of id (pulled from the file), probability that the user wants that activity (be liberal from 0 to 1), and a very short blurb on why you recommended that. When users provide additional input, adjust the probabilities and return the new list.

        //     You must run the provided getFormattedArguments function`,
        //     tools: [
        //     {
        //         "type": "function",
        //         "function": {
        //             "name": "getFormattedArguments",
        //             "description": "Must be ran with an array of triples",
        //             "parameters": {
        //                 "type": "object",
        //                 "properties": {
        //                     "data": {
        //                         "type": "array",
        //                         "description": "An array of objects where each object contains the ID of the activity, a probability score, and a relevant text blurb.",
        //                         "items": {
        //                             "type": "object",
        //                             "properties": {
        //                                 "id": {
        //                                     "type": "string",
        //                                     "description": "The unique identifier for an activity."
        //                                 },
        //                                 "probability": {
        //                                     "type": "string",
        //                                     "description": "The probability score associated with that activity."
        //                                 },
        //                                 "blurb": {
        //                                     "type": "string",
        //                                     "description": "A little explanation of why this activity is recommended."
        //                                 }
        //                             },
        //                             "required": ["id", "probability", "blurb"]
        //                         }
        //                     }
        //                 }, 
        //                 "required": ["data"]
        //             }
        //         }
        //     }, 
        //     {
        //         "type": "file_search",
        //     }
        // ]
        // });
        assistantID = "asst_Dxpo4z8VvfpLDJn9QfUQ1lyu";

        // Checks which destination the user picked.
        // if (destination === "Chicago") {

        //     const stream = fs.createReadStream("ActivityChi.pdf");

        //     // Create a vector store for the file
        //     let vectorStore = await openai.beta.vectorStores.create({
        //         name: "Final Activity Chicago Vector Store"
        //     });

        //     // Upload the file to the vector store and poll until processing is complete
        //     await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id,  { files: [stream] });

        //     // Attach that vector store to the assistant we created.
        //     await openai.beta.assistants.update(assistant.id, {
        //         tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
        //     });
        // }

        // A new thread is created for the assistant and user to interact on. 
        var thread = await openai.beta.threads.create();
        threadID = thread.id;

        return threadID;
    } catch (error) {
        console.error("An error occurred:", error);
        return JSON.stringify("Internal Server Error");
    }
}

app.post('/file', async(req, res) => {
    if (req.body.params.type === 'do') {
        res.json(combinedData)
    } else if (req.body.type === 'eat') {
        res.json(combinedData)
    }
});

app.post('/ask', async(req, res) => {

    var response;

    if (req.headers.system === "true") {
        response = await sendSysInstructions(req.body.numDays, req.body.destination);
    } else if (req.headers.system === "false") {
        response = await sendUserMsg(req.body.input);
    }

    // assistantID = assistant.id;

    // // A new thread is created for the assistant and user to interact on. 
    // var thread = await openai.beta.threads.create();
    // threadID = thread.id;

    // // [USERMSG] is sent and added to the thread.
    // await openai.beta.threads.messages.create(threadID, {
    //     role: "user", 
    //     content: "Hello"
    // });

    // // Run our assistant so it can generate a response and add to thread.
    // var run = await openai.beta.threads.runs.create(threadID, {
    //     assistant_id: assistantID,
    //     max_prompt_tokens: 1000,
    //     max_completion_tokens: 1000
    // })

    // // res.send(assistantID + " " + threadID + " " + run.id);

    // var runDetails = await openai.beta.threads.runs.retrieve("thread_knBPtKUAcB208Y0Qzj76R9gz", "run_IHtHxc3n6OxMSZDj9goPCknn");

    // while (runDetails.status !== "completed") {
    //     if (runDetails.status === "requires_action") {
    //         var required_actions = runDetails.required_action.submit_tool_outputs;
    //     }
    // }

    // if (runDetails.status === "requires_action") {
    //     await openai.beta.threads.runs.submitToolOutputsAndPoll('thread_knBPtKUAcB208Y0Qzj76R9gz', 'run_IHtHxc3n6OxMSZDj9goPCknn', {tool_outputs: [{"tool_call_id": "call_21yCjguVLpfGNURSmOUqnMPj", "output": "My test!"}]})
    // }

    // res.send(runDetails);
    res.send(response);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




