import * as z from "zod"

export const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactInfo: z.string().min(1, "Contact information is required"),
  address: z.string().min(1, "Address is required"),
  operatingHours: z.string().min(1, "Operating hours are required"),
  logoUrl: z.string().optional(),
})

export type BusinessFormData = z.infer<typeof businessSchema>

