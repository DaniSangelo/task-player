"use server";

import { db } from "@/app/_lib/prisma";
import { formSignupSchema, FormSignupSchema } from "./schema";
import bcrypt from "bcryptjs";

export const signupUser = async (data: FormSignupSchema) => {
  const parsedData = formSignupSchema.parse(data);
  const { first_name, last_name, email, password } = parsedData;
  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    },
  });
};