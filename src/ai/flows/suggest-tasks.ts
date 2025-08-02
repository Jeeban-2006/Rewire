'use server';

/**
 * @fileOverview Suggests tasks based on user's calendar and mood.
 *
 * - suggestTasks - A function that suggests tasks for the user.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  calendarEvents: z.string().describe('The user\'s calendar events for the day.'),
  mood: z.string().describe('The user\'s current mood (e.g., happy, sad, energetic, tired).'),
  pastTasks: z.string().describe('A comma-separated list of the user\'s past tasks with effort estimates'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  suggestedTasks: z.array(z.string()).describe('A list of suggested tasks for the user.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const estimateEffortTool = ai.defineTool({
  name: 'estimateEffort',
  description: 'Estimates the effort (in minutes) required to complete a task based on past tasks.',
  inputSchema: z.object({
    task: z.string().describe('The task to estimate effort for.'),
  }),
  outputSchema: z.number().describe('The estimated effort in minutes.'),
}, async (input) => {
  // Dummy implementation - replace with actual effort estimation logic
  return 30; 
});

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  tools: [estimateEffortTool],
  prompt: `You are a personal assistant that suggests tasks to the user based on their calendar, mood and their past tasks.

  Calendar events: {{{calendarEvents}}}
  Mood: {{{mood}}}
  Past Tasks: {{{pastTasks}}}

  Consider the user's mood and calendar events when suggesting tasks.  Use the estimateEffort tool to estimate effort required for each task.
  Suggest tasks that are appropriate for the user's current mood and available time.
  For example, if the user is tired, suggest easy tasks.
  If the user has a meeting coming up, suggest tasks that can be completed before the meeting.
`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
