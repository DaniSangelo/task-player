import z from "zod";

export const formAuthLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "The entered email is not valid" }),
  password: z.string().trim().min(1, {message: "Password is required"}),
})

export type FormAuthLoginSchema = z.input<typeof formAuthLoginSchema>