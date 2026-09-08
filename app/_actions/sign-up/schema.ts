import z from "zod";

export const formSignupSchema = z.object({
  first_name: z.string().trim().min(1, { message: "Name is required" }),
  last_name: z.string().trim().max(100).optional(),
  email: z.string().trim().min(1, { message: "Email is required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
  confirm_password: z.string().trim().min(1, { message: "Password must be confirmed" })
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
})

export type FormSignupSchema = z.input<typeof formSignupSchema>;