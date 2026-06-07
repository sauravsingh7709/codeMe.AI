// src/inngest/functions.ts
import { firecrawl } from "@/lib/firecrawl";
import { inngest } from "./client";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const urlRegex = /(https?:\/\/[^\s]+)/g;

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {

    // fetch prompt from event data
    const { prompt } = event.data as { prompt: string };

    //Now extract any url from that prompt and fetch the content of that url using firecrawl and 
    // then pass that content to the generateText function as context for generating the response.

    const urls=await step.run("extract-urls", async () => {
      const urls = prompt.match(urlRegex);
      return urls || [];
    }) as string[];

    // Now scrape the url content using firecrawl and pass that content to the generateText function
    //  as context for generating the response.

    const scrapedContent=await step.run("scrape-urls", async () => {
      const contents = await Promise.all(urls.map(async (url) => {
        const result=await firecrawl.scrape(
          url,
          {formats:["markdown"]}
        );
        return result.markdown ?? null;
      }));

      return contents.filter(Boolean).join("\n\n");
    });
    const finalPrompt=scrapedContent ? `${prompt}\n\nContext:\n${scrapedContent}` : prompt;
    const result=await step.run("generate-text", async () => {
    return await generateText({
      model: openai('gpt-4.1-nano'),
      prompt: finalPrompt,
    });
    })

    await step.sleep("pause", "1s"); 

    return { message: `Task ${event.data.id} complete`, result };
  }
);