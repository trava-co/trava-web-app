import { OpenAI } from "openai";

var assistantID;
var threadID;

const openai = new OpenAI({
    apiKey: "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"
});

var assistant = await openai.beta.assistants.create({
    model: 'gpt-3.5-turbo-0125',
    instructions: `Use the provided function to correct formatting.`,
    tools: [{
        "type": "function",
        "function": {
            "name": "correctFormatting",
            "description": "Creates the correct formatted output for the word.",
            "parameters": {
                "type": "object",
                "properties": {
                    "inputString": {
                        "type": "string",
                        "description": "A string input that you need to process."
                    }
                },
                "required": ["inputString"]
            }
        }
    }]
});

assistantID = assistant.id;

// A new thread is created for the assistant and user to interact on. 
var thread = await openai.beta.threads.create();
threadID = thread.id;

// [USERMSG] is sent and added to the thread.
await openai.beta.threads.messages.create(threadID, {
    role: "user", 
    content: "Hello"
});

// Run our assistant so it can generate a response and add to thread.
var run = await openai.beta.threads.runs.create(threadID, {
    assistant_id: assistantID,
    max_prompt_tokens: 256,
    max_completion_tokens: 16
})


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/ask', async(req, res) => {
    var response;
    // if (req.headers.system === 'false') {
    //     var output = await sendUserMsg(req.body.inputValue);
    //     res.send(output);
    // } else if (req.headers.system === 'true') {
    //     output = sendSysInstructions(req.body.numDays, req.body.destination);
    // }
    
    if (req.headers.system === 'true') {
        response = await sendSysInstructions(req.body.numDays, req.body.destination);
        console.log(response);
    } else if (req.headers.system === 'false') {
        console.log(req.body.input);
        response = await sendUserMsg(req.body.input);
    }

    res.send(response);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
