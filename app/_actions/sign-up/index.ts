import { db } from "@/app/_lib/prisma";
import { formSignupSchema, FormSignupSchema } from "./schema";
import bcrypt from 'bcrypt';

export const signupUser = async (data: FormSignupSchema) => {
  formSignupSchema.parse(data);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
    }
  })

  //TODO:
  //1. Redirect user
  //2. Set token session
}