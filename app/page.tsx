import Header from "./_components/Header";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-16 px-16 bg-white sm:items-start border border-accent-400">
        <Header />
        <h1 className="text-4xl font-bold text-brand-primary mb-4">
          Tailwind v4 is Live!
        </h1>
        <p className="text-gray-400">
          Your globals.css file is successfully managing your styling
          architecture.
        </p>
      </main>
    </div>
  );
}
