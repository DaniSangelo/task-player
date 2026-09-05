import Banner from "./_components/Banner";

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center py-16 px-16 sm:items-start space-y-10">
        <Banner />
      </main>
    </div>
  );
}
