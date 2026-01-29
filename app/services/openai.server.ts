import OpenAI from 'openai';
import type { ChatMessage } from '~/features/tasks/types';

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function getChatCompletion(messages: ChatMessage[]) {
  const completion = await client.chat.completions.create({
    model: 'gpt-5.2',
    messages,
  });

  return completion.choices[0].message.content;
}