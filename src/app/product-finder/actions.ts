'use server';

import { productFinder, ProductFinderInput, ProductFinderOutput } from '@/ai/flows/product-finder';
import { z } from 'zod';

const FormSchema = z.object({
  specs: z.string().min(10, { message: 'Please describe the desired specifications in more detail (at least 10 characters).' }),
  usageScenario: z.string().min(10, { message: 'Please describe your usage scenario in more detail (at least 10 characters).' }),
});

export type FormState = {
  message: string;
  result?: ProductFinderOutput;
  errors?: {
    specs?: string[];
    usageScenario?: string[];
  };
};

// This inventory is a placeholder. In a real app, this would be fetched from a database.
const MOCK_INVENTORY = `
- Product: "StellarBook Pro 15", Category: Laptop, Price: NGN 850,000, Specs: 15-inch 4K Display, Core i9, 32GB RAM, 1TB SSD, RTX 4070. Best for: Professional video editing, 3D rendering, high-end gaming.
- Product: "AeroPad Slim", Category: Laptop, Price: NGN 450,000, Specs: 13-inch FHD Display, Core i7, 16GB RAM, 512GB SSD. Best for: Business professionals, students, on-the-go productivity.
- Product: "GalaxyPhone X", Category: Smartphone, Price: NGN 550,000, Specs: 6.7-inch AMOLED, Snapdragon 8 Gen 2, 12GB RAM, 256GB Storage, 108MP Camera. Best for: Photography enthusiasts, mobile gamers.
- Product: "Nova-i12", Category: Smartphone, Price: NGN 280,000, Specs: 6.5-inch LCD, MediaTek Helio G99, 8GB RAM, 128GB Storage, 50MP Camera. Best for: Everyday use, social media, budget-conscious users.
- Product: "ZenBook Duo", Category: Laptop, Price: NGN 980,000, Specs: 14-inch OLED + 12.6-inch ScreenPad Plus, Intel Core i7, 16GB RAM, 1TB SSD. Best for: Multitasking power users, content creators.
- Product: "Pixel Pro 8", Category: Smartphone, Price: NGN 620,000, Specs: 6.7-inch LTPO OLED, Tensor G3, 12GB RAM, 256GB Storage. Best for: Users who want the best AI camera features and stock Android.
`;

export async function findProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    specs: formData.get('specs'),
    usageScenario: formData.get('usageScenario'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Error: Please correct the fields below.',
    };
  }
  
  const { specs, usageScenario } = validatedFields.data;

  try {
    const input: ProductFinderInput = {
      specs,
      usageScenario,
      inventory: MOCK_INVENTORY,
    };

    const result = await productFinder(input);

    return { result, message: "Success: We found a product that matches your needs!" };
  } catch (error) {
    console.error("AI Product Finder Error:", error);
    return { message: 'Error: An unexpected error occurred while finding your product. Please try again later.' };
  }
}
