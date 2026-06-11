import { z } from "zod";

export const ProspectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().min(1, "Company is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  value: z.coerce.number().min(0, "Value must be positive"),
  notes: z.string().optional(),
});

export const GenerationSchema = z.object({
  type: z.enum(["image", "video", "presentation", "email", "landing-page", "social-post"]),
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(5000),
  quality: z.enum(["standard", "premium", "ultra"]).optional(),
});

export type ProspectInput = z.infer<typeof ProspectSchema>;
export type GenerationInput = z.infer<typeof GenerationSchema>;
