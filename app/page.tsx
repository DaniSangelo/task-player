import Banner from "./_components/Banner";
import Header from "./_components/Header";
import { DataTable } from "./_components/ui/data-table";
import { tasksTableColumns } from "./_components/table-columns";
import { getTasks } from "./_data-access/tasks/get-tasks";

export default async function Home() {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-16 px-16 sm:items-star">
        <Header />
        <Banner />
        <DataTable columns={tasksTableColumns} data={tasks} />
        <footer className="flex flex-col w-full p-1">
          <p className="tracking-widest font-heading uppercase text-xs font-semibold text-accent-950/50">Tempo total</p>
          <div className="flex gap-2 items-baseline">
            <p className="text-4xl font-bold text-accent-950">04:06:33</p>
            <p className="text-sm opacity-50">horas</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
