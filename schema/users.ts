import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\d{11}$/, "Phone number must be exactly 10 digits"),
      formShareURL: z.string().min(1, "Invalid formId"),
  });
  
  export type UserSchemaType = z.infer<typeof userSchema>;