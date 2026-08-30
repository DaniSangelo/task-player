import Banner from "./_components/Banner";
import Header from "./_components/Header";
import { DataTable } from "./_components/ui/tasks/data-table";
import { getTasks } from "./_data-access/tasks/get-tasks";
import { Circle } from "lucide-react";
import { columns } from "./_components/ui/tasks/columns";

export default async function Home() {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-1 w-full max-w-7xl flex-col items-center justify-between py-16 px-16 sm:items-star">
        <Header />
        <Banner />
        <div className="flex flex-col border border-accent-100/50 rounded-md mb-10">
          <div className="flex px-5 py-5 items-center gap-2 border-b border-accent-100/50">
            <Circle size={10} className="fill-accent-500 text-accent-500" />
            <p className="text-sm">Tarefas de hoje</p>
            <p className="text-[10px] text-secondary-500 bg-accent-50 rounded-full py-1 px-2">
              {tasks.length}
            </p>
          </div>
          <DataTable columns={columns} data={tasks} />
        </div>

        <footer className="flex flex-col w-full px-16">
          <p className="tracking-widest font-heading uppercase text-xs font-semibold text-accent-950/50">
            Tempo total
          </p>
          <div className="flex gap-2 items-baseline">
            <p className="text-4xl font-bold text-accent-950">04:06:33</p>
            <p className="text-sm opacity-50">horas</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
