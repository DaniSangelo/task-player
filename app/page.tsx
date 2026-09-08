import { redirect } from "next/navigation";
import Banner from "./_components/Banner";

export default async function Home() {
  redirect('/auth/login');
  // return <Banner />;
}
