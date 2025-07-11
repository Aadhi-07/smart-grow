'use server';

/**
 * @fileOverview A gardening assistant chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ChatMessage, ChatMessageSchema } from '../schemas/chat-schema';
export type { ChatMessage };

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({history, message}) => {
    const {text} = await ai.generate({
      prompt: [
        ...history,
        {
          role: 'user',
          content: message,
        },
      ],
      system: `You are a friendly and helpful gardening assistant for a web app called TerraGrow.
        Your goal is to provide concise, practical, and easy-to-understand advice to users about their terrace gardens.
        Keep your answers short and to the point. Use simple language.
        If a question is not related to gardening, politely decline to answer and steer the conversation back to gardening.
      `,
    });

    return {response: text};
  }
);
