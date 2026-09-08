import { redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";

export default async function Initial() {
  const session = await auth();

  if (session?.user?.id) redirect("/home");

  redirect("/auth/login");
}
