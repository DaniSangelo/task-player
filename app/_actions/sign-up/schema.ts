import z from "zod";

export const formSignupSchema = z.object({
  first_name: z.string().trim().min(1, { message: "Name is required" }),
  last_name: z.string().trim().max(100).optional(),
  email: z.string().trim().min(1, { message: "Email is required" }),
  password: z.string().trim().min(1, { message: "Password is required" })
})

export type FormSignupSchema = z.input<typeof formSignupSchema>;