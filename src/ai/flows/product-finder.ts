// src/ai/flows/product-finder.ts
'use server';
/**
 * @fileOverview A product finder AI agent.
 *
 * - productFinder - A function that handles the product finding process.
 * - ProductFinderInput - The input type for the productFinder function.
 * - ProductFinderOutput - The return type for the productFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductFinderInputSchema = z.object({
  specs: z.string().describe('The desired specifications of the product.'),
  usageScenario: z.string().describe('The intended usage scenario for the product.'),
  inventory: z.string().describe('A description of available products, and their features')
});
export type ProductFinderInput = z.infer<typeof ProductFinderInputSchema>;

const ProductFinderOutputSchema = z.object({
  productName: z.string().describe('The name of the product that best matches the user needs.'),
  justification: z.string().describe('The justification for why this product is the best match.')
});
export type ProductFinderOutput = z.infer<typeof ProductFinderOutputSchema>;

export async function productFinder(input: ProductFinderInput): Promise<ProductFinderOutput> {
  return productFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productFinderPrompt',
  input: {schema: ProductFinderInputSchema},
  output: {schema: ProductFinderOutputSchema},
  prompt: `You are an expert product finder for ByteFront, a Nigerian tech brand specializing in laptops, smartphones, and accessories.

  Given the user's desired specifications and usage scenario, and the current product inventory, identify the best product for the user.

  Desired Specifications: {{{specs}}}
  Usage Scenario: {{{usageScenario}}}
  Product Inventory: {{{inventory}}}

  Return the product name and a brief justification for your choice.
  `,
});

const productFinderFlow = ai.defineFlow(
  {
    name: 'productFinderFlow',
    inputSchema: ProductFinderInputSchema,
    outputSchema: ProductFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
