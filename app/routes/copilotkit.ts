import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime";

import { client } from "~/services/chat.server";
import { findSimilarTasks } from "~/services/task.server";

// CopilotKit's OpenAIAdapter expects openai.beta.chat.completions.stream (SDK v4).
// OpenAI SDK v6 removed beta.chat; chat completions are at client.chat.completions.
// Wrapper provides the expected path for compatibility.
const openaiForCopilotKit = Object.assign(client, {
  beta: {
    chat: {
      completions: client.chat.completions,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serviceAdapter = new OpenAIAdapter({ openai: openaiForCopilotKit as any });

const runtime = new CopilotRuntime({
  actions: () => [
    {
      name: "tasksVectorSearch",
      description: `
  When the user asks about tasks, run a vector search to find them.
      -	The content may not be in the title or description but will be in the task body.
    -	Return the full data and the task link.
  Use the following markdown template to present the results:
  
  ### [title](http://localhost:5173/task/view/<id>)
  
  > description
  
  **Estimated time**: estimated_time
        `,
      parameters: [
        {
          name: "content",
          type: "string",
          description: "The context for the similarity search",
          required: true,
        },
      ],
      handler: async ({ content }) => await findSimilarTasks(content, 6, 0.2),
    },
  ],
});

export async function action({ request }: { request: Request }) {
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: "/copilotkit", // This can be ignored or used for logging
    runtime,
    serviceAdapter,
  });

  return handler(request);
}