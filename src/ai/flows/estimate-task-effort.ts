'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating task effort based on past user behavior.
 *
 * - estimateTaskEffort - A function that estimates the effort required for a given task.
 * - EstimateTaskEffortInput - The input type for the estimateTaskEffort function.
 * - EstimateTaskEffortOutput - The return type for the estimateTaskEffort function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateTaskEffortInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  pastTasks: z.array(z.object({
    taskDescription: z.string(),
    actualEffortMinutes: z.number().int().positive(),
  })).describe('An array of past tasks with their descriptions and actual effort in minutes.'),
});
export type EstimateTaskEffortInput = z.infer<typeof EstimateTaskEffortInputSchema>;

const EstimateTaskEffortOutputSchema = z.object({
  estimatedEffortMinutes: z.number().int().positive().describe('The estimated effort for the task in minutes.'),
  reasoning: z.string().describe('The reasoning behind the estimated effort.'),
});
export type EstimateTaskEffortOutput = z.infer<typeof EstimateTaskEffortOutputSchema>;

export async function estimateTaskEffort(input: EstimateTaskEffortInput): Promise<EstimateTaskEffortOutput> {
  return estimateTaskEffortFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateTaskEffortPrompt',
  input: {schema: EstimateTaskEffortInputSchema},
  output: {schema: EstimateTaskEffortOutputSchema},
  prompt: `You are an AI assistant that estimates the effort required for a task based on past tasks.

  Analyze the following past tasks and their actual effort to understand the user's work patterns:

  Past Tasks:
  {{#each pastTasks}}
  - Task: {{{taskDescription}}}, Effort: {{{actualEffortMinutes}}} minutes
  {{/each}}

  Now, estimate the effort in minutes for the following task:

  Task Description: {{{taskDescription}}}

  Consider the task description and the past tasks to provide an accurate estimate.
  Explain your reasoning in the reasoning field.
  Include the estimated effort as an integer in the estimatedEffortMinutes field.
  `,
});

const estimateTaskEffortFlow = ai.defineFlow(
  {
    name: 'estimateTaskEffortFlow',
    inputSchema: EstimateTaskEffortInputSchema,
    outputSchema: EstimateTaskEffortOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
