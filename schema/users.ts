import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    formId: z.string().url("Invalid URL format"),
  });
  
  export type UserSchemaType = z.infer<typeof userSchema>;