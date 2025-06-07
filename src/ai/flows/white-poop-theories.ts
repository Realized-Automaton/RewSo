// src/ai/flows/white-poop-theories.ts
'use server';

/**
 * @fileOverview Explores absurd theories behind 'White Poop' using an LLM.
 *
 * - generateWhitePoopTheory - A function that generates absurd theories about white poop.
 * - WhitePoopTheoriesInput - The input type for the generateWhitePoopTheory function.
 * - WhitePoopTheoriesOutput - The return type for the generateWhitePoopTheory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhitePoopTheoriesInputSchema = z.object({
  query: z
    .string()
    .describe('The user query to generate absurd theories about white poop.'),
});
export type WhitePoopTheoriesInput = z.infer<typeof WhitePoopTheoriesInputSchema>;

const WhitePoopTheoriesOutputSchema = z.object({
  theory: z.string().describe('An absurd theory about white poop.'),
});
export type WhitePoopTheoriesOutput = z.infer<typeof WhitePoopTheoriesOutputSchema>;

export async function generateWhitePoopTheory(input: WhitePoopTheoriesInput): Promise<WhitePoopTheoriesOutput> {
  return whitePoopTheoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whitePoopTheoriesPrompt',
  input: {schema: WhitePoopTheoriesInputSchema},
  output: {schema: WhitePoopTheoriesOutputSchema},
  prompt: `You are an expert in absurd theories, especially those regarding the Bernstein Bears books and white poop.
  Generate an imaginative and humorous theory about white poop based on the user's query.

  User Query: {{{query}}}

  Do not mention any specific facts and instead generate a very unlikely theory.`,
});

const whitePoopTheoriesFlow = ai.defineFlow(
  {
    name: 'whitePoopTheoriesFlow',
    inputSchema: WhitePoopTheoriesInputSchema,
    outputSchema: WhitePoopTheoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
