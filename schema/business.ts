import * as z from "zod"

export const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  email: z.string().min(1, "Business email is required"),
  phoneNumber: z.string().min(1, "Business phone Number is required"),
  address: z.string().min(1).optional(),
  operatingHours: z.string().min(1).optional(),
  logoUrl: z.string().optional(),
})

export type BusinessFormData = z.infer<typeof businessSchema>

