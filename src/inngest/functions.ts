// src/inngest/functions.ts
import { inngest } from "./client";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
     const result=await step.run("generate-text", async () => {
      return await generateText({
        model: openai('gpt-4.1-nano'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
      });
    })

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);