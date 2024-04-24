import fs from 'fs';
import OpenAI from "openai";
const client = new OpenAI();

async function main() {
  const stream = fs.createReadStream("ActivityChi.pdf");

  // Create a vector store for the file
  let vectorStore = await client.beta.vectorStores.create({
    name: "Activity Chicago Vector Store"
  });

  // Upload the file to the vector store and poll until processing is complete
  await client.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id,  { files: [stream] });
}

main();