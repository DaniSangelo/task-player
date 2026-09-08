'use server';

import { db } from "@/app/_lib/prisma";
import { formAuthLoginSchema, FormAuthLoginSchema } from "./schema";

export const authUser = async (data: FormAuthLoginSchema) => {
  formAuthLoginSchema.parse(data);
  const user = await db.user.findUnique({
    where: {
      email: data.email
    }
  })
  // TODO:
  // 4. Create user session
  // 5. Redirect user
  return user;
}