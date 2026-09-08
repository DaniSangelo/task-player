'use server';

import { db } from "@/app/_lib/prisma";
import { formAuthLoginSchema, FormAuthLoginSchema } from "./schema";
import bcrypt from "bcryptjs";

export const authUser = async (data: FormAuthLoginSchema) => {
  formAuthLoginSchema.parse(data);
  const user = await db.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(data.password as string, user.password);

  if (!isPasswordValid) return null;
  return {
    id: user.id,
    name: user.first_name,
    email: user.email,
  };
}