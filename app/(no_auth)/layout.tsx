import "../globals.css";

export default function NoAuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <div className="flex flex-1 flex-col items-center justify-center bg-white">
        <main className="flex w-full min-w-0 max-w-7xl flex-1 flex-col items-center justify-between space-y-10 px-4 py-10 sm:items-star sm:px-16 sm:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
